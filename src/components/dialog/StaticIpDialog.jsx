import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { Button, TextField } from '@mui/material';
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
          backgroundColor: '#1a1a1a',
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(166, 255, 0, 0.15)',
        },
      }}
    >
      <DialogTitle className="text-center text-3xl font-bold text-[#a6ff00] pb-4 border-b border-[#a6ff00]">
        Статична IP-адреса
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#a6ff00',
          '&:hover': {
            color: '#fff'
          }
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent className="bg-[#1a1a1a]">
        <div className="p-6 space-y-6 text-white">
          <AnimatedText delay={0.2}>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-[#a6ff00] mb-4">Для чого потрібна статична IP-адреса?</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <span className="text-[#a6ff00]">•</span>
                  <span>Віддалений доступ до пристроїв і домашніх серверів</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#a6ff00]">•</span>
                  <span>Надійна робота онлайн-ігор та стрімінгових сервісів</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#a6ff00]">•</span>
                  <span>Стабільний доступ до систем відеоспостереження</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#a6ff00]">•</span>
                  <span>Захищений доступ до корпоративних мереж (VPN)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#a6ff00]">•</span>
                  <span>Хостинг веб-серверів та інших мережевих сервісів</span>
                </li>
              </ul>
              <p className="text-sm text-gray-400 mt-4">
                Статична IP-адреса залишається незмінною при кожному підключенні, що гарантує стабільність роботи ваших сервісів.
              </p>
            </div>
          </AnimatedText>       
      
          {!isSubmitted ? (
            <AnimatedText delay={0.4}>
              <form className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-[#a6ff00] mb-2">
                    Ваш номер телефону
                  </label>
                  <TextField
                    type="tel"
                    placeholder="38"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    error={phone.length > 0 && !isValid}
                    helperText={phone.length > 0 && !isValid ? "Номер повинен починатись з 38 та містити 12 цифр" : ""}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: '#a6ff00',
                        },
                        '&:hover fieldset': {
                          borderColor: '#fff',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#a6ff00',
                        }
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#ff4444',
                      }
                    }}
                  />
                </div>
              </form>
            </AnimatedText>
          ) : (
            <AnimatedText delay={0.1}>
              <div className="text-center p-6 bg-[#111111] rounded-lg border border-[#a6ff00] mt-6">
                <h3 className="text-xl font-semibold text-[#a6ff00] mb-2">
                  Дякуємо за заявку!
                </h3>
                <p className="text-white">
                  Ми зв'яжемося з вами найближчим часом для підключення послуги.
                </p>
              </div>
            </AnimatedText>
          )}
        </div>
      </DialogContent>

      <DialogActions className="bg-[#111111] p-4">
        <Button 
          onClick={handleClose}
          sx={{
            backgroundColor: '#a6ff00',
            color: '#000',
            borderRadius: '9999px',
            padding: '8px 24px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#fff',
              color: '#000',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          Закрити вікно
        </Button>
        {!isSubmitted && (
          <Button 
            onClick={handleSubmit}
            disabled={!isValid}
            sx={{
              backgroundColor: isValid ? '#a6ff00' : '#333',
              color: isValid ? '#000' : '#666',
              borderRadius: '9999px',
              padding: '8px 24px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': isValid ? {
                backgroundColor: '#fff',
                color: '#000',
                transform: 'scale(1.05)',
              } : {},
              transition: 'all 0.3s ease',
              cursor: isValid ? 'pointer' : 'not-allowed'
            }}
          >
            Замовити статичну IP-адресу
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}