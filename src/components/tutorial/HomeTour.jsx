import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { IconButton, Tooltip, ThemeProvider, createTheme } from '@mui/material';
import { keyframes } from '@mui/system';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#77d6ff',
    },
    background: {
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#77d6ff',
    },
  },
});

const HomeTour = () => {
  const [run, setRun] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setRun(true);
      localStorage.setItem('hasSeenTour', 'true');
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartTour = () => setRun(true);
  const handleTourCallback = (data) => {
    if (['finished', 'skipped'].includes(data.status)) {
      setRun(false);
    }
  };

  const pulse = keyframes`
    0% {
      box-shadow: 0 0 0 0 rgba(135, 206, 250, 0.7);
    }
    70% {
      box-shadow: 0 0 0 15px rgba(135, 206, 250, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(135, 206, 250, 0);
    }
  `;

  const iconVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.3 }
    }
  };

  const desktopSteps = [
    {
      target: '.container',
      content: 'Вітаємо, в оновленому кабінеті абонента! Кілька кроків для ознайомлення!',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.grid > div:first-child',
      content: 'Основна інформація про ваш акаунт:\nТелефон - ваш контактний номер з можливістю редагування\nАдреса - місце надання послуг\nСтан з\'єднання - Active/Inactive з можливістю перезавантаження сесії\nMAC - поточна адреса пристрою\nСтатус - активний/призупинений\nПароль - з можливістю зміни',
      placement: 'right',
    },
    {
      target: '.grid > div:nth-child(2)',
      content: 'Фінансова інформація:\nСтан рахунку - поточний баланс\nКредит та термін його дії\nМісячна абонплата\nЗнижки якщо є\nДодаткові послуги та їх вартість\nМожливість швидкої оплати\nТаймер до наступного списання коштів',
      placement: 'left',
    },
    {
      target: '.grid > div:nth-child(3)',
      content: 'Технічні деталі підключення:\nПоточний тарифний план\nМаксимальна швидкість\nВартість тарифу\nIP-адреса з можливістю отримання статичної\nТривалість поточної сесії\nСтатистика відправлених та отриманих даних',
      placement: 'right',
    },
    {
      target: '.grid + .mt-8',
      content: 'Панель керування:\nОчищення MAC-адреси\nВстановлення кредиту\nУправління додатковими послугами\nНалаштування статичної IP\nЗміна тарифного плану\nВідв\'язка особистого кабінету\nВихід з кабінету',
      placement: 'top',
    }
  ];

  const mobileSteps = [
    {
      target: '.lg\\:hidden',
      content: 'Вітаємо, в оновленому кабінеті абонента! Кілька кроків для ознайомлення!',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.lg\\:hidden .gap-y-6 > div:first-of-type',
      content: 'Основна інформація про ваш акаунт:\n\nТелефон - ваш контактний номер з можливістю редагування\n\nАдреса - місце надання послуг\n\nСтан з\'єднання - Active/Inactive з можливістю перезавантаження сесії\n\nMAC - поточна адреса пристрою\n\nСтатус - активний/призупинений\n\nПароль - з можливістю зміни',
      placement: 'bottom',
    },
    {
      target: '.lg\\:hidden .gap-y-6 > div:nth-of-type(2)',
      content: 'Фінансова інформація:\n\nСтан рахунку - поточний баланс\n\nКредит та термін його дії\n\nМісячна абонплата\n\nЗнижки якщо є\n\nДодаткові послуги та їх вартість\n\nМожливість швидкої оплати\n\nТаймер до наступного списання коштів',
      placement: 'bottom',
    },
    {
      target: '.lg\\:hidden .gap-y-6 > div:nth-of-type(3)',
      content: 'Технічні деталі підключення:\n\nПоточний тарифний план\n\nМаксимальна швидкість\n\nВартість тарифу\n\nIP-адреса з можливістю отримання статичної\n\nТривалість поточної сесії\n\nСтатистика відправлених та отриманих даних',
      placement: 'bottom',
    },
    {
      target: '.lg\\:hidden .gap-y-6 > div:nth-of-type(4)',
      content: 'Панель керування:\n\nОчищення MAC-адреси\n\nВстановлення кредиту\n\nУправління додатковими послугами\n\nНалаштування статичної IP\n\nЗміна тарифного плану\n\nВідв\'язка особистого кабінету\n\nВихід з кабінету',
      placement: 'top',
    }
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <motion.div
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        className="fixed top-[232px] right-[29px] z-50"
      >
        <Tooltip 
          title="Туторіал" 
          placement="left"
          sx={{
            '& .MuiTooltip-tooltip': {
              bgcolor: '#1a1a1a',
              color: '#77d6ff',
              fontSize: '0.875rem',
              fontWeight: 500,
              boxShadow: '0 2px 8px black',
              borderRadius: '8px',
              padding: '6px 12px'
            }
          }}
        >
          <IconButton 
            onClick={handleStartTour}
            sx={{ 
              bgcolor: '#77d6ff',
              color: '#000',
              '&:hover': { 
                bgcolor: '#fff',
                transform: 'scale(1.05)',
              },
              boxShadow: '0 0 20px rgba(119, 214, 255, 0.5)',
              animation: `${pulse} 2s infinite`,
              transition: 'all 0.3s ease'
            }}
          >
            <HelpCircle size={28} />
          </IconButton>
        </Tooltip>
      </motion.div>

      <Joyride
        steps={isMobile ? mobileSteps : desktopSteps}
        continuous
        showProgress
        showSkipButton
        run={run}
        callback={handleTourCallback}
        spotlightPadding={8}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#77d6ff',
            backgroundColor: '#1a1a1a',
            textColor: '#ffffff',
            arrowColor: '#1a1a1a',
            overlayColor: 'rgba(0, 0, 0, 0.8)'
          },
          tooltip: {
            fontSize: isMobile ? '14px' : '16px',
            padding: isMobile ? '12px' : '16px',
            maxWidth: isMobile ? '300px' : '400px',
            whiteSpace: 'pre-line',
            textAlign: 'left',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(119, 214, 255, 0.2)',
            boxShadow: '0 8px 16px rgba(119, 214, 255, 0.1)',
            backgroundColor: '#1a1a1a',
            color: '#ffffff'
          },
          tooltipContent: {
            padding: isMobile ? '8px' : '12px',
            textAlign: 'left'
          },
          tooltipTitle: {
            textAlign: 'left',
            color: '#77d6ff'
          },
          buttonNext: {
            backgroundColor: '#77d6ff',
            color: '#000000',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#ffffff'
            }
          },
          buttonBack: {
            color: '#ffffff',
            '&:hover': {
              color: '#77d6ff'
            }
          },
          buttonSkip: {
            color: '#ffffff',
            '&:hover': {
              color: '#77d6ff'
            }
          }
        }}
        floaterProps={{
          disableAnimation: true
        }}
        locale={{
          skip: "Пропустити",
          next: "далі",
          back: "Назад",
          last: "Завершити",
          nextLabelWithProgress: 'Далі (Крок {step} із {steps})',
        }}
      />
    </ThemeProvider>
  );
};

export default HomeTour;