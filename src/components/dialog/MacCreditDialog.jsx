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

export default function MacCreditDialog({open, handleClose, handleAction}) {
  const addCredit = useStore(state => state.addCredit);
  const uid = useStore(state => state.user.uid);
  const login = useStore(state => state.user.login);
  const setLoader = useInfoStore(store => store.setLoader)
  const showAllert = useInfoStore(state => state.showAllert)
 
  const handleSetCredit = async () => {
    let result
    try {
      setLoader(true)
      result = await addCredit(uid, login);
      
      if (result.status) {
        console.log("Session reloaded successfully");
      } else {
        console.log("Failed to reload session");
      }
    } catch (error) {
      
    } finally {
      setLoader(false)
      if(result.status) {
        showAllert(2, result.message)
      } else {
        showAllert(0, result.message)
      }
      handleClose(); 
    }
  }

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
        Встановити кредит 
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
          <AnimatedText delay={0.1}>
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Додаткові 5 днів Інтернету
            </h2>
          </AnimatedText>

          <AnimatedText delay={0.2}>
            <p className="leading-relaxed">
              Одноразово продовжте свій Інтернет на цілих 5 днів за місяць, щоб завжди бути на зв'язку, коли це найбільше потрібно.
            </p>
          </AnimatedText>

          <AnimatedText delay={0.3}>
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Одна унікальна можливість щомісяця
            </h2>
          </AnimatedText>

          <AnimatedText delay={0.4}>
            <p className="leading-relaxed">
              Ця можливість доступна вам тільки один раз за календарний місяць, роблячи її винятковою та цінною.
            </p>
          </AnimatedText>
        </div>
      </DialogContent>
      <DialogActions className="bg-gray-100 p-4">
        <Button 
          onClick={handleClose}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Закрити вікно
        </Button>
        <Button 
          onClick={handleSetCredit}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Продовжити послугу
        </Button>
      </DialogActions>
    </Dialog>
  );
}