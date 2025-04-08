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
import useConfigPage from '../../store/configPage';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AnimatedText = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="hover:transform hover:scale-105 transition-all duration-300"
  >
    {children}
  </motion.div>
);

const HelpSection = ({ title, content, delay }) => (
  <AnimatedText delay={delay}>
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-[#77d6ff]">
      <h2 className="text-2xl font-semibold text-sky-800 mb-2">{title}</h2>
      <p className="leading-relaxed text-sky-800 mb-4">{content}</p>
    </div>
  </AnimatedText>
);

const helpSections = [
  {
    title: 'Очищення MAC',
    content: 'Очищення MAC - адреси із системи фіксації, для можливості встановити новий пристрій.',
  },
  {
    title: 'Встановити кредит',
    content: 'Можливість користуватись послугами в кредит - строком в 5 днів.',
  },
  {
    title: 'Додаткові послуги',
    content: 'Залишайте заявку щоб скористатись додатковими послугами, а саме: налаштування мереж, маршрутизатора, чи інших мережевих пристроїв. З повним переліком послуг можна ознайомитись на нашому офіційному порталі.',
  },
  {
    title: 'Статична IP',
    content: 'Статична (фіксована) IP-адреса - це постійна адреса в мережі інтернет, яка закріплюється за вашим обліковим записом і залишається незмінною до відключення послуги.',
  },
  {
    title: 'Тарифні плани',
    content: 'Можливість вибрати оптимальний тариф для ваших потреб',
  },
];

export default function ControlPanelDialog({ open, handleClose }) {
  const configCabinet = useConfigPage(state => state.configCabinet);
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
          maxWidth: '700px',
          width: '100%'
        },
      }}
    >
      <DialogTitle className="text-center text-3xl font-bold text-sky-800 pb-4 border-b border-[#77d6ff]">
        Довідка
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#000',
            '&:hover': {
              color: '#77d6ff',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="bg-gradient-to-b from-white to-gray-50">
        <div className="p-6 space-y-6">
          {helpSections.map((section, index) => {
            const shouldShow = {
              'Очищення MAC': configCabinet.home.clearMac,
              'Встановити кредит': configCabinet.home.setCredit,
              'Додаткові послуги': configCabinet.home.additionalService,
              'Статична IP': configCabinet.home.staticIp,
              'Тарифні плани': configCabinet.home.tariffPlans
            }[section.title];

            return shouldShow ? (
              <HelpSection 
                key={index} 
                title={section.title} 
                content={section.content} 
                delay={0.1 * (index + 1)}
              />
            ) : null;
          })}
        </div>
      </DialogContent>
      <DialogActions className="bg-gray-50 p-4 border-t border-[#77d6ff]">
        <Button 
          onClick={handleClose}
          sx={{
            backgroundColor: '#77d6ff',
            color: '#000',
            borderRadius: '9999px',
            padding: '8px 24px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#000',
              color: '#77d6ff',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          Зрозуміло
        </Button>
      </DialogActions>
    </Dialog>
  );
}