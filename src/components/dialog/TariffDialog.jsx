import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import GlazmorphizmCard from '../glazmorphizmCard/GlazmorphizmCard';
import useStore from '../../store/store';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TariffDialog({ open, handleClose }) {
  const tariff = useStore(state => state.user.tariff);
  const tarriffList = useStore(state => state.user.tarifAvaible);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <div className="relative pt-8 pb-6 px-4 bg-black">
        <div className="absolute inset-0 bg-gradient-to-r" />
        
        <div className="relative flex flex-col items-center gap-2">
          <div className="w-16 h-0.5 bg-gradient-to-r from-green-300 to-green-500 rounded-full" />
          
          <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500 uppercase text-center relative">
            Доступні тарифні плани
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/5 h-0.5 bg-gradient-to-r from-green-300 to-green-500 rounded-full" />
          </h2>
          <p className="text-sm text-gray-500 tracking-wide text-center mt-4">
            Оберіть найкращий тариф для вас
          </p>
          <p className="text-sm text-gray-500 tracking-wide text-center mt-2">
            *Змінювати тарифний план можна тільки 1 раз на календарний місяць
          </p>
        </div>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'rgba(255, 255, 255, 0.5)', // Змінено на світліший колір для кращої видимості на чорному фоні
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent>
        <GlazmorphizmCard tarriffList={tarriffList} tariff={tariff} handleClose={handleClose} />
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={handleClose} 
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Закрити
        </Button>
      </DialogActions>
    </Dialog>
  );
}