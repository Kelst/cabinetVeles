import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { MuiTelInput } from 'mui-tel-input';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useStore from '../../store/store';
import useInfoStore from '../../store/infoStore';

const steps = ['Введіть номер телефону', 'Підтвердження номеру телефону'];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditPhone({open, handleClose, handleAction}) {
  const [phone, setPhone] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const requestPhoneChange = useStore(state => state.requestPhoneChange);
  const confirmPhoneChange = useStore(state => state.confirmPhoneChange);
  const uid = useStore(state => state.user.uid);
  const login = useStore(state => state.user.login);
  const phoneOld = useStore(state => state.user.phone);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    setIsSubmitting(true);
    setLoader(true);

    try {
      let result
      if (activeStep === 0) {
        // Очищаємо номер телефону від пробілів та '+'
        const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
        
        console.log('Sending data:', uid, login, cleanPhone); // Для дебагу

        // Перевіряємо наявність всіх необхідних даних
        if (!uid || !login || !cleanPhone) {
          throw new Error('Відсутні обов\'язкові дані');
        }

        // Відправляємо параметри окремо, не як об'єкт
        const result = await requestPhoneChange(uid, login, cleanPhone);

        if (result && result.success) {
          let newSkipped = skipped;
          if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
          }
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setSkipped(newSkipped);
          showAllert(2,'Код підтвердження відправлено');
        } else {
          throw new Error(result?.message || 'Помилка при відправці коду');
        }
      } else if (activeStep === 1) {
        // Перевіряємо наявність всіх необхідних даних
        if (!uid || !login || !verificationCode || !phoneOld) {
          throw new Error('Відсутні обов\'язкові дані');
        }

        // Відправляємо параметри окремо
        const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');

         result = await confirmPhoneChange(uid, login, verificationCode, phoneOld,cleanPhone);

        if (result && result.success) {
          showAllert(2,'Номер телефону успішно змінено');
          handleClose();
          if (handleAction) handleAction();
        } else {
          throw new Error(result?.message || 'Невірний код підтвердження');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      showAllert(0,error.message || 'Виникла помилка', 'error');
    } finally {
      setLoader(false);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setVerificationCode('');
  };

  const handlePhoneChange = (newValue) => {
    setPhone(newValue);
  };

  const handleCodeChange = (event) => {
    // Обмежуємо введення тільки цифрами
    const value = event.target.value.replace(/[^\d]/g, '');
    setVerificationCode(value);
  };

  const isNextDisabled = () => {
    if (activeStep === 0) {
      const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
      return cleanPhone.length < 12;
    }
    return verificationCode.length === 0;
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <div className="max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-4">
              {activeStep === 0 ? 'Введіть новий номер телефону' : 'Введіть код підтвердження'}
            </h2>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: "column" }}>
              <Stepper 
                orientation="vertical"
                activeStep={activeStep}
              >
                {steps.map((label, index) => (
                  <Step key={label} {...(isStepSkipped(index) ? { completed: false } : {})}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ mt: 2 }}>
                {activeStep === 0 ? (
                  <MuiTelInput
                    inputProps={{
                      maxLength: 16,
                    }}
                    autoFocus
                    fullWidth
                    margin='normal'
                    defaultCountry='UA'
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                ) : (
                  <TextField
                    id="verification-code"
                    label="Код підтвердження"
                    value={verificationCode}
                    onChange={handleCodeChange}
                    helperText="Введіть код з SMS"
                    sx={{ marginTop: 2 }}
                    autoFocus
                    inputProps={{
                      maxLength: 6,
                      pattern: '[0-9]*'
                    }}
                  />
                )}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0 || isSubmitting}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Назад
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button 
                    onClick={handleNext}
                    sx={{ color: 'black' }}
                    disabled={isNextDisabled() || isSubmitting}
                  >
                    {isSubmitting ? 'Зачекайте...' : (activeStep === steps.length - 1 ? 'Підтвердити' : 'Далі')}
                  </Button>
                </Box>
              </Box>
            </Box>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{
            setActiveStep(1)
            setPhone("")
            setVerificationCode("")
            handleClose()}} sx={{ color: 'black' }} disabled={isSubmitting}>
            Закрити
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}