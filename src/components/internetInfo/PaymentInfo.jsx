import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard as CardIcon,
  DollarSign as BalanceIcon,
  Calendar as CreditDateIcon,
  RefreshCw as MonthlyIcon,
  Percent as PercentS,
  Clock as LastPaymentIcon,
  Package,
  Pause
} from 'lucide-react';
import MysteriousText from '../MysteriousText/MysteriousText';
import CountdownTimer from '../сountdownTimer/CountdownTimer';
import useStore from '../../store/store';

const UAHIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 96.08 122.88"
    fill="white"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M67.41,55.44l-14.8,12H96.08V80.64H39.7c-3.76,2.84-6,6.3-6,10.71,0,7.56,6,11.66,16.71,11.66,9.13,0,17-4.4,23.3-13.53L91,101.14c-9.43,14.5-26.46,21.74-42.53,21.74-21.11,0-36.84-10.07-36.84-26.77a24.07,24.07,0,0,1,5.66-15.44H0V67.44H27.71l15.13-12H0V42.24H56.07c4.1-3.77,6-7.24,6-11.34,0-6.6-6-11.33-15.13-11.33-8.83,0-16.37,5-21.74,13.53L8.5,21.74C17.64,7.24,32.44,0,48.51,0c21.73,0,35.9,11.34,35.9,26.77a26,26,0,0,1-5,15.44h16.7V55.44Z"/>
  </svg>
);

const iconVariants = {
  animate: {
    rotateY: [0, 10, 0, -10, 0],
    rotateX: [0, 5, 10, 5, 0],
    filter: ["brightness(1)", "brightness(1.2)", "brightness(1.4)", "brightness(1.2)", "brightness(1)"],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const StatusDisplay = ({ user }) => {
  if (user?.reduction === 100) {
    return null;
  }

  return user?.status ? (
    <CountdownTimer />
  ) : (
    <motion.div 
      className="flex items-center justify-center p-4 bg-green-100 rounded-lg shadow-md animate-pulse" // Changed from red to green
      whileHover={{ scale: 1.02 }}
    >
      <Pause className="w-6 h-6 text-green-600 mr-2 animate-bounce" /> {/* Changed from red to green */}
      <span className="text-green-700 font-semibold text-lg"> {/* Changed from red to green */}
        Послугу призупинено
      </span>
    </motion.div>
  );
};

const InfoItem = ({ icon: Icon, label, value, children }) => (
  <motion.div 
    className="flex items-center py-3 border-b border-gray-600 last:border-b-0" // Changed from 700 to 600
    whileHover={{ 
      x: 5,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      transition: { duration: 0.2 }
    }}
  >
    <motion.div
      className="mr-3 perspective-400"
      variants={iconVariants}
      animate="animate"
    >
      <Icon className="w-5 h-5 flex-shrink-0 text-gray-400" />
    </motion.div>
    <motion.div 
      className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full"
      whileHover={{ color: "#6b8e23" }} // Changed from indigo to olive green
    >
      <span className="text-sm text-gray-400 sm:text-base sm:mr-4">{label}</span>
      <motion.span 
        className="font-medium text-gray-200 mt-1 sm:mt-0"
        whileHover={{ scale: 1.02 }}
      >
        {value}
      </motion.span>
    </motion.div>
    {children}
  </motion.div>
);

const AdditionalServices = ({ addServicePrice }) => {
  return (
    <motion.div 
      className="flex flex-col py-3 border-b border-gray-600 last:border-b-0 bg-gradient-to-r from-green-900/20 to-transparent" // Changed border and gradient
      whileHover={{ 
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex items-center mb-2">
        <motion.div
          className="mr-3 perspective-400"
          variants={iconVariants}
          animate="animate"
        >
          <Package className="w-5 h-5 flex-shrink-0 text-green-400" /> {/* Changed from red to green */}
        </motion.div>
        <span className="text-sm text-gray-400 sm:text-base">Додаткові послуги</span>
      </div>
      
      <div className="ml-8 space-y-2">
        {addServicePrice?.services.length > 0 ? (
          <>
            {addServicePrice.services.map((service, index) => (
              <motion.div 
                key={index} 
                className="flex justify-between items-center"
                whileHover={{ x: 2, transition: { duration: 0.2 } }}
              >
                <span className="text-sm text-gray-400">{service.name}</span>
                <span className="text-green-300">{service.price} грн</span> {/* Changed from red to green */}
              </motion.div>
            ))}
            <motion.div 
              className="flex justify-between items-center pt-2 border-t border-gray-600" // Changed from 700 to 600
              whileHover={{ x: 2, transition: { duration: 0.2 } }}
            >
              <span className="text-sm font-medium text-gray-400">Загалом:</span>
              <span className="font-medium text-green-300">{addServicePrice.total_price} грн</span> {/* Changed from red to green */}
            </motion.div>
          </>
        ) : (
          <span className="text-sm text-gray-500 italic">Додаткові послуги відсутні</span>
        )}
      </div>
    </motion.div>
  );
};

const PayButton = ({ style }) => (
  <NavLink to="/payment" className="mt-2 sm:mt-0 sm:ml-4 w-full sm:w-auto">
    <motion.div 
      className={`${style.animationBorderSM} cursor-pointer relative inline-flex items-center justify-center p-3 px-5 overflow-hidden font-medium text-sm transition duration-300 ease-out border-2 rounded-full group w-full sm:w-auto`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="absolute inset-0 flex items-center justify-center w-full h-full duration-300 -translate-x-full bg-green-600 group-hover:translate-x-0 ease"> {/* Changed from red to green */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </span>
      <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
        Оплатити
      </span>
      <span className="relative invisible">Оплатити</span>
    </motion.div>
  </NavLink>
);

const PaymentInfo = ({ style }) => {
  const user = useStore(state => state.userData);

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }

  return (
    <motion.div 
      className={`bg-gray-800 p-4 sm:p-6 rounded-md shadow-md ${style.animationBorder}`} // Changed from black to gray
      whileHover={{ boxShadow: "0 0 15px rgba(107, 142, 35, 0.3)" }} // Changed from red to olive green
    >
      <h2 className="text-xl font-bold mb-4 sm:mb-6 text-green-600 flex items-center"> {/* Changed from red to green */}
        <motion.div
          className="mr-2 perspective-400"
          variants={iconVariants}
          animate="animate"
        >
          <CardIcon className="w-6 h-6" />
        </motion.div>
        <MysteriousText>Оплата</MysteriousText>
      </h2>
      <div className="space-y-2 sm:space-y-0">
        <InfoItem icon={UAHIcon} label="Стан рахунку" value={`${user?.balance} грн.`} />
        <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-600"> {/* Changed from 700 to 600 */}
          <InfoItem icon={CardIcon} label="Кредит" value={`${user?.deposit} грн.`} />
          <InfoItem 
            icon={CreditDateIcon} 
            label="Кредит до" 
            value={formatDate(user?.dateOfEndCredits)=='1899-11-29'?'0000-00-00':formatDate(user?.dateOfEndCredits)} 
          />
        </div>
        <InfoItem 
          icon={MonthlyIcon} 
          label="Місячна абонплата" 
          value={`${user?.payAll} грн.`}
        >
          <PayButton style={style} />
        </InfoItem>
        {user?.reduction!==0 &&
          <InfoItem 
            icon={PercentS} 
            label="Знижка" 
            value={`${user?.reduction} %`}
          />
        }
        <div className="pt-3">
          <StatusDisplay user={user} />
          <AdditionalServices addServicePrice={user?.addServicePrice} />
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentInfo;