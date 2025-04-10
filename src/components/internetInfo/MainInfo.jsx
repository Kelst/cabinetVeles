import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone as PhoneIcon,
  MapPin as AddressIcon,
  Wifi as InternetIcon,
  User as UserIcon,
  RefreshCw as RefreshIcon,
  Lock as PasswordIcon,
  Router,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { IconButton, Tooltip } from '@mui/material';
import ModeEditOutlineTwoToneIcon from '@mui/icons-material/ModeEditOutlineTwoTone';
import MysteriousText from '../MysteriousText/MysteriousText';
import AnimatedLoginShield from '../CheckmarkSquare/CheckmarkSquare';
import PauseIcon from '../PauseIcon/PauseIcon';
import GlasmorphizmButton from '../button/glasmorphizm/GlasmorphizmButton';
import useStore from '../../store/store';
import AnimatedRocket from '../PulsingCircle/PulsingCircle';
import NetworkDiagnostics from '../networkDiagnostics/NetworkDiagnostics';
import useConfigPage from '../../store/configPage';
import TelegramAdButton from '../telegramComponent/TelegramAdButton';
import FeedbackModal from '../callBack/FeedbackModal';
import HomeTour from '../tutorial/HomeTour';

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

const EmptyValuePlaceholder = ({ message = "Дані відсутні" }) => (
  <motion.div 
    className="inline-flex items-center gap-2 text-sky-600/60"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    whileHover={{ scale: 1.05 }}
  >
    <HelpCircle className="w-4 h-4" />
    <span className="text-sm">{message}</span>
  </motion.div>
);

