import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useStore from '../../store/store';
import useInfoStore from '../../store/infoStore';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const steps = ['Введіть поточний пароль', 'Введіть новий пароль', 'Підтвердження'];

const darkTheme = createTheme({
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let answer;
  switch(operator) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      answer = num1 - num2;
      break;
    case '*':
      answer = num1 * num2;
      break;
    default:
      answer = num1 + num2;
  }
  
  return {
    expression: `${num1} ${operator} ${num2} = ?`,
    answer: answer
  };
};

export default function EditPassword({open, handleClose, handleAction}) {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState('');
  const [captcha, setCaptcha] = React.useState({ expression: '', answer: null });
  const [captchaInput, setCaptchaInput] = React.useState('');
  const [captchaError, setCaptchaError] = React.useState('');

  const user = useStore(state => state.user);
  const requestPasswordChange = useStore(state => state.requestPasswordChange);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);

  React.useEffect(() => {
    if (activeStep === 2) {
      const newCaptcha = generateCaptcha();
      setCaptcha(newCaptcha);
      setCaptchaInput('');
      setCaptchaError('');
    }
  }, [activeStep]);

  const isStepSkipped = (step) => skipped.has(step);

  const validatePassword = (password) => {
    if (password.length < 6) return 'Пароль повинен містити мінімум 6 символів';
    if (!/[A-Z]/.test(password)) return 'Пароль повинен містити хоча б одну велику літеру';
    if (!/\d/.test(password)) return 'Пароль повинен містити хоча б одну цифру';
    return '';
  };

  const validateCurrentPassword = () => {
    const decodedPassword = user.password;
    return currentPassword === decodedPassword;
  };

  const handleNext = async () => {
    setIsSubmitting(true);
    setLoader(true);

    try {
      if (activeStep === 0) {
        if (!validateCurrentPassword()) {
          throw new Error('Невірний поточний пароль');
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        showAllert(2, 'Пароль вірний. Введіть новий пароль');
      } 
      else if (activeStep === 1) {
        const passwordValidationError = validatePassword(newPassword);
        if (passwordValidationError) {
          throw new Error(passwordValidationError);
        }

        if (newPassword !== confirmPassword) {
          throw new Error('Паролі не співпадають');
        }

        const decodedCurrentPassword = user.password;
        if (newPassword === decodedCurrentPassword) {
          throw new Error('Новий пароль повинен відрізнятися від поточного');
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
      else if (activeStep === 2) {
        if (parseInt(captchaInput) !== captcha.answer) {
          setCaptchaError('Невірна відповідь. Спробуйте ще раз');
          const newCaptcha = generateCaptcha();
          setCaptcha(newCaptcha);
          setCaptchaInput('');
          throw new Error('Невірна відповідь капчі');
        }

        const result = await requestPasswordChange(
          user.uid, 
          user.login, 
          user.password,
          newPassword
        );

        if (result && result.success) {
          showAllert(2, 'Пароль успішно змінено');
          handleClose();
          if (handleAction) handleAction();
        } else {
          throw new Error(result?.message || 'Помилка при зміні пароля');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      showAllert(0, error.message || 'Виникла помилка', 'error');
    } finally {
      setLoader(false);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (activeStep === 2) {
      setCaptchaInput('');
      setCaptchaError('');
    } else if (activeStep === 1) {
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    if (value) {
      setPasswordError(validatePassword(value));
    } else {
      setPasswordError('');
    }
  };

  const handleCaptchaChange = (e) => {
    const value = e.target.value.replace(/[^\d-]/g, '');
    setCaptchaInput(value);
    setCaptchaError('');
  };

  const isNextDisabled = () => {
    if (activeStep === 0) return currentPassword.length === 0;
    if (activeStep === 1) return newPassword.length === 0 || confirmPassword.length === 0 || passwordError !== '';
    return captchaInput === '';
  };

  const getPasswordHelperText = () => {
    if (passwordError) return passwordError;
    if (!newPassword) return "Пароль повинен містити мінімум 6 символів, 1 велику літеру та 1 цифру";
    return "";
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            borderRadius: '16px',
            boxShadow: '0 4px 30px black',
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#77d6ff',
            '&:hover': {
              color: '#fff',
              transform: 'rotate(180deg)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent className="bg-[#1a1a1a]">
          <div className="max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-4 text-[#77d6ff]">
              {activeStep === 0 ? 'Зміна пароля' : 
               activeStep === 1 ? 'Введіть новий пароль' : 
               'Підтвердіть дію'}
            </h2>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: "column" }}>
              <Stepper 
                orientation="vertical"
                activeStep={activeStep}
                sx={{
                  '& .MuiStepLabel-label': {
                    color: '#fff',
                    '&.Mui-active': {
                      color: '#77d6ff',
                    }
                  },
                  '& .MuiStepIcon-root': {
                    color: '#333',
                    '&.Mui-active': {
                      color: '#77d6ff',
                    },
                    '&.Mui-completed': {
                      color: '#77d6ff',
                    }
                  }
                }}
              >
                {steps.map((label, index) => (
                  <Step key={label} {...(isStepSkipped(index) ? { completed: false } : {})}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box sx={{ mt: 2 }}>
                {activeStep === 0 ? (
                  <TextField
                    autoFocus
                    fullWidth
                    margin='normal'
                    type="password"
                    label="Поточний пароль"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    inputProps={{
                      style: { color: '#fff' }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#77d6ff',
                        },
                        '&:hover fieldset': {
                          borderColor: '#fff',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#77d6ff',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#77d6ff',
                      }
                    }}
                  />
                ) : activeStep === 1 ? (
                  <Box>
                    <TextField
                      fullWidth
                      margin='normal'
                      type="password"
                      label="Новий пароль"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      error={!!passwordError}
                      helperText={getPasswordHelperText()}
                      inputProps={{
                        style: { color: '#fff' }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#77d6ff',
                          },
                          '&:hover fieldset': {
                            borderColor: '#fff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#77d6ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#77d6ff',
                        },
                        '& .MuiFormHelperText-root': {
                          color: passwordError ? '#f44336' : '#fff',
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      margin='normal'
                      type="password"
                      label="Підтвердження пароля"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={confirmPassword !== '' && confirmPassword !== newPassword}
                      helperText={confirmPassword !== '' && confirmPassword !== newPassword ? "Паролі не співпадають" : ""}
                      inputProps={{
                        style: { color: '#fff' }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#77d6ff',
                          },
                          '&:hover fieldset': {
                            borderColor: '#fff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#77d6ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#77d6ff',
                        },
                        '& .MuiFormHelperText-root': {
                          color: confirmPassword !== '' && confirmPassword !== newPassword ? '#f44336' : '#fff',
                        }
                      }}
                    />
                  </Box>
                ) : (
                  <Box>
                    <div className="text-lg mb-4 text-white">
                      Для підтвердження зміни пароля, будь ласка, вирішіть приклад:
                    </div>
                    <div className="text-2xl font-bold mb-4 text-center text-[#77d6ff]">
                      {captcha.expression}
                    </div>
                    <TextField
                      fullWidth
                      margin='normal'
                      label="Відповідь"
                      value={captchaInput}
                      onChange={handleCaptchaChange}
                      error={!!captchaError}
                      helperText={captchaError}
                      autoFocus
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        style: { color: '#fff' }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#77d6ff',
                          },
                          '&:hover fieldset': {
                            borderColor: '#fff',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#77d6ff',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#77d6ff',
                        },
                        '& .MuiFormHelperText-root': {
                          color: captchaError ? '#f44336' : '#fff',
                        }
                      }}
                    />
                  </Box>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    disabled={activeStep === 0 || isSubmitting}
                    onClick={handleBack}
                    sx={{
                      mr: 1,
                      color: '#fff',
                      '&:not(:disabled)': {
                        '&:hover': {
                          color: '#77d6ff',
                        }
                      }
                    }}
                  >
                    Назад
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button 
                    onClick={handleNext}
                    disabled={isNextDisabled() || isSubmitting}
                    sx={{
                      backgroundColor: '#77d6ff',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#fff',
                        transform: 'scale(1.05)',
                      },
                      '&:disabled': {
                        backgroundColor: '#333',
                        color: '#666'
                      },
                      transition: 'all 0.3s ease',
                      borderRadius: '9999px',
                      padding: '8px 24px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    {isSubmitting ? 'Зачекайте...' : (activeStep === steps.length - 1 ? 'Змінити пароль' : 'Далі')}
                  </Button>
                </Box>
              </Box>
            </Box>
          </div>
        </DialogContent>
        <DialogActions className="bg-[#5b8bd8] p-4">
          <Button 
            onClick={() => {
              setActiveStep(0);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setPasswordError('');
              setCaptchaInput('');
              setCaptchaError('');
              handleClose();
            }}
            disabled={isSubmitting}
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              borderRadius: '9999px',
              padding: '8px 24px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#444',
                transform: 'scale(1.05)',
              },
              '&:disabled': {
                backgroundColor: '#222',
                color: '#666'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Закрити
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}