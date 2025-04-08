import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Button, Typography, Box, ThemeProvider, createTheme } from '@mui/material';
import { WifiOff } from 'lucide-react';

const skyTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#77d6ff',
    },
    text: {
      primary: '#ffffff',
      secondary: '#77d6ff',
    },
  },
});

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const wifiIconVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const numberVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: { scale: 0.95 }
  };

  const Circuit = () => (
    <motion.div
      className="absolute inset-0 overflow-hidden opacity-20"
      initial={{ pathLength: 0 }}
      animate={{
        background: [
          "linear-gradient(45deg, #77d6ff 0%, transparent 70%)",
          "linear-gradient(45deg, #5cb8ff 30%, transparent 80%)",
          "linear-gradient(45deg, #77d6ff 0%, transparent 70%)",
        ]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );

  return (
    <ThemeProvider theme={skyTheme}>
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-sky-800 to-[#1a1a1a]">
        <Circuit />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-8 w-[400px] h-[350px] md:w-[500px] flex justify-center items-center 
                     rounded-lg shadow-2xl bg-[#1a1a1a]/50 backdrop-blur-md flex-col"
          style={{
            border: '1px solid rgba(119, 214, 255, 0.1)',
            boxShadow: '0 4px 30px black'
          }}
        >
          <motion.div
            variants={wifiIconVariants}
            initial="initial"
            animate="animate"
            className="mb-6"
          >
            <WifiOff size={50} className="text-[#77d6ff]" />
          </motion.div>

          <motion.div
            variants={numberVariants}
            initial="initial"
            animate="animate"
            className="mb-6"
          >
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '4rem', md: '5rem' },
                fontFamily: 'monospace',
                color: '#77d6ff',
                textShadow: '0 0 20px rgba(119, 214, 255, 0.5)'
              }}
            >
              {error?.status || '404'}
            </Typography>
          </motion.div>

          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'center',
              mb: 4,
              maxWidth: '80%',
              textShadow: '0 0 10px rgba(255,255,255,0.2)'
            }}
          >
            Схоже, що виникла помилка з'єднання. Перевірте підключення або поверніться на головну.
          </Typography>

          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#77d6ff',
                px: 4,
                py: 1.5,
                borderRadius: '9999px',
                fontSize: '1rem',
                textTransform: 'none',
                color: '#000',
                fontWeight: 'bold',
                boxShadow: '0 0 30px rgba(119, 214, 255, 0.3)',
                '&:hover': {
                  bgcolor: '#fff',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Повернутись на головну
            </Button>
          </motion.div>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default ErrorPage;