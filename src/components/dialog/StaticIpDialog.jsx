import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { Button, Input, TextField } from '@mui/material';
import useStore from '../../store/store';
import useInfoStore from '../../store/infoStore';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AnimatedText = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

export default function StaticIpDialog({ open, handleClose, handleAction }) {
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  const user = useStore(state => state.user) || {};
  const phoneUser = user.phone || '';
  const addStaticRequest = useStore(state => state.addStaticRequest);
  const login = useStore(state => state.user.login);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);

  const validatePhone = (phoneNumber = '') => {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return false;
    }
    const phoneStr = phoneNumber.replace(/\D/g, '');
    return phoneStr.startsWith('38') && phoneStr.length === 12;
  };

  useEffect(() => {
    if (phoneUser && typeof phoneUser === 'string') {
      setPhone(phoneUser);
      setIsValid(validatePhone(phoneUser));
    }
  }, [phoneUser]);

  const handlePhoneChange = (e) => {
    const newPhone = e.target.value || '';
    setPhone(newPhone);
    setIsValid(validatePhone(newPhone));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid) {
      setIsSubmitted(true);
      if (handleAction) {
        let result;
        try {
          setLoader(true);
          result = await addStaticRequest(login, phone);
          
          if (result.success) {
            showAllert(2, result.message);
          } else {
            showAllert(0, result.message);
          }
        } catch (error) {
          console.error('Error in handleStaticRequest:', error);
          showAllert(2, "Виникла непередбачена помилка");
        } finally {
          setLoader(false);
          handleClose();
        }
      }
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        style: {
          backgroundColor: '#f5f5f5',
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle className="text-center text-3xl font-bold text-green-600 pb-4 border-b border-gray-300">
        Статична IP-адреса
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent className="bg-white">
        <div className="p-6 space-y-6 text-gray-800">
          <AnimatedText delay={0.2}>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-600">Для чого потрібна статична IP-адреса?</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Віддалений доступ до пристроїв і домашніх серверів</li>
                <li>Надійна робота онлайн-ігор та стрімінгових сервісів</li>
                <li>Стабільний доступ до систем відеоспостереження</li>
                <li>Захищений доступ до корпоративних мереж (VPN)</li>
                <li>Хостинг веб-серверів та інших мережевих сервісів</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                Статична IP-адреса залишається незмінною при кожному підключенні, що гарантує стабільність роботи ваших сервісів.
              </p>
            </div>
          </AnimatedText>       
      
          {!isSubmitted ? (
            <AnimatedText delay={0.4}>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ваш номер телефону
                  </label>
                  <TextField
                    type="tel"
                    placeholder="38"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full p-2 border rounded"
                    required
                    error={phone.length > 0 && !isValid}
                    helperText={phone.length > 0 && !isValid ? "Номер повинен починатись з 38 та містити 12 цифр" : ""}
                  />
                </div>
              </form>
            </AnimatedText>
          ) : (
            <AnimatedText delay={0.1}>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  Дякуємо за заявку!
                </h3>
                <p className="text-gray-800">
                  Ми зв'яжемося з вами найближчим часом для підключення послуги.
                </p>
              </div>
            </AnimatedText>
          )}
        </div>
      </DialogContent>

      <DialogActions className="bg-gray-100 p-4">
        <Button 
          onClick={handleClose}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Закрити вікно
        </Button>
        {!isSubmitted && (
          <Button 
            onClick={handleSubmit}
            disabled={!isValid}
            className={`font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 
              ${isValid 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Замовити статичну IP-адресу
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}