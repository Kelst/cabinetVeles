import React from 'react';
import { 
  Fab, Dialog, DialogTitle, DialogContent, 
  DialogContentText, Button, Box, List, 
  ListItem, ListItemIcon, ListItemText, ThemeProvider, createTheme,
  IconButton, Tooltip 
} from '@mui/material';
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
    box-shadow: 0 0 0 0 rgba(135, 206, 250, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(135, 206, 250, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(135, 206, 250, 0);
  }
`;

// const pulse = keyframes`
//   0% {
//     box-shadow: 0 0 0 0 rgba(135, 206, 250, 0.7);
//   }
//   70% {
//     box-shadow: 0 0 0 15px rgba(135, 206, 250, 0);
//   }
//   100% {
//     box-shadow: 0 0 0 0 rgba(135, 206, 250, 0);
//   }
// `;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#77d6ff',
    },
    background: {
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#77d6ff',
    },
  },
});

const TelegramAdButton = () => {
  const [open, setOpen] = React.useState(false);
  const [isRotating, setIsRotating] = React.useState(false);
  const configCabinet = useConfigPage(state => state.configCabinet);

  const benefits = [
    {
      icon: <NotificationsActiveIcon sx={{ color: '#77d6ff' }} />,
      text: 'Миттєві сповіщення про акції та знижки'
    },
    {
      icon: <AutoAwesomeIcon sx={{ color: '#77d6ff' }} />,
      text: 'Персональні пропозиції та рекомендації'
    },
    {
      icon: <SupportAgentIcon sx={{ color: '#77d6ff' }} />,
      text: 'Цілодобова підтримка 24/7'
    },
    {
      icon: <CheckCircleOutlineIcon sx={{ color: '#77d6ff' }} />,
      text: 'Розширені можливості та функції'
    }
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Tooltip 
        title="Telegram бот" 
        placement="left"
        sx={{
          '& .MuiTooltip-tooltip': {
            bgcolor: '#1a1a1a',
            color: '#77d6ff',
            fontSize: '0.875rem',
            fontWeight: 500,
            boxShadow: '0 2px 8px black',
            borderRadius: '8px',
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
            bgcolor: '#77d6ff',
            color: '#000',
            width: '48px',
            height: '48px',
            minHeight: 'unset',
            animation: `${pulse} 2s infinite`,
            '& .MuiSvgIcon-root': {
              animation: isRotating ? `${rotate} 2s infinite linear` : 'none',
              fontSize: '28px',
            },
            '&:hover': {
              bgcolor: '#fff',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s'
          }}
          onClick={() => setOpen(true)}
          onMouseEnter={() => setIsRotating(true)}
          onMouseLeave={() => setIsRotating(false)}
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
            bgcolor: '#1a1a1a',
            borderRadius: '16px',
            boxShadow: '0 4px 30px black',
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

        <DialogTitle sx={{ 
          textAlign: 'center', 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: '#77d6ff',
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
                      color: '#fff'
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>

          <DialogContentText sx={{ 
            textAlign: 'center', 
            my: 2,
            color: 'rgba(255, 255, 255, 0.7)'
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
                borderRadius: '9999px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem',
                bgcolor: '#black',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#fff',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease'
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