import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
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

export default function ReloadSession({ open, handleClose }) {
  const reloadSession = useStore(state => state.reloadSession);
  const uid = useStore(state => state.user.uid);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);

  const onConfirm = async () => {
    try {
      setLoader(true);
      const result = await reloadSession(uid);
      if (result.flag) {
        console.log("Session reloaded successfully");
      } else {
        console.log("Failed to reload session");
      }
    } catch (error) {
    } finally {
      setLoader(false);
      showAllert(2, "Перезавантажте роутер, Сесія зникне через 10 секунд");
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: '#1a1a1a',
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(166, 255, 0, 0.15)',
        },
      }}
    >
      <div className="pt-8 pb-6 px-4 border-b border-[#a6ff00] flex items-center justify-center">
        <h2 className="text-3xl font-bold text-[#a6ff00] flex items-center">
          <RefreshIcon className="mr-2" sx={{ color: '#a6ff00' }} />
          Перезавантаження сесії
        </h2>
      </div>

      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#a6ff00',
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
            <h2 className="text-2xl font-semibold text-[#a6ff00] mb-4">
              Важлива інформація про перезавантаження сесії:
            </h2>
          </AnimatedText>

          <AnimatedText delay={0.2}>
            <div className="bg-[#111111] p-4 rounded-lg border border-[#a6ff00]">
              <p className="leading-relaxed">
                Ми розпочнемо процес <span className="font-semibold text-[#a6ff00]">адміністративного перезавантаження</span> вашої сесії. Це допоможе вирішити можливі проблеми з підключенням та оновити параметри вашого з'єднання.
              </p>
            </div>
          </AnimatedText>

          <AnimatedText delay={0.3}>
            <div className="leading-relaxed">
              Для <span className="font-semibold text-[#a6ff00]">швидшого відновлення</span> інтернет-з'єднання, рекомендуємо вам також <span className="font-semibold text-[#a6ff00]">перезавантажити ваш роутер</span>. Це забезпечить повне оновлення всіх налаштувань мережі.
            </div>
          </AnimatedText>

          <AnimatedText delay={0.4}>
            <div className="bg-[#111111] p-4 rounded-lg border border-[#a6ff00]">
              <div className="leading-relaxed mb-2">Кроки для перезавантаження роутера:</div>
              <ol className="space-y-2">
                <li className="flex items-center">
                  <span className="text-[#a6ff00] mr-2">1.</span>
                  <span>Вимкніть роутер з електромережі</span>
                </li>
                <li className="flex items-center">
                  <span className="text-[#a6ff00] mr-2">2.</span>
                  <span>Зачекайте 30 секунд</span>
                </li>
                <li className="flex items-center">
                  <span className="text-[#a6ff00] mr-2">3.</span>
                  <span>Увімкніть роутер знову</span>
                </li>
                <li className="flex items-center">
                  <span className="text-[#a6ff00] mr-2">4.</span>
                  <span>Дочекайтесь повного завантаження (1-2 хвилини)</span>
                </li>
              </ol>
            </div>
          </AnimatedText>

          <AnimatedText delay={0.5}>
            <div className="leading-relaxed">
              Якщо після цих дій з'єднання не відновиться протягом 5 хвилин, будь ласка, <span className="font-semibold text-[#a6ff00]">зверніться до нашої служби підтримки</span> для додаткової допомоги.
            </div>
          </AnimatedText>
        </div>
      </DialogContent>

      <DialogActions className="bg-[#111111] p-4">
        <Button
          onClick={handleClose}
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
            transition: 'all 0.3s ease',
            marginRight: '8px'
          }}
        >
          Скасувати
        </Button>
        <Button
          onClick={onConfirm}
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
          Перезавантажити сесію
        </Button>
      </DialogActions>
    </Dialog>
  );
}