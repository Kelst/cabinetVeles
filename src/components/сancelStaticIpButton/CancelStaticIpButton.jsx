import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import CloseIcon from '@mui/icons-material/Close';
import useConfigPage from '../../store/configPage';
import useStore from '../../store/store';
import useInfoStore from '../../store/infoStore';

const CancelStaticIpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const configCabinet = useConfigPage(state => state.configCabinet);
  const removeStaticRequest=useStore(state=>state.removeStaticRequest)
  const login=useStore(state=>state.user.login)
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert=useInfoStore(state=>state.showAllert)  
  const handleCancel = async () => {
    let result
    try {
      // Показуємо лоадер
      setLoader(true);

      // Викликаємо функцію створення заявки
       result = await removeStaticRequest(login);

      if (result.success) {
          // Показуємо успішне повідомлення
          showAllert(2,result.message)
      } else {
          // Показуємо повідомлення про помилку
          showAllert(0,result.message)

      }
  } catch (error) {
      console.error('Error in handleStaticRequest:', error);
      showAllert(2,"Виникла непередбачена помилка")

  } finally {
      // Приховуємо лоадер в будь-якому випадку
      setLoader(false);
      setIsOpen(false);
  }
    
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if   (!configCabinet.home.staticIp) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        variant="outlined"
        onClick={() => setIsOpen(true)}
        style={{
          backgroundColor: '#f9fafb',
          color: '#111827',
          borderColor: '#e5e7eb',
          '&:hover': {
            backgroundColor: '#f3f4f6',
            borderColor: '#d1d5db'
          }
        }}
      >
        Відмінити статичну IP-адресу
      </Button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px'
          }
        }}
      >
        <DialogTitle style={{ paddingRight: '48px' }}>
          Відміна статичної IP-адреси
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
        </DialogTitle>

        <DialogContent>
          <DialogContentText component="div">
            <p style={{ color: '#4b5563', marginBottom: '16px' }}>
              Ви можете відмовитись від використання статичної IP-адреси натиснувши кнопку нижче.
            </p>
            <p style={{ color: '#111827', fontWeight: 500, marginBottom: '16px' }}>
              Після підтвердження статична IP-адреса більше не буде активною.
            </p>
            <p style={{ color: '#ef4444' }}>
              Послуга буде відмінена в найкоротший можливий термін.
            </p>
          </DialogContentText>
        </DialogContent>

        <DialogActions style={{ padding: '16px' }}>
          <Button
            onClick={handleClose}
            style={{
              backgroundColor: '#f9fafb',
              color: '#111827',
              borderColor: '#e5e7eb',
              '&:hover': {
                backgroundColor: '#f3f4f6'
              }
            }}
          >
            Скасувати
          </Button>
          <Button
            onClick={handleCancel}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              '&:hover': {
                backgroundColor: '#dc2626'
              }
            }}
            variant="contained"
          >
            Вимкнути статичну IP
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CancelStaticIpButton;