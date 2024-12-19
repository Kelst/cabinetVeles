import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import { WifiOff } from 'lucide-react';

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

  // Background animation
  const Circuit = () => (
    <motion.div
      className="absolute inset-0 overflow-hidden opacity-20"
      initial={{ pathLength: 0 }}
      animate={{
        background: [
          "linear-gradient(45deg, #2E8B57 0%, transparent 70%)",
          "linear-gradient(45deg, #3CB371 30%, transparent 80%)",
          "linear-gradient(45deg, #2E8B57 0%, transparent 70%)",
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
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-black to-green-900">
      <Circuit />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-8 w-[400px] h-[350px] md:w-[500px] flex justify-center items-center 
                   rounded-lg shadow-2xl bg-white/5 backdrop-blur-md flex-col"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <motion.div
          variants={wifiIconVariants}
          initial="initial"
          animate="animate"
          className="mb-6"
        >
          <WifiOff size={50} className="text-emerald-500" />
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
              color: '#2E8B57',
              textShadow: '0 0 20px rgba(46,139,87,0.5)'
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
              bgcolor: 'rgba(46, 139, 87, 0.9)',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              textTransform: 'none',
              color: 'white',
              boxShadow: '0 0 30px rgba(46,139,87,0.3)',
              '&:hover': {
                bgcolor: 'rgba(46, 139, 87, 1)'
              }
            }}
          >
            Повернутись на головну
          </Button>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default ErrorPage;