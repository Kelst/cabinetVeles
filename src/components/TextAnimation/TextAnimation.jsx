import React from 'react';
import { useSprings, animated } from '@react-spring/web';

const TextAnimation = ({text}) => {
    const letters = text.split('');

    const springs = useSprings(
      letters.length,
      letters.map(() => ({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { duration: 300 },
        delay: Math.random() * 200, // Випадкова затримка до 2000 мс
      }))
    );
  
    return (
      <div style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
        {springs.map((props, index) => (
          <animated.span key={index} style={{ ...props, whiteSpace: 'pre' }}>
            {letters[index]}
          </animated.span>
        ))}
      </div>
    )
};

export default TextAnimation;