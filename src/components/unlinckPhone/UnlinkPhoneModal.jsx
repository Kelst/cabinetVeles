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

const style = {
  backdrop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 0,
    outline: 'none',
    mx: 2, // додаємо відступи з боків для мобільних пристроїв
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid',
    borderColor: 'divider',
    p: 2,
  },
  closeButton: {
    color: 'grey.500',
    '&:hover': {
      color: 'error.main',
    },
  },
  content: {
    p: 2,
  },
};

const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

const UnlinkPhoneModal = ({ open, onClose, accounts = [] }) => {
  const handleUnlink = async (uid,login) => {
    ///uid,login,phone,loginOld 
    let result
    try {
      setLoader(true);
       result = await unlinkPhone(uid,user.uid,user.phone,login);
      if (result.flag) {
        console.log("unlinkPhone reloaded successfully");
      } else {
        console.log("unlinkPhone to reload session");
      }
    } catch (error) {
    } finally {
      setLoader(false);
      showAllert(2, result.unlinkResult.message);
      onClose();
    }
  };
  const user = useStore(state => state.userData);
  const unlinkPhone = useStore(state => state.unlinkPhone);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);

  return (
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
          <Typography variant="h6" component="h2">
          Доступні облікові записи          </Typography>
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
                  backgroundColor: 'rgba(255, 0, 0, 0.05)',
                  transition: { duration: 0.2 }
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    {user.login}
                  </Typography>
                 
                </Box>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleUnlink(user.uid,user.login)}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                  backgroundColor: 'rgba(255, 0, 0, 0.05)',
                  transition: { duration: 0.2 }
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    {account.login}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                    ID: {account.uid}
                  </Typography> */}
                </Box>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleUnlink(account.uid,account.login)}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Відв'язати
                </Button>
              </MotionPaper>
            ))}
            
          </AnimatePresence>
        </Box>
      </MotionBox>
    </Modal>
  );
};

export default UnlinkPhoneModal;