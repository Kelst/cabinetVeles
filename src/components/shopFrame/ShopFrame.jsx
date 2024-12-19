import React from 'react';
import useStore from '../../store/store';

const ShopFrame = () => {
  const user = useStore(state => state.user);
  const baseUrl = "https://shop-int-telegram.pp.ua/";
  
  const params = new URLSearchParams({
    uid: user.uid || '',
    phone: user.phone || '',
    telegramId: user.telegramId || '',
    login: user.login
  }).toString();

  const fullUrl = `${baseUrl}?${params}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[108%] h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)] rounded-lg shadow-lg overflow-hidden">
        <iframe 
          src={fullUrl}
          className="w-full h-full border-0"
          title="Opticom Shop"
        />
      </div>
    </div>
  );
};

export default ShopFrame;