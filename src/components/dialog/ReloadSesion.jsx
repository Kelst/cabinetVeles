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
    >
      <div className="pt-8 pb-6 px-4 border-b border-gray-300 flex items-center justify-center">
        <h2 className="text-3xl font-bold text-blue-600 flex items-center">
          <RefreshIcon className="mr-2" />
        </h2>
      </div>

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

      <DialogContent>
        <div className="p-6 space-y-6 text-gray-800">
          <AnimatedText delay={0.1}>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Важлива інформація про перезавантаження сесії:
            </h2>
          </AnimatedText>

          <AnimatedText delay={0.2}>
            <div className="leading-relaxed">
              Ми розпочнемо процес <span className="font-semibold text-blue-500">адміністративного перезавантаження</span> вашої сесії. Це допоможе вирішити можливі проблеми з підключенням та оновити параметри вашого з'єднання.
            </div>
          </AnimatedText>

          <AnimatedText delay={0.3}>
            <div className="leading-relaxed">
              Для <span className="font-semibold text-black">швидшого відновлення</span> інтернет-з'єднання, рекомендуємо вам також <span className="font-semibold text-blue-600">перезавантажити ваш роутер</span>. Це забезпечить повне оновлення всіх налаштувань мережі.
            </div>
          </AnimatedText>

          <AnimatedText delay={0.4}>
            <div className="leading-relaxed">
              Кроки для перезавантаження роутера:
            </div>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Вимкніть роутер з електромережі</li>
              <li>Зачекайте 30 секунд</li>
              <li>Увімкніть роутер знову</li>
              <li>Дочекайтесь повного завантаження (1-2 хвилини)</li>
            </ol>
          </AnimatedText>

          <AnimatedText delay={0.5}>
            <div className="leading-relaxed">
              Якщо після цих дій з'єднання не відновиться протягом 5 хвилин, будь ласка, <span className="font-semibold text-blue-600">зверніться до нашої служби підтримки</span> для додаткової допомоги.
            </div>
          </AnimatedText>
        </div>
      </DialogContent>

      <DialogActions className="p-4">
        <Button
          onClick={handleClose}
          sx={{ color: 'gray' }}
          className="mr-2"
        >
          Скасувати
        </Button>
        <Button
          onClick={onConfirm}
          sx={{ color: 'blue' }}
        >
          Перезавантажити сесію
        </Button>
      </DialogActions>
    </Dialog>
  );
}