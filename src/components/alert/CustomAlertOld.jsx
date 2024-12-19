import { Alert, Snackbar } from '@mui/material';
import { useEffect } from 'react';

const CustomAlertOld = ({ open, type, handleClose, message }) => {
  useEffect(()=>{
    console.log("FROM CWSTUM ", open, type, handleClose, message );
    
  },[open])
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={6000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={type === 0 ? "error" : "success"} 
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlertOld;