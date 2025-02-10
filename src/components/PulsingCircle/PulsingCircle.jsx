import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import RocketIcon from '@mui/icons-material/Rocket';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const AnimatedRocket = ({ type }) => {
  const isActive = type === 'active';

  const rocketSpring = useSpring({
    from: { y: 0 },
    to: { y: isActive ? -5 : 0 },
    config: config.wobbly,
  });

  const flameSpring = useSpring({
    from: { scale: 1, opacity: 0 },
    to: async (next) => {
      while (isActive) {
        await next({ scale: 1.2, opacity: 1 });
        await next({ scale: 0.8, opacity: 0.7 });
      }
    },
    config: { tension: 300, friction: 10 },
  });

  const AnimatedRocketIcon = animated(RocketIcon);
  const AnimatedFlameIcon = animated(LocalFireDepartmentIcon);

  return (
    <div style={{ position: 'relative', width: 'fit-content' }}>
      <AnimatedRocketIcon
        style={{
          transform: rocketSpring.y.to(y => `translateY(${y}px)`),
          color: isActive ? '#a6ff00' : '#757575',
          fontSize: '48px',
          position: 'relative',
          zIndex: 2,
        }}
      />
      {isActive && (
        <AnimatedFlameIcon
          style={{
            position: 'absolute',
            bottom: '-15px',
            left: '1%',
            rotate:'180deg',
            transform: flameSpring.scale.to(
              scale => `translateX(-50%) scale(${scale})`
            ),
            opacity: flameSpring.opacity,
            color: '#FF9800',
            fontSize: '24px',
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
};

export default AnimatedRocket;