import React from 'react';

export const RandomAvatar = ({ userId, size = 40 }) => {
  // Використовуємо fun-emoji стиль з яскравими кольорами
  const avatarUrl = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc,c0aede&mood=happy,surprised,excited,silly&radius=50`;

  return (
    <div className="flex items-center justify-center">
      <img 
        src={avatarUrl}
        alt={`Fun avatar for ${userId}`}
        className="rounded-full hover:scale-110 transition-transform"
        style={{
          filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
        }}
        width={size}
        height={size}
      />
    </div>
  );
};
