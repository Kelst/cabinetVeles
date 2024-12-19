import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Dialog, TextField, Typography, Button, IconButton, Tooltip, Box } from '@mui/material';
import { Headset, X, MessageSquare } from 'lucide-react';
import InputMask from 'react-input-mask';
import ContactInfoButton from '../сontactInfoButton/ContactInfoButton';
import useInfoStore from '../../store/infoStore';
import useStore from '../../store/store';

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
              color: '#666666',
              backgroundColor: '#FFFFFF',
              '& fieldset': {
                borderColor: 'rgba(107, 142, 35, 0.3)', // Changed to olive green
              },
              '&:hover fieldset': {
                borderColor: '#6b8e23', // Changed to olive green
              },
              '&.Mui-focused fieldset': {
                borderColor: '#4a5d23', // Changed to darker olive green
              }
            },
            '& .MuiInputLabel-root': {
              color: '#666666',
              '&.Mui-focused': {
                color: '#4a5d23' // Changed to darker olive green
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
    <>
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
            onClick={handleOpen}
            sx={{ 
              bgcolor: '#6b8e23', // Changed to olive green
              color: 'white',
              '&:hover': { bgcolor: '#4a5d23' }, // Changed to darker olive green
              boxShadow: '0 0 20px rgba(107, 142, 35, 0.5)' // Changed to olive green
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
            borderRadius: 3,
            boxShadow: '0 40px 20px rgba(107, 142, 35, 0.1)', // Changed to olive green
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
              color: 'grey.500',
              '&:hover': { 
                color: '#6b8e23', // Changed to olive green
                transform: 'rotate(90deg)',
                transition: 'all 0.3s'
              }
            }}
          >
            <X size={24} />
          </IconButton>
        </motion.div>

        <Box className="mb-6">
          <Typography 
            sx={{ 
              color: '#6b8e23', // Changed to olive green
              fontWeight: 600, 
              fontSize: '1.5rem',
              mb: 2
            }}
          >
            Зворотній зв'язок
            <ContactInfoButton />
          </Typography>
          <Box className="flex items-center gap-2">
            <MessageSquare size={24} color="#6b8e23" /> {/* Changed to olive green */}
            <Typography sx={{ color: '#6b8e23', fontWeight: 500, fontSize: '1.25rem' }}> {/* Changed to olive green */}
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
                  color: '#666666',
                  backgroundColor: '#FFFFFF',
                  '& fieldset': {
                    borderColor: 'rgba(107, 142, 35, 0.3)', // Changed to olive green
                  },
                  '&:hover fieldset': {
                    borderColor: '#6b8e23', // Changed to olive green
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4a5d23', // Changed to darker olive green
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#666666',
                  '&.Mui-focused': {
                    color: '#4a5d23' // Changed to darker olive green
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
              disabled={!isValidPhone}
              onClick={handleFeedback}
              sx={{
                bgcolor: '#6b8e23', // Changed to olive green
                color: 'white',
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem',
                borderRadius: '28px',
                '&:hover': {
                  bgcolor: '#4a5d23' // Changed to darker olive green
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(107, 142, 35, 0.3)', // Changed to olive green
                  color: 'rgba(255, 255, 255, 0.8)'
                }
              }}
            >
              Надіслати
            </Button>
          </motion.div>
        </Box>
      </Dialog>
    </>
  );
};

export default FeedbackModal;