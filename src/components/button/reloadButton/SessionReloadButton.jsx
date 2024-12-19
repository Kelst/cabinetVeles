import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { RefreshCw } from 'lucide-react';

export const SessionReloadButton = ({ onReload, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const iconSpring = useSpring({
    transform: isPressed 
      ? 'rotate(180deg)' 
      : isHovered 
        ? 'rotate(30deg)' 
        : 'rotate(0deg)',
    config: { tension: 300, friction: 10 },
  });

  const buttonSpring = useSpring({
    scale: isPressed ? 0.95 : isHovered ? 1.05 : 1,
    config: { tension: 300, friction: 10 },
  });

  const handleClick = () => {
    if (!disabled) {
      setIsPressed(true);
      onReload();
      setTimeout(() => setIsPressed(false), 200);
    }
  };

  return (
    <animated.button
      style={{
        backgroundColor: disabled ? '#cccccc' : '#4a90e2',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'background-color 0.3s',
        ...buttonSpring,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      disabled={disabled}
    >
      <animated.div style={iconSpring}>
        <RefreshCw size={24} />
      </animated.div>
      Перезавантажити сесію
    </animated.button>
  );
};

// Демонстраційний компонент
