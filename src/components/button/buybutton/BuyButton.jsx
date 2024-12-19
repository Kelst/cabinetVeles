import React from 'react';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

const BuyButton = () => {
  return (
    <div className="relative mx-auto h-[42px] max-w-[50px] flex justify-center items-center mt-1">
      <div className="h-16 w-[14rem] bg-amber-500 items-center rounded-xl shadow-2xl cursor-pointer absolute overflow-hidden transform hover:scale-x-110 hover:scale-y-105 transition duration-300 ease-out">
        <span className="absolute text-center text-white font-semibold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          Оплатити
        </span>
      </div>
      <div className="absolute flex h-6 w-6 top-10 right-[-60px] transform translate-x-2.5 -translate-y-2.5">
        <span className="animate-ping absolute inline-flex w-[30px] h-[30px] top-1 left-1 rounded-full bg-amber-500 opacity-75"></span>
        <span className="absolute inline-flex rounded-full h-10 w-10 bg-orange-500">
          <AccountBalanceWalletOutlinedIcon className="absolute top-2 left-2 text-white" />
        </span>
      </div>
    </div>
  );
};

export default BuyButton;