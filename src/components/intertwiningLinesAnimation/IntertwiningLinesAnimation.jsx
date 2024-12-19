import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


const IntertwiningLinesAnimation = () => {
  const [animationPhase, setAnimationPhase] = useState('hidden');
  const [position, setPosition] = useState('right');

  useEffect(() => {
    const runAnimation = () => {
      setAnimationPhase('intertwining');
      setTimeout(() => setAnimationPhase('straight'), 5000);
      setTimeout(() => setAnimationPhase('separated'), 7000);
      setTimeout(() => setAnimationPhase('fading'), 9000);
      setTimeout(() => {
        setAnimationPhase('hidden');
        if (window.innerWidth >= 1024) {
          setPosition(prev => prev === 'right' ? 'left' : 'right');
        }
      }, 14000);
    };

    const interval = setInterval(runAnimation, 15000);
    runAnimation();

    return () => clearInterval(interval);
  }, []);

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    intertwining: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 4, ease: "easeInOut" }
    },
    straight: {
      d: "M20,0 L20,100",
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" }
    },
    separated: (custom) => ({
      d: custom ? "M10,0 L10,100" : "M30,0 L30,100",
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" }
    }),
    fading: {
      opacity: 0,
      transition: { 
        opacity: { duration: 9, ease: "easeInOut" },
        d: { duration: 0 }
      }
    }
  };

  return (
    <>
      <div className={`
        fixed top-0 bottom-0 w-10 overflow-hidden bg-transparent pointer-events-none z-20
        ${position === 'right' ? 'right-0' : 'left-0'}
        hidden lg:block
      `}>
        <svg
          className="w-full h-full"
          viewBox="0 0 40 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M10,0 Q30,25 10,50 Q30,75 10,100"
            stroke="#0057b7"
            strokeWidth="10"
            fill="none"
            variants={lineVariants}
            initial="hidden"
            animate={animationPhase}
            custom={true}
          />
          <motion.path
            d="M30,0 Q10,25 30,50 Q10,75 30,100"
            stroke="#ffd700"
            strokeWidth="10"
            fill="none"
            variants={lineVariants}
            initial="hidden"
            animate={animationPhase}
            custom={false}
          />
        </svg>
      </div>

      {/* Версія для малих екранів - завжди справа */}
      <div className="fixed right-0 top-0 bottom-0 w-10 overflow-hidden bg-transparent pointer-events-none z-20 lg:hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 40 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M10,0 Q30,25 10,50 Q30,75 10,100"
            stroke="#0057b7"
            strokeWidth="10"
            fill="none"
            variants={lineVariants}
            initial="hidden"
            animate={animationPhase}
            custom={true}
          />
          <motion.path
            d="M30,0 Q10,25 30,50 Q10,75 30,100"
            stroke="#ffd700"
            strokeWidth="10"
            fill="none"
            variants={lineVariants}
            initial="hidden"
            animate={animationPhase}
            custom={false}
          />
        </svg>
      </div>
    </>
  );
};

export default IntertwiningLinesAnimation;