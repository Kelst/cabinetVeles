import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TextField, Button, Container, Typography, Paper, Alert } from '@mui/material';
import { CommentRounded, SendRounded, PhoneRounded, ErrorOutline, AccessTime } from '@mui/icons-material';
import useStore from '../../store/store';
import useInfoStore from '../../store/infoStore';

const FEEDBACK_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds

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
    const checkCooldown = () => {
      const lastSubmission = localStorage.getItem(`lastFeedback_${login}`);
      if (lastSubmission) {
        const timeElapsed = Date.now() - parseInt(lastSubmission);
        if (timeElapsed < FEEDBACK_COOLDOWN) {
          setCanSubmit(false);
          const minutesLeft = Math.ceil((FEEDBACK_COOLDOWN - timeElapsed) / (1000 * 60));
          setTimeLeft(minutesLeft);
        } else {
          setCanSubmit(true);
          setTimeLeft(0);
        }
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [login]);

  const validateForm = () => {
    const newErrors = {};
    if (!phone.match(/^\+?[\d\s-]{10,}$/)) {
      newErrors.phone = 'Введіть коректний номер телефону';
    }
    if (feedback.length > 200) {
      newErrors.feedback = 'Відгук не може перевищувати 200 символів';
    }
    if (!feedback.trim()) {
      newErrors.feedback = 'Будь ласка, введіть ваш відгук';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!canSubmit) {
      showAllert(1, `Наступний відгук можна залишити через ${timeLeft} хвилин`);
      return;
    }
    
    if (validateForm()) {
      try {
        setLoader(true);
        const result = await addFeedBack(feedback, phone, login);

        if (result.status) {
          showAllert(2, 'Дякуємо за ваш відгук');
          localStorage.setItem(`lastFeedback_${login}`, Date.now().toString());
          setSubmitted(true);
          setSubmitError(false);
        } else {
          setSubmitError(true);
          showAllert(0, 'Вибачте виникла помилка під час залишення відгуку');
        }
      } catch (error) {
        setSubmitError(true);
        showAllert(2, "Виникла непередбачена помилка");
      } finally {
        setLoader(false);
      }
    }
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
            backgroundColor: '#f5f5f5',
            color: '#000'
          }}
        >
          {submitted ? (
            <Typography variant="h5" sx={{ color: '#6b8e23', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}> {/* Changed to olive green */}
              <CommentRounded />
              Дякуємо за ваш відгук!
            </Typography>
          ) : (
            <Typography variant="h5" sx={{ color: '#8B9A47', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}> {/* Changed to lighter olive green */}
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
                color: '#6b8e23' // Changed to olive green
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
            backgroundColor: '#fff',
            borderRadius: 2,
            opacity: canSubmit ? 1 : 0.8
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
                color: '#000'
              }}
            >
              <CommentRounded sx={{ color: '#6b8e23' }} /> {/* Changed to olive green */}
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
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#6b8e23', // Changed to olive green
                    },
                    '&:hover fieldset': {
                      borderColor: '#8B9A47', // Changed to lighter olive green
                    },
                  },
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
                  startAdornment: <PhoneRounded sx={{ mr: 1, color: '#666' }} />,
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#6b8e23', // Changed to olive green
                    },
                    '&:hover fieldset': {
                      borderColor: '#8B9A47', // Changed to lighter olive green
                    },
                  },
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
                  backgroundColor: canSubmit ? '#6b8e23' : '#cccccc', // Changed to olive green
                  '&:hover': {
                    backgroundColor: canSubmit ? '#4a5d23' : '#cccccc', // Changed to darker olive green
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