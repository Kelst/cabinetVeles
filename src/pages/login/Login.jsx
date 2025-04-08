import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import IoSwitch from '../../components/switches/IoSwitch.jsx';
import { useSpring, animated, config } from '@react-spring/web';
import { MuiTelInput } from 'mui-tel-input';
import CustomAlert from '../../components/alert/CustomAlert';
import useStore from '../../store/store';
import DropDownCard from '../../components/dropCard/DropDownCard';
import { FormControl, InputAdornment, OutlinedInput, Slide, Fade } from '@mui/material';
import { ContactPhone, Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Timer from '../../components/timer/Timer';
import { useNavigate } from 'react-router-dom';
import CustomAlertOld from '../../components/alert/CustomAlertOld.jsx';
import useConfigPage from '../../store/configPage.js';
import TelegramAdButton from '../../components/telegramComponent/TelegramAdButton.jsx';
import useInfoStore from '../../store/infoStore.js';
import Loader from '../../components/loader/Loader.jsx';

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const {
    checkBillingApi,
    checkUser,
    logIn,
    logInPhone,
    checkBillingApiGuest,
    handleVeriffyCode: handleVeriffyCodes
  } = useStore();

  // State management with better security
  const [formState, setFormState] = React.useState({
    loginText: "",
    loginIp: "",
    passwordIP: "",
    passwordText: "",
    showPassword: false,
    checkedPhone: false,
    code: "",
    phone: "",
    previousPhone: "",
    phoneFromSMS: false,
    
  });
  const setLoader = useInfoStore(store => store.setLoader);

  const getImageUrl = useConfigPage.getState().getImageUrl;
  const imageUrl = useConfigPage(state => state.imageUrl);
 const [imageU,setImageU]=React.useState({logo:'',logo_min_navigation:''})
  const [showAllert, setShowAllert] = React.useState({
    open: false,
    type: 0,
    message: ""
  });
  const [openLogIp, setOpenLogIp] = React.useState(false);

  // Enhanced animations
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 }
  });

  const slideIn = useSpring({
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0)' },
    config: config.gentle
  });

  const bounceAnimation = useSpring({
    from: { transform: 'scale(0.8)' },
    to: { transform: 'scale(1)' },
    config: { ...config.wobbly }
  });

  const formAnimation = useSpring({
    from: { y: 50, opacity: 0 },
    to: { y: 0, opacity: 1 },
    config: { tension: 280, friction: 20 }
  });

  // Secure state updates
  const updateFormState = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogInWithPassword = async () => {
    try {
      const auth = await logIn(formState.loginText, formState.passwordText);
      
      if (!auth?.flag) {
        setShowAllert({
          open: true,
          type: 0,
          message: auth?.errText || 'Помилка при вході'
        });
        updateFormState('passwordText', '');
      } else {
        navigate("/home");
      }
    } catch (error) {
      setShowAllert({
        open: true,
        type: 0,
        message: error?.message || 'Несподівана помилка при вході'
      });
      updateFormState('passwordText', '');
    }
  };

  const handleVeriffyCode = async () => {
    try {
      const cleanPhone = formState.phone.replace(/\s+/g, '').replace(/^\+/, '');
      setLoader(true)
      const response = await handleVeriffyCodes(formState.code, cleanPhone);
      
      if (!response || !response.flag) {  // Check both response and response.flag
        setShowAllert({
          open: true,
          type: 0,
          message: response?.errText || 'Невірний код підтвердження'
        });
        updateFormState('code', '');
        return; // Stop execution here
      }
      
      // Only proceed if verification was successful
      setShowAllert({
        open: true,
        type: 1,
        message: 'Код підтверджено успішно'
      });
    
       
      

      const auth = await logIn(response.id, response.password);
      
      if (!auth?.flag) {
        setShowAllert({
          open: true,
          type: 0,
          message: auth?.errText || 'Помилка при вході'
        });
      
      } else {
        navigate("/home");
      }
      
    } catch (error) {
      setShowAllert({
        open: true,
        type: 0,
        message: error?.message || 'Помилка при перевірці коду'
      });
      updateFormState('code', '');
    }
    finally{
      setLoader(false)

    }
  };

  const handleSendSms = async (event) => {
    event.preventDefault();
    const cleanPhone = formState.phone.replace(/\s+/g, '').replace(/^\+/, '');
    const cleanPreviousPhone = formState.previousPhone.replace(/\s+/g, '').replace(/^\+/, '');
    
    if (cleanPhone === cleanPreviousPhone) {
      updateFormState('phoneFromSMS', true);
      return;
    }

    const logInPhoneF = await logInPhone(cleanPhone);
    if (!logInPhoneF) {
      setShowAllert({
        open: true,
        type: 0,
        message: `Користувач з номером ${formState.phone} не знайдений !`
      });
      return;
    }

    updateFormState('previousPhone', formState.phone);
    setShowAllert({
      open: true,
      type: 1,
      message: 'Вам надіслано код підтвердження'
    });
    updateFormState('phoneFromSMS', true);
  };

  React.useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      try {
        // Отримуємо параметри з URL
        const urlParams = new URLSearchParams(window.location.search);
        const guestIp = urlParams.get('guestIp');

        let userByIp;
        
        if (guestIp) {
          // Якщо є guestIp, використовуємо checkBillingApiGuest
          userByIp = await checkBillingApiGuest(guestIp);
        } else {
          // Інакше використовуємо звичайний checkBillingApi
          userByIp = await checkBillingApi();
        }

        if (isMounted && userByIp?.ip !== '') {
          updateFormState('loginIp', userByIp.id);
          updateFormState('passwordIP', userByIp.password);
          setTimeout(() => {
            if (isMounted) {
              setOpenLogIp(true);
            }
          }, 100);
        }
        let imageUR = await getImageUrl('Veles');
        setImageU(imageUR);
        
      } catch (error) {
        console.error("Error fetching IP data:", error);
        // setShowAllert({
        //   open: true,
        //   type: 0,
        //   message: 'Помилка при отриманні даних'
        // });
      }
    };
  
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const time = new Date();
  time.setSeconds(time.getSeconds() + 150);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CustomAlertOld 
        open={showAllert.open} 
        type={showAllert.type} 
        handleClose={() => setShowAllert(prev => ({ ...prev, open: false }))} 
        message={showAllert.message} 
      />
      <animated.div style={fadeIn}>
        <Grid container component="main" sx={{ height: '100vh', position: 'relative' }}>
          <DropDownCard 
            open={openLogIp} 
            transition={Slide}
            handleClose={() => setOpenLogIp(false)} 
            user={{ login: formState.loginIp, password: formState.passwordIP }} 
          />
          <CssBaseline />
          <TelegramAdButton/>

          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              position: 'relative',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#fefefe',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.9,
              zIndex: 1,
              backgroundImage: `url(${imageU?.logo||imageUrl?.logo})`,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                opacity: 1,
              },
              '&::before': {
                backgroundImage: `url(${imageU?.logo||imageUrl?.logo})`,
                content: '""',
                backgroundRepeat: 'no-repeat',
                position: 'absolute',
                backgroundSize: 'cover',
              backgroundPosition: 'center',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1
              }
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <animated.div style={formAnimation}>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}
              >
                <animated.div style={bounceAnimation}>
                  <Avatar 
                    className='cursor-pointer' 
                    sx={{ 
                      m: 1, 
                      bgcolor: '#77cdec', 
                      textShadow: "revert", 
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)'
                      }
                    }}
                  >
                    {!formState.checkedPhone ? <VpnKeyIcon /> : <ContactPhone />}
                  </Avatar>
                </animated.div>

                <animated.div style={slideIn}>
                  <Typography 
                    component="h1" 
                    variant="h5" 
                    className='font-bold text-sky-800'
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    Кабінет користувача
                  </Typography>
                </animated.div>

                <Fade in={true} timeout={1000}>
                  <Box sx={{ width: '100%', mt: 3 }}>
                    {!formState.checkedPhone ? (
                      <Box component="div" sx={{ mt: 1, width: '80%', margin: '0 auto' }}>
                        <animated.div style={formAnimation}>
                          <TextField
                            color={formState.loginText.length > 0 ? 'success' : 'info'}
                            sx={{ 
                              mb: 2,
                              '& .MuiOutlinedInput-root': {
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }
                              }
                            }}
                            fullWidth
                            id="login"
                            label="Логін"
                            name="login"
                            autoComplete="login"
                            autoFocus
                            value={formState.loginText}
                            onChange={(e) => updateFormState('loginText', e.target.value)}
                          />
                          <FormControl fullWidth variant="outlined">
                            <OutlinedInput
                              color={formState.passwordText.length >= 6 ? 'success' : 'error'}
                              fullWidth
                              name="password"
                              placeholder='Пароль'
                              id="password"
                              autoComplete="current-password"
                              value={formState.passwordText}
                              onChange={(e) => updateFormState('passwordText', e.target.value)}
                              type={formState.showPassword ? 'text' : 'password'}
                              sx={{
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }
                              }}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => updateFormState('showPassword', !formState.showPassword)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    edge="end"
                                    sx={{
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        transform: 'scale(1.1)'
                                      }
                                    }}
                                  >
                                    {formState.showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        </animated.div>
                        <animated.div style={formAnimation}>
                          <Button
                            onClick={handleLogInWithPassword}
                            type="button"
                            fullWidth
                            variant="outlined"
                            sx={{ 
                              mt: 3, 
                              mb: 2,
                              transition: 'all 0.3s ease',
                              '&:hover:not(:disabled)': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                              }
                            }}
                            disabled={!formState.loginText.trim() || !formState.passwordText.trim()}
                          >
                            Ввійти
                          </Button>
                        </animated.div>
                      </Box>
                    ) : !formState.phoneFromSMS ? (
                      <Box component="div" sx={{ mt: 1, width: '80%', margin: '0 auto' }}>
                        <animated.div style={formAnimation}>
                          <MuiTelInput
                            inputProps={{
                              maxLength: 16,
                            }}
                            autoFocus
                            fullWidth
                            sx={{ 
                              mb: 2,
                              '& .MuiOutlinedInput-root': {
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }
                              }
                            }}
                            defaultCountry='UA'
                            value={formState.phone}
                            onChange={(newValue) => updateFormState('phone', newValue)}
                          />
                        </animated.div>
                        <animated.div style={formAnimation}>
                          <Button
                            disabled={formState.phone.replace(/\s+/g, '').replace(/^\+/, '').length < 12}
                            type="submit"
                            fullWidth
                            variant="outlined"
                            sx={{ 
                              mt: 3, 
                              mb: 2,
                              transition: 'all 0.3s ease',
                              '&:hover:not(:disabled)': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                              }
                            }}
                            onClick={handleSendSms}
                          >
                            Отримати код
                          </Button>
                        </animated.div>
                      </Box>
                    ) : (
                      <Box 
                        component="div"
                        className='flex flex-col items-center justify-center' 
                        sx={{ mt: 1, width: '80%', margin: '0 auto' }}
                      >
                        <animated.div style={formAnimation} className="w-full flex flex-col items-center">
                          <Box className="w-full flex items-center justify-center relative mb-4">
                            <IconButton 
                              onClick={() => {
                                updateFormState('phoneFromSMS', false);
                                updateFormState('code', '');
                              }}
                              sx={{ 
                                position: 'absolute', 
                                left: 0,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1) rotate(-10deg)',
                                  backgroundColor: 'rgba(0,0,0,0.04)'
                                }
                              }}
                            >
                              <ArrowBack />
                            </IconButton>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                                }
                              }}
                            >
                              {formState.phone}
                            </Typography>
                          </Box>
                          <TextField
                            sx={{ 
                              mb: 2,
                              '& .MuiOutlinedInput-root': {
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }
                              }
                            }}
                            id="code"
                            label="CODE"
                            type='number'
                            name="code"
                            autoComplete="code"
                            autoFocus
                            value={formState.code}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 4) {
                                updateFormState('code', value);
                              }
                            }}
                            inputProps={{
                              style: { textAlign: 'center' }
                            }}
                          />
                        </animated.div>
                        <animated.div style={formAnimation} className="flex flex-col items-center w-full">
                          <Timer 
                            showAllert={showAllert} 
                            setShowAllert={setShowAllert} 
                            setPhoneFromSMS={(value) => updateFormState('phoneFromSMS', value)} 
                            expiryTimestamp={time} 
                          />
                          <Button
                            type="submit"
                            disabled={!formState.code || formState.code.length < 4}
                            variant="outlined"
                            sx={{ 
                              mt: 3, 
                              mb: 2, 
                              p: 2,
                              transition: 'all 0.3s ease',
                              '&:hover:not(:disabled)': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                              }
                            }}
                            onClick={handleVeriffyCode}
                          >
                            Підтвердити код
                          </Button>
                        </animated.div>
                      </Box>
                    )}
                    <FormControlLabel
                      className='flex flex-col items-center sm:flex-row justify-center  pl-[60px]'
                      control={
                        <IoSwitch 
                          sx={{ 
                            m: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }} 
                          checked={formState.checkedPhone} 
                          onChange={(e) => {
                            updateFormState('checkedPhone', e.target.checked);
                            updateFormState('phone', '');
                            updateFormState('previousPhone', '');
                          }} 
                        />
                      }
                      label={
                        <Typography sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                          }
                        }}>
                          Вхід за номером телефону
                        </Typography>
                      }
                    />
                  </Box>
                </Fade>
              </Box>
            </animated.div>
          </Grid>
        </Grid>
      </animated.div>
      <Loader />

    </ThemeProvider>
  );
}