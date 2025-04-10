import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
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

export default function StopPlayDialog({open, handleClose}) {
  const user = useStore(state => state.user);
  const stopPlayLogin = useStore(state => state.stopPlayLogin);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);

  const handleOncklick = async () => {
    let result;
    try {
      setLoader(true);
      result = await stopPlayLogin(user.uid, user.login, user.balance, user.billId, user.payAll);
    } catch (error) {
      showAllert(0, "Виникла помилка при призупиненні/активації послуги");
    } finally {
      handleClose();
      setLoader(false);
      if (result.disabled == '3') {
        showAllert(2, "Послугу призупинено");
      } else if (result.disabled == '0') {
        showAllert(2, "Послугу активовано, Будь ласка перезавантажте ваше інтернет обладнання!");
      } else {
        showAllert(0, "Виникла помилка при призупиненні/активації послуги");
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
          boxShadow: '0 4px 30px black',
        },
      }}
    >
      <DialogTitle className="text-center text-3xl font-bold text-[#77d6ff] pb-4 border-b border-[#77d6ff]">
        Призупинити послугу
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#77d6ff',
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
        <div className="p-6 space-y-6 text-white">
          <AnimatedText delay={0.1}>
            <h2 className="text-2xl font-semibold text-[#77d6ff] mb-4">
              Важлива інформація щодо призупинення та відновлення послуг:
            </h2>
          </AnimatedText>

          <AnimatedText delay={0.2}>
            <div className="bg-[#5b8bd8] p-4 rounded-lg border border-[#77d6ff]">
              <p className="leading-relaxed">
                Ми розуміємо, що іноді у вас можуть виникнути обставини, які вимагають тимчасового призупинення наших послуг. З радістю повідомляємо, що ви маєте можливість призупинити послуги протягом мінімального терміну – <span className="font-semibold text-[#77d6ff]">1 місяця</span>. Важливо зазначити, що ви можете в будь-який момент відновити послуги.
              </p>
            </div>
          </AnimatedText>

          <AnimatedText delay={0.3}>
            <p className="leading-relaxed">
              Це надає вам <span className="font-semibold text-[#77d6ff]">гнучкість</span> у керуванні своїм обліковим записом та можливість <span className="font-semibold text-[#77d6ff]">економії</span> в тих випадках, коли ви тимчасово не використовуєте наші послуги.
            </p>
          </AnimatedText>

          <AnimatedText delay={0.4}>
            <div className="bg-[#5b8bd8] p-4 rounded-lg border border-[#77d6ff] mt-4">
              <p className="leading-relaxed">
                Якщо у вас виникли питання або вам потрібна додаткова інформація щодо процедури призупинення та відновлення послуг, будь ласка, <span className="font-semibold text-[#77d6ff]">звертайтеся до нашої служби підтримки</span>. Ми завжди готові допомогти вам у зручний для вас спосіб.
              </p>
            </div>
          </AnimatedText>
        </div>
      </DialogContent>
      <DialogActions className="bg-[#5b8bd8] p-4">
        <Button 
          onClick={handleOncklick}
          sx={{
            backgroundColor: '#77d6ff',
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
          {user?.status ? 'Призупинити послугу' : 'Активувати послугу'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}