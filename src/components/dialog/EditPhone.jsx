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
import { createTheme, ThemeProvider } from '@mui/material/styles';

const steps = ['Введіть номер телефону', 'Підтвердження номеру телефону'];

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a6ff00',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a6ff00',
    },
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditPhone({open, handleClose, handleAction}) {
  const [phone, setPhone] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Store hooks
  const requestPhoneChange = useStore(state => state.requestPhoneChange);
  const confirmPhoneChange = useStore(state => state.confirmPhoneChange);
  const uid = useStore(state => state.user.uid);
  const login = useStore(state => state.user.login);
  const phoneOld = useStore(state => state.user.phone);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);

  // Functions remain the same
  const isStepSkipped = (step) => skipped.has(step);
  const handleNext = async () => {
    setIsSubmitting(true);
    setLoader(true);

    try {
      let result;
      if (activeStep === 0) {
        const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
        
        if (!uid || !login || !cleanPhone) {
          throw new Error('Відсутні обов\'язкові дані');
        }

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
        if (!uid || !login || !verificationCode || !phoneOld) {
          throw new Error('Відсутні обов\'язкові дані');
        }

        const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+/, '');
        result = await confirmPhoneChange(uid, login, verificationCode, phoneOld, cleanPhone);

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
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(166, 255, 0, 0.15)',
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#a6ff00',
            '&:hover': {
              color: '#fff',
              transform: 'rotate(180deg)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent className="bg-[#1a1a1a]">
          <div className="max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-4 text-[#a6ff00]">
              {activeStep === 0 ? 'Введіть новий номер телефону' : 'Введіть код підтвердження'}
            </h2>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: "column" }}>
              <Stepper 
                orientation="vertical"
                activeStep={activeStep}
                sx={{
                  '& .MuiStepLabel-label': {
                    color: '#fff',
                    '&.Mui-active': {
                      color: '#a6ff00',
                    }
                  },
                  '& .MuiStepIcon-root': {
                    color: '#333',
                    '&.Mui-active': {
                      color: '#a6ff00',
                    },
                    '&.Mui-completed': {
                      color: '#a6ff00',
                    }
                  }
                }}
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
                      style: { color: '#fff' }
                    }}
                    autoFocus
                    fullWidth
                    margin='normal'
                    defaultCountry='UA'
                    value={phone}
                    onChange={handlePhoneChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#a6ff00',
                        },
                        '&:hover fieldset': {
                          borderColor: '#fff',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#a6ff00',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#a6ff00',
                      }
                    }}
                  />
                ) : (
                  <TextField
                    id="verification-code"
                    label="Код підтвердження"
                    value={verificationCode}
                    onChange={handleCodeChange}
                    helperText="Введіть код з SMS"
                    autoFocus
                    inputProps={{
                      maxLength: 6,
                      pattern: '[0-9]*',
                      style: { color: '#fff' }
                    }}
                    sx={{
                      marginTop: 2,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#a6ff00',
                        },
                        '&:hover fieldset': {
                          borderColor: '#fff',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#a6ff00',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#a6ff00',
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#fff',
                      }
                    }}
                  />
                )}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    disabled={activeStep === 0 || isSubmitting}
                    onClick={handleBack}
                    sx={{
                      mr: 1,
                      color: '#fff',
                      '&:not(:disabled)': {
                        '&:hover': {
                          color: '#a6ff00',
                        }
                      }
                    }}
                  >
                    Назад
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button 
                    onClick={handleNext}
                    disabled={isNextDisabled() || isSubmitting}
                    sx={{
                      backgroundColor: '#a6ff00',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#fff',
                        transform: 'scale(1.05)',
                      },
                      '&:disabled': {
                        backgroundColor: '#333',
                        color: '#666'
                      },
                      transition: 'all 0.3s ease',
                      borderRadius: '9999px',
                      padding: '8px 24px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    {isSubmitting ? 'Зачекайте...' : (activeStep === steps.length - 1 ? 'Підтвердити' : 'Далі')}
                  </Button>
                </Box>
              </Box>
            </Box>
          </div>
        </DialogContent>
        <DialogActions className="bg-[#111111] p-4">
          <Button 
            onClick={() => {
              setActiveStep(0);
              setPhone("");
              setVerificationCode("");
              handleClose();
            }}
            disabled={isSubmitting}
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              borderRadius: '9999px',
              padding: '8px 24px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#444',
                transform: 'scale(1.05)',
              },
              '&:disabled': {
                backgroundColor: '#222',
                color: '#666'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Закрити
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}