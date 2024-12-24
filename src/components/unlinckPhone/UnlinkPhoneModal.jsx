import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Paper,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/store';
import useInfoStore from '../../store/infoStore';
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

const style = {
  backdrop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    bgcolor: '#1a1a1a',
    boxShadow: '0 4px 30px rgba(166, 255, 0, 0.15)',
    borderRadius: '16px',
    p: 0,
    outline: 'none',
    mx: 2,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(166, 255, 0, 0.2)',
    p: 2,
  },
  closeButton: {
    color: '#a6ff00',
    '&:hover': {
      color: '#fff',
      transform: 'rotate(180deg)',
    },
    transition: 'all 0.3s ease',
  },
  content: {
    p: 2,
    backgroundColor: '#1a1a1a',
  },
};

const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

const UnlinkPhoneModal = ({ open, onClose, accounts = [] }) => {
  const user = useStore(state => state.userData);
  const unlinkPhone = useStore(state => state.unlinkPhone);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);

  const handleUnlink = async (uid, login) => {
    let result;
    try {
      setLoader(true);
      result = await unlinkPhone(uid, user.uid, user.phone, login);
      if (result.flag) {
        console.log("unlinkPhone reloaded successfully");
      }
    } catch (error) {
    } finally {
      setLoader(false);
      showAllert(2, result.unlinkResult.message);
      onClose();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Modal
        open={open}
        onClose={onClose}
        sx={style.backdrop}
      >
        <MotionBox
          sx={style.modal}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Box sx={style.header}>
            <Typography variant="h6" component="h2" sx={{ color: '#a6ff00', fontWeight: 'bold' }}>
              Доступні облікові записи
            </Typography>
            <IconButton
              aria-label="close"
              onClick={onClose}
              component={motion.button}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
              sx={style.closeButton}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={style.content}>
            <AnimatePresence mode="wait">
              <MotionPaper
                key={user.uid}
                elevation={0}
                initial={{ opacity: 0, x: -50 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0 * 0.1 }
                }}
                exit={{ opacity: 0, x: 50 }}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: 'rgba(166, 255, 0, 0.05)',
                  transition: { duration: 0.2 }
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  mb: 1,
                  border: '1px solid rgba(166, 255, 0, 0.2)',
                  borderRadius: '8px',
                  backgroundColor: '#1a1a1a',
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                    {user.login}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => handleUnlink(user.uid, user.login)}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    backgroundColor: '#a6ff00',
                    color: '#000',
                    '&:hover': {
                      backgroundColor: '#fff',
                      color: '#000',
                    },
                    borderRadius: '9999px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    padding: '8px 24px',
                  }}
                >
                  Відв'язати
                </Button>
              </MotionPaper>

              {user.subLogin.map((account, index) => (
                <MotionPaper
                  key={account.uid}
                  elevation={0}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  exit={{ opacity: 0, x: 50 }}
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: 'rgba(166, 255, 0, 0.05)',
                    transition: { duration: 0.2 }
                  }}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    mb: 1,
                    border: '1px solid rgba(166, 255, 0, 0.2)',
                    borderRadius: '8px',
                    backgroundColor: '#1a1a1a',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                      {account.login}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => handleUnlink(account.uid, account.login)}
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    sx={{
                      backgroundColor: '#a6ff00',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#fff',
                        color: '#000',
                      },
                      borderRadius: '9999px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      padding: '8px 24px',
                    }}
                  >
                    Відв'язати
                  </Button>
                </MotionPaper>
              ))}
            </AnimatePresence>
          </Box>
        </MotionBox>
      </Modal>
    </ThemeProvider>
  );
};

export default UnlinkPhoneModal;