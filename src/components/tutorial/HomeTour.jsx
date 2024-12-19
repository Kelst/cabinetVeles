import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { IconButton, Tooltip } from '@mui/material';

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

  const handleStartTour = () => {
    setRun(true);
  };

  const handleTourCallback = (data) => {
    const { status } = data;
    if (['finished', 'skipped'].includes(status)) {
      setRun(false);
    }
  };

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
    <>
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
              bgcolor: '#6b8e23', // Changed to olive green
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(107, 142, 35, 0.5)', // Changed to olive green
              borderRadius: '4px',
              padding: '6px 12px'
            }
          }}
        >
          <IconButton 
            onClick={handleStartTour}
            sx={{ 
              bgcolor: '#6b8e23', // Changed to olive green
              color: 'white',
              '&:hover': { bgcolor: '#4a5d23' }, // Changed to darker olive green
              boxShadow: '0 0 20px rgba(107, 142, 35, 0.5)' // Changed to olive green
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
            primaryColor: '#6b8e23', // Changed to olive green
            backgroundColor: '#ffffff',
            textColor: '#666666',
            arrowColor: '#ffffff',
            overlayColor: 'rgba(0, 0, 0, 0.4)'
          },
          tooltip: {
            fontSize: isMobile ? '14px' : '16px',
            padding: isMobile ? '12px' : '16px',
            maxWidth: isMobile ? '300px' : '400px',
            whiteSpace: 'pre-line',
            textAlign: 'left',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(107, 142, 35, 0.3)', // Added olive green border
            boxShadow: '0 8px 16px rgba(107, 142, 35, 0.1)' // Added olive green shadow
          },
          tooltipContent: {
            padding: isMobile ? '8px' : '12px',
            textAlign: 'left'
          },
          tooltipTitle: {
            textAlign: 'left',
            color: '#4a5d23' // Changed to darker olive green
          },
          buttonNext: {
            backgroundColor: '#6b8e23', // Changed to olive green
            '&:hover': {
              backgroundColor: '#4a5d23' // Changed to darker olive green
            }
          },
          buttonBack: {
            color: '#6b8e23' // Changed to olive green
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
    </>
  );
};

export default HomeTour;