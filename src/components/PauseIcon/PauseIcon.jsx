import React from 'react';
import { useSpring, animated } from 'react-spring';

const AnimatedPauseIcon = () => {
  const [props, api] = useSpring(() => ({
    from: { rotation: 0, scale: 1, opacity: 1 },
    to: async (next) => {
      while (true) {
        await next({ rotation: 360, scale: 1.2, opacity: 0.7 });
        await next({ rotation: 0, scale: 1, opacity: 1 });
      }
    },
    config: { duration: 2000 },
  }));

  return (
    <animated.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: props.rotation.to(r => `rotate(${r}deg)`),
        scale: props.scale,
        opacity: props.opacity,
      }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <rect x="9" y="9" width="2" height="6" fill="currentColor" />
      <rect x="13" y="9" width="2" height="6" fill="currentColor" />
    </animated.svg>
  );
};

export default AnimatedPauseIcon;