import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';

const AnimatedHeader = () => {
  const letterSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0) rotate(180deg)' },
    to: { opacity: 1, transform: 'scale(1) rotate(0deg)' },
    config: config.molasses,
    delay: 200,
  });

  const highlightSpring = useSpring({
    from: { width: '0%' },
    to: { width: '100%' },
    delay: 1000,
    config: config.gentle,
  });

  const subtitleSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 1500,
    config: config.gentle,
  });

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="relative">
        <animated.h1 
          style={letterSpring} 
          className="text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
        >
          INTELEKT
        </animated.h1>
        <animated.div 
          style={highlightSpring}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-600"
        />
      </div>
      
      <animated.p 
        style={subtitleSpring}
        className="text-xl text-gray-300 mt-4"
      >
        Особистий кабінет
      </animated.p>
    </div>
  );
};

export default AnimatedHeader;