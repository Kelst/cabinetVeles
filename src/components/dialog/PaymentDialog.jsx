import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CalculateIcon from '@mui/icons-material/Calculate';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import DialogDiscount from './DialogDiscount';
import useStore from '../../store/store';
import { useEffect } from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: 'black',
    },
  },
}));

function generatePrivatbankPaymentLink(amount, acc) {
  const baseUrl = 'https://my-payments.privatbank.ua/mypayments/customauth/identification/fp/static';
  const staticToken = '2bc390c2d56f7e662830e89fbb154578u6a94p9f';
  const formattedAmount = parseFloat(amount).toFixed(2);
  return `${baseUrl}?staticToken=${staticToken}&acc=${acc}&amount=${formattedAmount}`;
}

const calculateRequiredAmount = (login) => {
  const monthlyPayment = login.payAll === 0 ? login.monthlyPayment : login.payAll;
  const currentBalance = login.balance;
  
  if (currentBalance < 0) {
    // Якщо баланс від'ємний, потрібно погасити борг + внести абонплату
    return Math.abs(currentBalance) + monthlyPayment;
  } else {
    // Якщо баланс додатній, але менший за місячну плату
    return Math.max(0, monthlyPayment - currentBalance);
  }
};

const getPaymentInfo = (selectedLogin) => {
  if (!selectedLogin) return null;

  const monthlyPayment = selectedLogin.payAll === 0 ? selectedLogin.monthlyPayment : selectedLogin.payAll;
  const currentBalance = selectedLogin.balance;
  const requiredAmount = calculateRequiredAmount(selectedLogin);

  if (currentBalance < 0) {
    return (
      <div 
        style={{
          backgroundColor: '#f8f9fa',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          marginTop: '16px'
        }}
      >
        <div style={{
          borderBottom: '2px solid #ef5350',
          marginBottom: '16px',
          paddingBottom: '8px'
        }}>
          <div style={{
            color: '#d32f2f',
            fontSize: '18px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              backgroundColor: '#ffebee',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              Заборгованість: {Math.abs(currentBalance)} грн
            </span>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{
            padding: '12px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontWeight: 500, marginBottom: '4px', color: '#424242' }}>
              Для користування послугами інтернету до кінця поточного місяця будь ласка погасіть заборгованість:
            </div>
            <div style={{ color: '#2196f3', fontSize: '16px', fontWeight: 500 }}>
              {Math.abs(currentBalance)} грн
            </div>
          </div>

          <div style={{
            padding: '12px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontWeight: 500, marginBottom: '4px', color: '#424242' }}>
              Для користування послугами інтернету до кінця поточного місяця та оплати наступного місяця ви можете оплатити:
            </div>
            <div style={{ color: '#2196f3', fontSize: '16px', fontWeight: 500 }}>
              {requiredAmount} грн
            </div>
          </div>
        </div>
      </div>
    );
  } else if (requiredAmount > 0) {
    return (
      <div className="flex flex-col gap-2">
        <div>
          Поточний баланс: {currentBalance} грн
        </div>
        <div>
          Для користування інтернетом у наступному місяці необхідно доплатити: {requiredAmount} грн
        </div>
      </div>
    );
  }
  return null;
};

export default function PaymentDialog({open, handleClose, type}) {
  const [selectedLoginIndex, setSelectedLoginIndex] = React.useState('0');
  const [subLogin, setSubLogin] = React.useState([]);
  const [sumText, setSumText] = React.useState("0");
  const [openDiscount, setOpenDiscount] = React.useState(false);
  const user = useStore(state => state.userData);
  const getPortmoneLink = useStore(state => state.getPortmoneLink);
  const getEasypayLink = useStore(state => state.getEasypayLink);
  const getPrivat24Link = useStore(state => state.getPrivat24Link);
  const getLiqPayLink = useStore(state => state.getLiqPayLink);

  const isValidAmount = Number(sumText) >= 3;

  useEffect(() => {
    if (type === 'city24' && open) {
      const newWindow = window.open('https://city24.ua/ua/popolnit-internet/opticom-plus', '_blank');
      if (newWindow) {
        newWindow.opener = null;
      }
      handleClose();
    }
  }, [type, open, handleClose]);

  useEffect(() => {
    if (user) {
      const result = [
        {
          monthlyPayment: user.monthlyPayment,
          payAll: user.payAll,
          balance: user.balance,
          login: user.login
        }
      ];
      
      if (user.subLogin && Array.isArray(user.subLogin)) {
        result.push(...user.subLogin);
      }
  
      setSubLogin(result);
      
      const requiredAmount = calculateRequiredAmount(result[0]);
      setSumText(requiredAmount > 0 ? requiredAmount.toString() : '0');
      setSelectedLoginIndex('0');
    }
  }, [user]);

  const handleSumChange = (event) => {
    const value = event.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setSumText(value);
    }
  };

  const getSelectedLogin = () => {
    return subLogin[selectedLoginIndex]?.login || user.login;
  };

  const handleRedirectTo = async(paymentType) => {
    const amount = Number(sumText);
    if (amount < 3) return;

    const selectedLogin = getSelectedLogin();

    switch (paymentType) {
      case 'easypay':
        const dataEasypay = await getEasypayLink(selectedLogin, sumText);
        window.open(dataEasypay.link, '_blank');
        break;
      case 'portmone':
        const dataPortmone = await getPortmoneLink(selectedLogin, sumText);
        window.open(dataPortmone.link, '_blank');
        break;
      case 'liqpay':
        const dataLiqpay = await getLiqPayLink(selectedLogin, sumText);
        window.open(dataLiqpay.link, '_blank');
        break;
      case 'privat24':
        const dataPrivat24 = await getPrivat24Link(selectedLogin, sumText);
        window.open(dataPrivat24.link, '_blank');
        break;
      default:
        break;
    }
  };

  const handleShowDiscount = () => {
    setOpenDiscount(true);
  };

  const handleChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedLoginIndex(selectedIndex);
    
    const selectedLogin = subLogin[selectedIndex];
    if (selectedLogin) {
      const requiredAmount = calculateRequiredAmount(selectedLogin);
      setSumText(requiredAmount > 0 ? requiredAmount.toString() : '0');
    }
  };

  const getCurrentMonthlyPayment = () => {
    const selectedLogin = subLogin[selectedLoginIndex];
    return selectedLogin ? (selectedLogin.payAll === 0 ? selectedLogin.monthlyPayment : selectedLogin.payAll) : '0';
  };

  if (type === 'city24') {
    return null;
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth={'lg'}
      >
        <DialogTitle className="text-center text-lg tracking-wider min-w-[280px]">
          Спосіб оплати {type}
        </DialogTitle>
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
        <DialogContent className='flex justify-center items-center'>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">Логін</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              input={<BootstrapInput />}
              value={selectedLoginIndex}
              label="Логін"
              onChange={handleChange}
            >
              {subLogin.map((item, index) => (
                <MenuItem key={index} value={index}>
                  {item.login} - баланс <span className='text-xl font-bold'> ({item.balance})</span> грн.
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Виберіть необхідний логін</FormHelperText>
            <div className="mt-4">
              {getPaymentInfo(subLogin[selectedLoginIndex])}
            </div>
            <div className='flex flex-col gap-1 sm:flex-row'>
              <TextField
                id="outlined-helperText"
                value={sumText}
                onChange={handleSumChange}
                type='text'
                inputProps={{ 
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                error={!isValidAmount}
                helperText={!isValidAmount ? "Мінімальна сума поповнення 3 грн" : "Рекомендована сума"}
                sx={{marginTop:"20px"}}
              />
              <Button
                sx={{fontSize:'12px'}}
                color="primary"
                size="small"
                variant="filledTonal"
                endIcon={<CalculateIcon />}
                onClick={handleShowDiscount}
              >
                розрахувати 12 міс.
              </Button>
            </div>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Tooltip title={!isValidAmount ? "Сума поповнення не може бути менше 3 грн" : ""}>
            <span>
              <Button 
                onClick={() => handleRedirectTo(type)} 
                sx={{color:'black'}}
                disabled={!isValidAmount}
              >
                Продовжити
              </Button>
            </span>
          </Tooltip>
        </DialogActions>
      </Dialog>
      
      <DialogDiscount 
        open={openDiscount}
        handleAction={(sums) => setSumText(sums)}
        handleClose={() => setOpenDiscount(false)}
        monthlyPayment={getCurrentMonthlyPayment()}
      />
    </React.Fragment>
  );
}