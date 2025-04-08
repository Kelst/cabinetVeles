
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TextField, Button, Container, Typography, Paper, Alert } from '@mui/material';
import { CommentRounded, SendRounded, PhoneRounded, ErrorOutline, AccessTime } from '@mui/icons-material';
import useStore from '../../store/store';
import useInfoStore from '../../store/infoStore';

const FEEDBACK_COOLDOWN = 60 * 60 * 1000;

const commonTextFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': { borderColor: '#77cdec' },
    '&:hover fieldset': { borderColor: '#77cdec' },
    '& fieldset': { borderColor: '#fff' }
  },
  '& .MuiInputBase-input': { color: '#fff' },
  '& label.Mui-focused': { color: '#77cdec' },
  '& label': { color: '#fff' },
  '& .MuiInput-underline:after': { borderBottomColor: '#77cdec' }
};

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [submitError, setSubmitError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const addFeedBack = useStore(state => state.addFeedBack);
  const login = useStore(state => state.user.login);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);

  useEffect(() => {
    // Cooldown logic...
  }, [login]);

  const validateForm = () => {
    // Form validation logic...
  };

  const handleSubmit = async(e) => {
    // Form submission logic...
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (submitted || submitError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ width: '100%' }}
      >
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: 'rgba(0,0,0,0.9)',
            color: '#fff'
          }}
        >
          {submitted ? (
            <Typography variant="h5" sx={{ color: '#77cdec', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}> 
              <CommentRounded />
              Дякуємо за ваш відгук!
            </Typography>
          ) : (
            <Typography variant="h5" sx={{ color: '#B2FF59', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}> 
              <ErrorOutline />
              Помилка при відправці відгуку. Спробуйте пізніше.
            </Typography>
          )}
        </Paper>
      </motion.div>
    );
  }

  return (
    <Container maxWidth="sm">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {!canSubmit && (
          <Alert 
            severity="info" 
            icon={<AccessTime />}
            sx={{ 
              mb: 2,
              '& .MuiAlert-icon': {
                color: '#77cdec'
              }
            }}
          >
            Ви зможете залишити наступний відгук через {timeLeft} {timeLeft === 1 ? 'хвилину' : 
              timeLeft < 5 ? 'хвилини' : 'хвилин'}. Дякуємо за розуміння!
          </Alert>
        )}
        <Paper 
          elevation={3} 
          sx={{
            p: 4,
            backgroundColor: 'rgba(0,0,0,0.9)',
            borderRadius: 2,
            opacity: canSubmit ? 1 : 0.8,
            backdropFilter: 'blur(8px)',
            border: '1px solid #77cdec'
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 4,
                color: '#fff'
              }}
            >
              <CommentRounded sx={{ color: '#77cdec' }} />
              Відгуки та пропозиції
            </Typography>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TextField
                fullWidth
                multiline
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Опишіть вашу думку..."
                error={!!errors.feedback}
                helperText={errors.feedback || `Залишилось символів: ${200 - feedback.length}`}
                sx={{
                  mb: 3,
                  ...commonTextFieldStyles
                }}
                disabled={!canSubmit}
              />
            </motion.div>

            <motion.div
              whileFocus={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TextField
                fullWidth
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380..."
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: <PhoneRounded sx={{ mr: 1, color: '#fff' }} />,
                }}
                sx={{
                  mb: 3,
                  ...commonTextFieldStyles
                }}
                disabled={!canSubmit}
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: canSubmit ? 1.02 : 1 }}
              whileTap={{ scale: canSubmit ? 0.98 : 1 }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                endIcon={<SendRounded />}
                sx={{
                  py: 1.5,
                  backgroundColor: canSubmit ? '#77cdec' : '#4C4D50',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: canSubmit ? '#87B300' : '#4C4D50',
                  },
                }}
                disabled={!canSubmit}
              >
                {canSubmit ? 'Надіслати відгук' : 'Зачекайте перед наступним відгуком'}
              </Button>
            </motion.div>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default FeedbackForm;
