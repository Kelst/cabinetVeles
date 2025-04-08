import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import VerifiedIcon from '@mui/icons-material/Verified';

const AnimatedVerifiedIcon = () => {
  const { scale, rotate, color } = useSpring({
    from: { scale: 1, rotate: 0, color: '#77d6ff' },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.2, rotate: 360, color: '#77d6ff' });
        await next({ scale: 1, rotate: 0, color: '#2196F3' });
      }
    },
    config: { ...config.wobbly, duration: 2000 },
  });

  return (
    <div style={{ width: 20, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <animated.div
        style={{
          transform: scale.to(s => `scale(${s})`).to(s => `rotate(${rotate.get()}deg) scale(${s})`),
        }}
      >
        <VerifiedIcon
          style={{
            width: '100%',
            height: '100%',
            color: "sky",
          }}
        />
      </animated.div>
    </div>
  );
};

export default AnimatedVerifiedIcon;