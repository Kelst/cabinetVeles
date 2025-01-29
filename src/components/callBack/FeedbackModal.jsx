import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Dialog, TextField, Typography, Button, IconButton, Tooltip, Box } from '@mui/material';
import { Headset, X, MessageSquare } from 'lucide-react';
import InputMask from 'react-input-mask';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ContactInfoButton from '../сontactInfoButton/ContactInfoButton';
import useInfoStore from '../../store/infoStore';
import useStore from '../../store/store';

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

const MaskedInput = memo(({ value, onChange }) => (
  <InputMask
    mask="+380 99 999 99 99"
    value={value}
    onChange={onChange}
  >
    {() => (
      <motion.div whileFocus={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <TextField
          fullWidth
          label="Номер телефону"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              backgroundColor: '#1a1a1a',
              '& fieldset': {
                borderColor: 'rgba(166, 255, 0, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: '#a6ff00',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#fff',
              }
            },
            '& .MuiInputLabel-root': {
              color: '#a6ff00',
              '&.Mui-focused': {
                color: '#fff'
              }
            },
          }}
        />
      </motion.div>
    )}
  </InputMask>
));

MaskedInput.displayName = 'MaskedInput';

const FeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const addFeedBackU = useStore(state => state.addFeedBackU);
  const user = useStore(state => state.user);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);
  
  const isValidPhone = phone.replace(/[^0-9]/g, '').length === 12;

  const handleOpen = () => {
    setIsOpen(true);
    setPhone('');
    setMessage('');
  };

  const handleClose = () => setIsOpen(false);

  async function handleFeedback() {
    try {
      setLoader(true);
      const sublogin = user.subLogin.map(e => e.login);
      const result = await addFeedBackU(user.login, phone, message, sublogin);
      if (result.status) {
        showAllert(2, 'Ваше звернення прийняте !');
      } else {
        showAllert(0, 'Вибачте виникла помилка під час залишення звернення');
      }
    } catch (error) {
      showAllert(2, "Виникла непередбачена помилка" + error);
    } finally {
      setMessage('');
      setPhone('');
      setLoader(false);
      setIsOpen(false);
    }
  }

  const iconVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.3 }
    }
  };

  const closeIconVariants = {
    initial: { rotate: 0 },
    hover: { 
      rotate: 90,
      scale: 1.2,
      transition: { duration: 0.2 }
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <motion.div
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        className="fixed top-[164px] right-[29px] z-50"
      >
        <Tooltip 
          title="Зворотній зв'язок" 
          placement="left"
          sx={{
            '& .MuiTooltip-tooltip': {
              bgcolor: '#1a1a1a',
              color: '#a6ff00',
              fontSize: '0.875rem',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(166, 255, 0, 0.15)',
              borderRadius: '8px',
              padding: '6px 12px'
            }
          }}
        >
          <IconButton 
            onClick={handleOpen}
            sx={{ 
              bgcolor: '#a6ff00',
              color: '#000',
              '&:hover': { 
                bgcolor: '#fff',
                transform: 'scale(1.05)',
              },
              boxShadow: '0 0 20px rgba(166, 255, 0, 0.5)',
              transition: 'all 0.3s ease'
            }}
          >
            <Headset size={28} />
          </IconButton>
        </Tooltip>
      </motion.div>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(166, 255, 0, 0.15)',
            position: 'relative',
            p: 3
          }
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)'
          }
        }}
      >
        <motion.div
          className="absolute top-4 right-4"
          variants={closeIconVariants}
          initial="initial"
          whileHover="hover"
        >
          <IconButton 
            onClick={handleClose}
            sx={{ 
              color: '#a6ff00',
              '&:hover': {
                color: '#fff',
                transform: 'rotate(180deg)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <X size={24} />
          </IconButton>
        </motion.div>

        <Box className="mb-6">
          <Typography 
            sx={{ 
              color: '#a6ff00',
              fontWeight: 600, 
              fontSize: '1.5rem',
              mb: 2
            }}
          >
            Зворотній зв'язок
            <ContactInfoButton />
          </Typography>
          <Box className="flex items-center gap-2">
            <MessageSquare size={24} color="#a6ff00" />
            <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: '1.25rem' }}>
              {user.login}
            </Typography>
          </Box>
        </Box>

        <Box className="space-y-4">
          <MaskedInput value={phone} onChange={(e) => setPhone(e.target.value)} />
          <motion.div whileFocus={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Ваше звернення"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  backgroundColor: '#1a1a1a',
                  '& fieldset': {
                    borderColor: 'rgba(166, 255, 0, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#a6ff00',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#a6ff00',
                  '&.Mui-focused': {
                    color: '#fff'
                  }
                },
              }}
            />
          </motion.div>
          <motion.div
            whileHover={isValidPhone ? { scale: 1.02 } : {}}
            whileTap={isValidPhone ? { scale: 0.98 } : {}}
          >
            <Button
              fullWidth
              variant="contained"
              disabled={!isValidPhone||message.length<7}
              onClick={handleFeedback}
              sx={{
                bgcolor: '#a6ff00',
                color: '#000',
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '9999px',
                '&:hover': {
                  bgcolor: '#fff',
                  transform: 'scale(1.05)',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(166, 255, 0, 0.3)',
                  color: 'rgba(0, 0, 0, 0.8)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Надіслати
            </Button>
          </motion.div>
        </Box>
      </Dialog>
    </ThemeProvider>
  );
};

export default FeedbackModal;