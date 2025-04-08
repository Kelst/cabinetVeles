import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { MuiTelInput } from 'mui-tel-input';
import TextField from '@mui/material/TextField';
import useInfoStore from '../../store/infoStore';
import useStore from '../../store/store';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function normalizePhoneNumber(phoneNumber) {
  let cleanedNumber = phoneNumber.replace(/\D/g, '');
  if (cleanedNumber.startsWith('380')) {
    cleanedNumber = cleanedNumber.slice(3);
  } else if (cleanedNumber.startsWith('80')) {
    cleanedNumber = cleanedNumber.slice(2);
  }
  cleanedNumber = cleanedNumber.replace(/^0+/, '');
  return cleanedNumber;
}

export default function AddServiceMake({open, handleClose, handleCloseService}) {
  const user = useStore(state => state.user);
  const [phone, setPhone] = React.useState(`+380${normalizePhoneNumber(user.phone)}`);
  const [text, setText] = React.useState('');
  
  const addAdditionalService = useStore(state => state.addAdditionalService);
  const login = useStore(state => state.user.login);
  const uid = useStore(state => state.user.uid);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);

  const maxLength = 200;
  const minTextLength = 10;

  const handleChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      setText(newText);
    }
  };

  const handlePhoneChange = (newValue) => {
    setPhone(newValue);
  };

  const isValid = () => {
    const phoneDigits = phone.replace(/\D/g, '');
    return phoneDigits.length >= 12 && text.length >= minTextLength;
  };

  const sendRequest = async () => {
    try {
      setLoader(true);
      const result = await addAdditionalService(uid, login, phone, text);
      if (result.success) {
        showAllert(2, "Дякуємо за вашу заявку, майстер зв'яжеться з вами для уточнення деталей.");
      } else {
        showAllert(0, result.message);
      }
    } catch (error) {
      showAllert(0, "Виникла помилка при створенні заявки");
    } finally {
      setLoader(false);
      setText("");
      setPhone("");
      handleCloseService();
      handleClose();
    }
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
        <DialogTitle className="text-center text-3xl font-bold text-red-600 pb-4 border-b border-gray-300">
          Додаткові послуги
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: '16px',
            top: '16px',
            color: '#6b7280',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'rotate(180deg)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
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
          <TextField
            sx={{mt:1}}
            fullWidth
            label={`Опишіть ваше завдання (${maxLength - text.length} символів залишилося)`}
            multiline
            maxRows={4}
            variant="standard"
            value={text}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={sendRequest} 
            sx={{color:'sky-800'}} 
            disabled={!isValid()}
          >
            Залишити заявку
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}