const MainInfo = ({ style, handleEditPhone, handleStopPlayLogin, handleReloadSession, handleCid, handleEditPassword }) => {
  const user = useStore(state => state.userData);
  const configCabinet = useConfigPage(state => state.configCabinet);

  const formatValue = (value, defaultMessage, type = 'default') => {
    if (type === 'address') {
      if (!value || 
          value.split(' ').every(part => part === 'undefined' || part === 'null') ||
          value.includes('undefined undefined')) {
        return <EmptyValuePlaceholder message={defaultMessage} />;
      }
    }
    
    if (value === undefined || value === null || value === '') {
      return <EmptyValuePlaceholder message={defaultMessage} />;
    }
    return value;
  };
  
  const InfoItem = ({ icon: Icon, label, value, defaultMessage = "Дані відсутні", type = 'default', children }) => (
    <motion.div 
      className="flex items-center py-3 border-b border-red-300 last:border-b-0"
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
        <Icon className="w-5 h-5 flex-shrink-0 text-sky-400" />
      </motion.div>
      <motion.div 
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full"
        whileHover={{ color: "#84cc16" }}
      >
        <span className="text-sm text-sky-200/70 sm:text-base sm:mr-4">{label}</span>
        <motion.div 
          className="font-medium text-sky-100 mt-1 sm:mt-0 flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          {formatValue(value, defaultMessage, type)}
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const renderConnectionStatus = () => {
    if (!user?.guestIp) {
      return <EmptyValuePlaceholder message="IP адреса недоступна" />;
    }

    if (user.guestIp.startsWith('10.')) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-3 py-2 bg-sky-900 rounded-lg border border-sky-600"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 15, -15, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <AlertCircle className="w-5 h-5 text-sky-500" />
          </motion.div>
          <motion.div 
            className="flex flex-col"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sky-500 font-medium">Недостатньо коштів</span>
            <span className="text-sky-400/60 text-sm">Поповніть баланс для продовження</span>
          </motion.div>
        </motion.div>
      );
    }
  
    if (user?.statusInternet === undefined) {
      return <EmptyValuePlaceholder message="Статус з'єднання невідомий" />;
    }
  
    return user.statusInternet ? (
      <div className="inline-flex justify-center items-center gap-2 text-sky-100">
        <AnimatedRocket type="active" />
        Active
        {configCabinet?.home?.reloadSesion &&
          <Tooltip title="Перезавантажити сесію" arrow>
            <IconButton size="small" className="ml-2" onClick={handleReloadSession}>
              <RefreshIcon className="w-4 h-4 text-sky-300" />
            </IconButton>
          </Tooltip>
        }
      </div>
    ) : (
      <div className="inline-flex justify-center items-center gap-2 text-sky-100">
        <AnimatedRocket type="inactive" /> 
        Inactive 
        <NetworkDiagnostics/>
      </div>
    );
  };

  if (!user) {
    return (
      <motion.div 
        className="bg-sky-80 p-6 rounded-lg shadow-lg border border-sky-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <EmptyValuePlaceholder message="Дані користувача недоступні" />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`bg-sky-80 p-4 sm:p-6 rounded-lg shadow-lg border border-sky-500 ${style?.animationBorder || ''}`}
      whileHover={{ boxShadow: "0 0 15px rgba(132, 204, 22, 0.3)" }}
    >
      <TelegramAdButton/>
      <FeedbackModal/>
      <HomeTour/>
      <h2 className="text-xl font-bold mb-4 sm:mb-6 text-sky-400 flex items-center">
        <motion.div
          className="mr-2 perspective-400"
          variants={iconVariants}
          animate="animate"
        >
          <UserIcon className="w-6 h-6" />
        </motion.div>
        <MysteriousText>Основне</MysteriousText>
      </h2>
      <div className="space-y-2 sm:space-y-0">
        <InfoItem 
          icon={PhoneIcon} 
          label="Телефон" 
          value={user.phone}
          defaultMessage="Номер телефону не вказано"
        >
          {configCabinet?.home?.editPhone &&
            <Tooltip title="Змінити номер телефону" arrow>
              <IconButton 
                aria-label="edited" 
                onClick={handleEditPhone} 
                className="ml-2"
              >
                <ModeEditOutlineTwoToneIcon className="text-sky-300" fontSize="small" />
              </IconButton>
            </Tooltip>
          }
        </InfoItem>
        <InfoItem 
          icon={AddressIcon} 
          label="Адреса" 
          value={user.address}
          defaultMessage="Адреса не вказана"
          type="address" 
        />
        <InfoItem 
          icon={InternetIcon} 
          label="Стан з'єднання" 
          value={renderConnectionStatus()} 
        />
        <InfoItem 
          icon={Router} 
          label="MAC" 
          value={
            user.cid ? (
              <Tooltip title="Інтернет сесія працює на цьому mac-адресі" arrow>
                <IconButton size="small" className="ml-2">
                  <div className="text-sky-100">{user.cid}</div> 
                </IconButton>
              </Tooltip>
            ) : undefined
          }
          defaultMessage="MAC адреса не доступна"
        />
        <InfoItem 
          icon={UserIcon} 
          label="Статус" 
          value={
            user.status !== undefined ? (
              user.status 
                ? <div className="inline-flex gap-x-2 text-sky-100"><AnimatedLoginShield /> Активний</div>
                : <div className="inline-flex gap-x-2 text-sky-100"><PauseIcon /> На паузі</div>
            ) : undefined
          }
          defaultMessage="Статус невідомий"
        />
        <InfoItem 
          icon={PasswordIcon} 
          label="Пароль" 
          value="********"
        >
          {configCabinet?.home?.changePassword &&
            <Tooltip title="Змінити пароль для входу" arrow>
              <IconButton 
                aria-label="change password" 
                onClick={handleEditPassword} 
                className="ml-2"
              >
                <ModeEditOutlineTwoToneIcon className="text-sky-300" fontSize="small" />
              </IconButton>
            </Tooltip>
          }
        </InfoItem>
      </div>
      <motion.div 
        className="mt-4"
        whileHover={{ scale: 1.02 }}
      >
        {configCabinet?.home?.stopPlayLogin &&
          <GlasmorphizmButton 
            label={user.status ? `Призупинити логін` : 'Активувати логін'} 
            handleAction={handleStopPlayLogin} 
          />
        }
      </motion.div>
    </motion.div>
  );
};

export default MainInfo;