import React from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, 
         DialogContentText, Button, Box, List, 
         ListItem, ListItemIcon, ListItemText, ThemeProvider, createTheme,
         IconButton, Tooltip } from '@mui/material';
import { keyframes } from '@mui/system';
import TelegramIcon from '@mui/icons-material/Telegram';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import useConfigPage from '../../store/configPage';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(107, 142, 35, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(107, 142, 35, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(107, 142, 35, 0);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const theme = createTheme({
  palette: {
    primary: { main: '#6b8e23' }, // Changed to olive green
    background: { paper: '#ffffff' },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
});

const TelegramAdButton = () => {
  const [open, setOpen] = React.useState(false);
  const [isRotating, setIsRotating] = React.useState(false);
  const configCabinet = useConfigPage(state => state.configCabinet);

  const handleHover = () => {
    setIsRotating(true);
  };

  const handleHoverEnd = () => {
    setIsRotating(false);
  };

  const benefits = [
    {
      icon: <NotificationsActiveIcon sx={{ color: '#6b8e23' }} />, // Changed to olive green
      text: 'Миттєві сповіщення про акції та знижки'
    },
    {
      icon: <AutoAwesomeIcon sx={{ color: '#6b8e23' }} />,
      text: 'Персональні пропозиції та рекомендації'
    },
    {
      icon: <SupportAgentIcon sx={{ color: '#6b8e23' }} />,
      text: 'Цілодобова підтримка 24/7'
    },
    {
      icon: <CheckCircleOutlineIcon sx={{ color: '#6b8e23' }} />,
      text: 'Розширені можливості та функції'
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Tooltip 
        title="Telegram бот" 
        placement="left"
        sx={{
          '& .MuiTooltip-tooltip': {
            bgcolor: '#6b8e23',
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(107, 142, 35, 0.5)',
            borderRadius: '4px',
            padding: '6px 12px'
          }
        }}
      >
        <Fab
          sx={{
            position: 'fixed',
            top: '96px',
            right: '29px',
            zIndex: 20,
            bgcolor: '#6b8e23', // Changed to olive green
            color: 'white',
            width: '48px',
            height: '48px',
            minHeight: 'unset',
            animation: `${pulse} 2s infinite`,
            '& .MuiSvgIcon-root': {
              animation: isRotating ? `${rotate} 2s infinite linear` : 'none',
              fontSize: '28px',
            },
            '&:hover': {
              bgcolor: '#4a5d23', // Darker olive green for hover
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s'
          }}
          onClick={() => setOpen(true)}
          onMouseEnter={handleHover}
          onMouseLeave={handleHoverEnd}
        >
          <TelegramIcon />
        </Fab>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 40px 20px rgba(0,0,0,0.1)',
            position: 'relative'
          }
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
            '&:hover': {
              color: '#6b8e23', // Changed to olive green
              transform: 'rotate(90deg)',
              transition: 'all 0.3s'
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle sx={{ 
          textAlign: 'center', 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: '#6b8e23', // Changed to olive green
          pt: 3,
          pr: 6
        }}>
          Приєднуйтесь до нашого Telegram-боту!
        </DialogTitle>
        
        <DialogContent>
          <List>
            {benefits.map((benefit, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {benefit.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={benefit.text}
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      color: '#000000'
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>

          <DialogContentText sx={{ 
            textAlign: 'center', 
            my: 2,
            color: '#666666'
          }}>
            Будьте на зв'язку та отримуйте найсвіжіші новини та пропозиції першими!
          </DialogContentText>

          <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<TelegramIcon />}
              href={`https://t.me/${configCabinet.telegram_id?.slice(1)}`}
              target="_blank"
              sx={{
                borderRadius: '28px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem',
                bgcolor: '#6b8e23', // Changed to olive green
                '&:hover': {
                  bgcolor: '#4a5d23' // Darker olive green for hover
                }
              }}
            >
              Підключитися до боту
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default TelegramAdButton;