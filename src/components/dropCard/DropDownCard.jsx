import { Button, Paper, Slide, Snackbar, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import CloseIcon from '@mui/icons-material/Close';
import useStore from '../../store/store';
import { useNavigate } from 'react-router-dom';

export default function DropDownCard({ open, user, handleClose, transition }) {
  const navigate = useNavigate();
  const { logIn } = useStore();
  const [isClosing, setIsClosing] = React.useState(false);
  const buttonRef = React.useRef(null);
  const timerRef = React.useRef(null);

  const [showAlert, setShowAlert] = React.useState({
    open: false,
    type: 0,
    message: ""
  });

  const handleCloseWithTransition = () => {
    setIsClosing(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setTimeout(() => {
      handleClose();
      setIsClosing(false);
    }, 7000);
  };

  const handleAutoLogin = async () => {
    try {
      const auth = await logIn(user.login, user.password);
      
      if (!auth.flag) {
        setShowAlert({
          open: true,
          type: 0,
          message: auth.errText || 'Помилка при вході'
        });
      } else {
        navigate("/home");
      }
    } catch (error) {
      setShowAlert({
        open: true,
        type: 0,
        message: error?.message || 'Несподівана помилка при вході'
      });
    }
  };

  useEffect(() => {
    if (open && user?.login && buttonRef.current && !isClosing) {
      timerRef.current = setTimeout(() => {
        buttonRef.current?.click();
      }, 6000);
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [open, user, isClosing]);

  if (!user?.login) return null;

  return (
    <Snackbar
      TransitionComponent={transition}
      open={open && !isClosing}
      onClose={handleCloseWithTransition}
      autoHideDuration={10000}
      key={'top' + 'center'}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        '& .MuiSnackbar-root': {
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      <Paper 
        elevation={4} 
        square={false} 
        className='relative p-2 text-center w-[300px] lg:w-[600px] sm:w-[200px] pb-[40px]'
      >
        <Typography variant="h6" className="mb-2">Привіт 👋</Typography>
        <div className='flex justify-center flex-col items-center gap-3 md:flex-col sm:flex-col'>
          <p className=''>
            ввійти за обліковим записом <span className='font-bold'>{user.login}</span> ?
          </p>
          <Button
            ref={buttonRef}
            sx={{
              color: 'black',
              borderColor: 'black',
              ":hover": { borderColor: 'red' }
            }}
            variant='outlined'
            onClick={handleAutoLogin}
            endIcon={<NavigationOutlinedIcon className='rotate-90' />}
          >
            Ввійти
          </Button>
        </div>
        <div 
          onClick={handleCloseWithTransition}
          className="absolute top-2 right-2 cursor-pointer"
        >
          <CloseIcon />
        </div>
      </Paper>
    </Snackbar>
  );
}