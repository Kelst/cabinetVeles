import React, { useState, useEffect } from 'react';
import { useSpring, animated, config } from 'react-spring';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setIsFlipping(prev => !prev); // Змінюємо стан кожну секунду
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const difference = endOfMonth - now;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  const { rotation } = useSpring({
    rotation: isFlipping ? 180 : 0,
    config: { ...config.wobbly, duration: 500 }, // Зменшуємо тривалість анімації
  });

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center p-2 bg-gray-700 rounded-lg">
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-600 rounded-lg shadow-lg">
      <p className="text-gray-300 mb-2">Наступна абонплата через:</p>
      
      {/* Мобільна версія (тільки дні) */}
      <div className="md:hidden">
        <animated.div
          style={{
            transform: rotation.to(r => `perspective(600px) rotateX(${r}deg)`),
            transformStyle: 'preserve-3d',
          }}
          className="w-20 h-20 relative"
        >
          <div className="absolute w-full h-full bg-orange-500 rounded-lg flex items-center justify-center text-3xl font-bold text-gray-100"
               style={{ backfaceVisibility: 'hidden' }}>
            {timeLeft.days}
          </div>
          <div className="absolute w-full h-full bg-yellow-600 rounded-lg flex items-center justify-center text-3xl font-bold text-gray-100"
               style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}>
            {timeLeft.days}
          </div>
        </animated.div>
        <div className="mt-2 text-sm text-gray-400">днів</div>
      </div>

      {/* Десктопна версія (повний відлік) */}
      <div className="hidden md:grid grid-flow-col gap-4 text-center auto-cols-max text-white">
        <TimeUnit value={timeLeft.days} label="днів" />
        <TimeUnit value={timeLeft.hours} label="годин" />
        <TimeUnit value={timeLeft.minutes} label="хвилин" />
        <TimeUnit value={timeLeft.seconds} label="секунд" />
      </div>
    </div>
  );
};

export default CountdownTimer;