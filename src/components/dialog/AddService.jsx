import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import AddServiceMake from './AddServiceMake';
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

export default function AddService({ open, handleClose }) {
  const setShowCursor = useInfoStore(state => state.setShowCursor);
  const [openMakeService, setOpenMakeService] = useState(false);

  const handleShowDialog = () => {
    setOpenMakeService(true);
  };

  const handleCloseShowDialog = () => {
    setOpenMakeService(false);
  };

  useEffect(() => {
    setShowCursor(false);
  }, []);

  return (
    <React.Fragment>
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
          Додаткові послуги
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: '16px',
            top: '16px',
            color: '#a6ff00',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#fff',
              transform: 'rotate(180deg)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent className="bg-[#1a1a1a]">
          <div className="p-6 space-y-6 text-white">
            <AnimatedText delay={0.1}>
              <h2 className="text-2xl font-semibold text-[#a6ff00] mb-4">
                Вартість додаткових послуг, пов'язаних з роботою доступу до мережі Інтернет для абонентів Opticom:
              </h2>
            </AnimatedText>

            <AnimatedText delay={0.2}>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="text-[#a6ff00] mt-1">•</span>
                  <span>Налаштування роутерів, ТВ-приставок в офісах провайдера Intelekt – безкоштовно.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#a6ff00] mt-1">•</span>
                  <span>Налаштування основного роутера технічним спеціалістом з виїздом до абонента – 300 грн.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#a6ff00] mt-1">•</span>
                  <span>Підключення кабелем (до 10 м.) та налаштування ТВ-приставок, телевізорів технічним спеціалістом з виїздом до абонента – безкоштовно.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#a6ff00] mt-1">•</span>
                  <span>Підключення послуги "Статична IP адреса" – 50 грн/міс.</span>
                </li>
              </ul>
            </AnimatedText>

            <AnimatedText delay={0.3}>
              <h2 className="text-2xl font-semibold text-[#a6ff00] mb-4">
                Побудова та обслуговування внутрішніх локальних мереж зв'язку абонента (кабельних та радіо):
              </h2>
            </AnimatedText>

            <AnimatedText delay={0.4}>
              <div className="space-y-4 bg-[#111111] p-4 rounded-lg border border-[#a6ff00]">
                <p>
                  Перша година (оплата за транспортні витрати, компенсація оплати часу монтажників у дорозі, робота монтажників – у вартість включається робота монтажників від 1 хв. до 60 хв. у абонента) – <span className="text-[#a6ff00]">600 грн</span>.
                </p>
                <p>
                  Друга та наступні години – <span className="text-[#a6ff00]">300 грн./година</span>. за межами м. Чернівці – додатково <span className="text-[#a6ff00]">10 грн</span>. за 1 км. від м. Чернівці.
                </p>
              </div>
            </AnimatedText>

            <AnimatedText delay={0.5}>
              <p className="mt-6 font-semibold text-[#a6ff00]">
                Якщо Ви бажаєте замовити додаткову послугу (виїзд майстра, тощо), скористайтесь кнопкою 'Продовжити' та слідуйте інструкціями !
              </p>
            </AnimatedText>
          </div>
        </DialogContent>
        <DialogActions className="bg-[#111111] p-4">
          <Button 
            onClick={handleShowDialog}
            sx={{
              backgroundColor: '#a6ff00',
              color: '#000',
              borderRadius: '9999px',
              padding: '8px 24px',
              textTransform: 'none',
              fontWeight: 'bold',
              marginRight: '8px',
              '&:hover': {
                backgroundColor: '#fff',
                color: '#000',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Продовжити
          </Button>
          <Button 
            onClick={() => { handleClose(); setShowCursor(true); }}
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
              transition: 'all 0.3s ease'
            }}
          >
            Закрити
          </Button>
        </DialogActions>
      </Dialog>
      <AddServiceMake open={openMakeService} handleCloseService={handleClose} handleClose={handleCloseShowDialog} />
    </React.Fragment>
  );
}