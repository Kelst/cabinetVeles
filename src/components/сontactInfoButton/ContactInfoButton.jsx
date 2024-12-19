import React, { useState } from 'react';
import { 
  IconButton, 
  Popover, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Typography,
  Fade,
  Paper
} from '@mui/material';
import { Phone, ContentCopy, Check } from '@mui/icons-material';
import { useSpring, animated } from 'react-spring';
import useConfigPage from '../../store/configPage';

const ContactInfoButton = ({ iconColor }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const configCabinet = useConfigPage(state => state.configCabinet);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = async (phone, index) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback копіювання
      const textArea = document.createElement('textarea');
      textArea.value = phone;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const open = Boolean(anchorEl);

  const animationProps = useSpring({
    opacity: open ? 1 : 0,
    transform: open ? 'scale(1)' : 'scale(0.8)',
  });

  return (
    <>
      <IconButton onClick={handleClick}>
        <Phone sx={{ color: iconColor }} />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            minWidth: '300px',
          }
        }}
      >
        <animated.div style={animationProps}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              textAlign: 'center', 
              fontWeight: 'bold',
              py: 1 
            }}
          >
            Технічна підтримка
          </Typography>
          <List>
            {configCabinet.phoneNumbers.map((item, index) => (
              <ListItem
                key={index}
                sx={{ position: 'relative' }} // Додаємо відносне позиціонування
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="copy"
                    onClick={() => handleCopy(item.phone, index)}
                  >
                    {copiedIndex === index ? <Check /> : <ContentCopy />}
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <Phone />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  secondary={item.phone}
                />
                {/* Повідомлення про копіювання */}
                <Fade in={copiedIndex === index}>
                  <Paper
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '-20px',
                      transform: 'translateX(-50%)',
                      bgcolor: 'rgba(0, 0, 0, 0.87)',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      zIndex: 99999,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Typography variant="caption">
                      Скопійовано: {item.phone}
                    </Typography>
                  </Paper>
                </Fade>
              </ListItem>
            ))}
          </List>
        </animated.div>
      </Popover>
    </>
  );
};

export default ContactInfoButton;