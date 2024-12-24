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
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a6ff00',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a6ff00',
    },
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TariffDialog({ open, handleClose }) {
  const tariff = useStore(state => state.user.tariff);
  const tarriffList = useStore(state => state.user.tarifAvaible);

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(166, 255, 0, 0.15)',
          },
        }}
      >
        <div className="relative pt-8 pb-6 px-4 bg-[#1a1a1a]">
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-16 h-0.5 bg-[#a6ff00]" />
            
            <h2 className="text-2xl font-bold tracking-wide text-[#a6ff00] uppercase text-center relative">
              Доступні тарифні плани
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/5 h-0.5 bg-[#a6ff00]" />
            </h2>
            <p className="text-sm text-white tracking-wide text-center mt-4">
              Оберіть найкращий тариф для вас
            </p>
            <p className="text-sm text-white/60 tracking-wide text-center mt-2">
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
        </div>

        <DialogContent className="bg-[#1a1a1a]">
          <GlazmorphizmCard tarriffList={tarriffList} tariff={tariff} handleClose={handleClose} />
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
                color: '#a6ff00',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Закрити
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}