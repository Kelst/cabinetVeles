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

export default function ClearMAC({open, handleClose}) {
  const user = useStore(state => state.user)
  const clearCid = useStore(state => state.clearCid)
  const setLoader = useInfoStore(store => store.setLoader)
  const showAllert = useInfoStore(state => state.showAllert)
  
  const handleOnClick = async () => {
    let result
    try {
      setLoader(true)
      result = await clearCid(user.uid)
    } catch (error) {
      showAllert(0, "Виникла помилка при очищенні MAC-адреси")
    } finally {
      if (result.success) {
        showAllert(2, "MAC-адресу успішно очищено. Будь ласка, перезавантажте ваше інтернет-обладнання!")
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showAllert(0, "Виникла помилка при очищенні MAC-адреси")
      }
      setLoader(false)
      handleClose()
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
          backgroundColor: '#e6f7ff',
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(135, 206, 235, 0.2)',
        },
      }}
    >
      <DialogTitle className="text-center text-3xl font-bold text-sky-500 pb-4 border-b border-sky-200">
        Очищення MAC-адреси
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#87CEEB',
          '&:hover': {
            color: '#4eb5eb',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className="bg-gradient-to-r from-sky-50 to-blue-50">
        <div className="p-6 space-y-6 text-gray-800">
          <AnimatedText delay={0.1}>
            <h2 className="text-2xl font-semibold text-sky-500 mb-4">
              Важлива інформація щодо очищення MAC-адреси:
            </h2>
          </AnimatedText>

          <AnimatedText delay={0.2}>
            <p className="leading-relaxed">
              Коли ви змінюєте пристрій доступу до інтернету, наприклад, роутер, необхідно очистити прив'язку по MAC-адресі, щоб встановити новий пристрій. Це забезпечить <span className="font-semibold text-sky-500">безперебійний доступ до інтернету</span> з вашого нового обладнання.
            </p>
          </AnimatedText>

          <AnimatedText delay={0.3}>
            <p className="leading-relaxed">
              Процес очищення MAC-адреси <span className="font-semibold text-black">видаляє прив'язку</span> вашого поточного пристрою до нашої мережі. Після очищення ви зможете <span className="font-semibold text-black">підключити новий пристрій</span> без будь-яких проблем.
            </p>
          </AnimatedText>

          <AnimatedText delay={0.4}>
            <p className="leading-relaxed">
              Пам'ятайте, що після очищення MAC-адреси вам потрібно буде <span className="font-semibold text-sky-500">перезавантажити ваше нове інтернет-обладнання</span>, щоб зміни вступили в силу. Якщо у вас виникнуть будь-які питання під час цього процесу, наша служба підтримки завжди готова вам допомогти.
            </p>
          </AnimatedText>
        </div>
      </DialogContent>
      <DialogActions className="bg-sky-50 p-4">
        <Button 
          onClick={handleClose}
          sx={{
            background: 'linear-gradient(135deg, #87CEEB, #5EB1EB)',
            color: 'white',
            borderRadius: '9999px',
            padding: '8px 24px',
            textTransform: 'none',
            fontWeight: 'bold',
            marginRight: '8px',
            '&:hover': {
              background: 'linear-gradient(135deg, #61b5e4, #3a9bde)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          Закрити вікно
        </Button>
        <Button 
          onClick={handleOnClick}
          sx={{
            background: 'linear-gradient(135deg, #87CEEB, #5EB1EB)',
            color: 'white',
            borderRadius: '9999px',
            padding: '8px 24px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(135deg, #61b5e4, #3a9bde)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          Очистити MAC-адресу
        </Button>
      </DialogActions>
    </Dialog>
  );
}