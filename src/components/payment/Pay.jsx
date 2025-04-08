import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import useConfigPage from '../../store/configPage';
import BuyButton from '../button/buybutton/BuyButton';
import useStore from '../../store/store';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
};

const Pay = ({ handlePayDialogShow }) => {
  const { payments, getPayments } = useConfigPage();
const login=useStore(state=>state.login)
  useEffect(() => {
    getPayments('Veles');
  }, [getPayments]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2 gap-3 gap-y-4 justify-center mt-1">
      {payments.map((payment) => (
        <div 
          key={payment.name}
          onClick={() => handlePayDialogShow(payment.name.toLowerCase())} 
          className="p-[2px] bg-white border border-gray-200 rounded-lg shadow relative"
        >
          <BuyButton />
          <img 
            src={payment.imageUrl} 
            alt={payment.name} 
            className="object-contain w-[300px] h-[300px] object-center bg-white m-auto" 
            loading="lazy" 
          />
        </div>
      ))}
    </div>
  );
};

export default Pay;