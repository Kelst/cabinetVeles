import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi as WifiIcon,
  Zap as SpeedIcon,
  DollarSign as PriceIcon,
  Globe as IpIcon,
  Clock as DurationIcon,
  ArrowUp as UploadIcon,
  ArrowDown as DownloadIcon
} from 'lucide-react';
import MysteriousText from '../MysteriousText/MysteriousText';
import useStore from '../../store/store';
import CancelStaticIpButton from '../сancelStaticIpButton/CancelStaticIpButton';

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

const InfoTooltip = ({ children, tooltipText }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="w-full relative">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="w-full"
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-80 p-4 text-sm bg-black/90 text-lime-100 rounded-md shadow-lg transform -translate-x-1/2 left-1/2 -translate-y-full -top-2 border border-lime-500/20"
          >
            <div className="relative">
              <p>
                Для використання тарифного плану зі швидкістю Інтернету від 300 до 1000 Мбіт/с необхідно використовувати спеціальний потужний роутер(мережеву карту) з підтримкою відповідного показника швидкості.
              </p>
              <div className="absolute w-3 h-3 bg-black rotate-45 -bottom-1.5 left-1/2 transform -translate-x-1/2 border-r border-b border-lime-500/20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <motion.div 
    className="flex items-center py-3 border-b border-lime-600/20 last:border-b-0"
    whileHover={{ 
      x: 5,
      backgroundColor: "rgba(163, 230, 53, 0.05)",
      transition: { duration: 0.2 }
    }}
  >
    <motion.div 
      className="mr-3 perspective-400"
      variants={iconVariants}
      animate="animate"
    >
      <Icon className="w-5 h-5 flex-shrink-0 text-lime-400" />
    </motion.div>
    <motion.div 
      className={`flex flex-col ${label === 'Тарифний план' ? 'sm:flex-col' : 'sm:flex-row'} sm:justify-between sm:items-center w-full`}
      whileHover={{ color: "#84cc16" }}
    >
      <span className="text-sm text-lime-200/70 sm:text-base sm:mr-4">{label}</span>
      <motion.span 
        className="font-medium text-lime-100 mt-1 sm:mt-0"
        whileHover={{ scale: 1.05 }}
      >
        {value || 'N/A'}
      </motion.span>
    </motion.div>
  </motion.div>
);

const UAHIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 96.08 122.88"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M67.41,55.44l-14.8,12H96.08V80.64H39.7c-3.76,2.84-6,6.3-6,10.71,0,7.56,6,11.66,16.71,11.66,9.13,0,17-4.4,23.3-13.53L91,101.14c-9.43,14.5-26.46,21.74-42.53,21.74-21.11,0-36.84-10.07-36.84-26.77a24.07,24.07,0,0,1,5.66-15.44H0V67.44H27.71l15.13-12H0V42.24H56.07c4.1-3.77,6-7.24,6-11.34,0-6.6-6-11.33-15.13-11.33-8.83,0-16.37,5-21.74,13.53L8.5,21.74C17.64,7.24,32.44,0,48.51,0c21.73,0,35.9,11.34,35.9,26.77a26,26,0,0,1-5,15.44h16.7V55.44Z"/>
  </svg>
);

const InternetInfo = ({ style }) => {
  const user = useStore(state => state.userData);

  const extractTariffInfo = (tariff) => {
    if (!tariff) return { speed: 'N/A', price: 'N/A' };
    const match = tariff.match(/(\d+)\((\d+)\)/);
    return {
      speed: match ? `${match[1]} Mбіт` : 'N/A',
      price: match ? `${match[2]} грн.` : 'N/A'
    };
  };

  const tariffInfo = extractTariffInfo(user?.tariff);
  const isStaticIp = useStore(state => state.user.isStaticIp);

  return (
    <motion.div 
      className={`bg-black/80 p-4 sm:p-6 rounded-lg shadow-lg border border-lime-500/20 ${style.animationBorder}`}
      whileHover={{ boxShadow: "0 0 15px rgba(132, 204, 22, 0.3)" }}
    >
      <h2 className="text-xl font-bold mb-4 sm:mb-6 text-lime-400 flex items-center">
        <motion.div 
          className="mr-2 perspective-400"
          variants={iconVariants}
          animate="animate"
        >
          <WifiIcon className="w-6 h-6" />
        </motion.div>
        <MysteriousText>Інтернет</MysteriousText>
      </h2>
      <div className="space-y-2 sm:space-y-0">
        <InfoItem icon={WifiIcon} label="Тарифний план" value={user?.tariff} />
        <InfoTooltip tooltipText="Для використання тарифного плану...">
          <InfoItem icon={SpeedIcon} label="Швидкість до" value={tariffInfo.speed} />
        </InfoTooltip>
        <InfoItem icon={UAHIcon} label="Вартість" value={tariffInfo.price} />
        <InfoItem icon={IpIcon} label="IP" value={user?.ip} />
        {isStaticIp && <CancelStaticIpButton/>}
        <InfoItem icon={DurationIcon} label="Тривалість" value={user?.duration} />
        <InfoItem icon={UploadIcon} label="Відправлено" value={`${user?.sendData} GB`} />
        <InfoItem icon={DownloadIcon} label="Отримано" value={`${user?.getData} GB`} />
      </div>
    </motion.div>
  );
};

export default InternetInfo;