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
  AlertCircle
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

const MainInfo = ({ style, handleEditPhone, handleStopPlayLogin, handleReloadSession, handleCid, handleEditPassword }) => {
  const user = useStore(state => state.userData);
  const configCabinet = useConfigPage(state => state.configCabinet);
  
  const InfoItem = ({ icon: Icon, label, value, children }) => (
    <motion.div 
      className="flex items-center py-3 border-b border-gray-600 last:border-b-0"
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
        <motion.div 
          className="font-medium text-gray-200 mt-1 sm:mt-0 flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          {value}
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const renderConnectionStatus = () => {
    if (user?.guestIp?.startsWith('10.')) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-3 py-2 bg-green-800/10 rounded-lg border border-green-600/20" // Changed from red to green
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
            <AlertCircle className="w-5 h-5 text-green-600" /> {/* Changed from red to green */}
          </motion.div>
          <motion.div 
            className="flex flex-col"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-green-500 font-medium">Недостатньо коштів</span>
            <span className="text-green-400/60 text-sm">Поповніть баланс для продовження</span>
          </motion.div>
        </motion.div>
      );
    }
  
    return user?.statusInternet ? (
      <div className="inline-flex justify-center items-center gap-2">
        <AnimatedRocket type="active" />
        Active
        {configCabinet.home.reloadSesion &&
          <Tooltip title="Перезавантажити сесію" arrow>
            <IconButton size="small" className="ml-2" onClick={handleReloadSession}>
              <RefreshIcon className="w-4 h-4 text-gray-300" />
            </IconButton>
          </Tooltip>
        }
      </div>
    ) : (
      <div className="inline-flex justify-center items-center gap-2">
        <AnimatedRocket type="inactive" /> Inactive <NetworkDiagnostics/>
      </div>
    );
  };

  return (
    <motion.div 
      className={`bg-gray-800 p-4 sm:p-6 rounded-md shadow-md ${style.animationBorder}`} // Changed from black to dark gray
      whileHover={{ boxShadow: "0 0 15px rgba(107, 142, 35, 0.3)" }} // Changed from red to olive green
    >
      <TelegramAdButton/>
      <FeedbackModal/>
      <HomeTour/>
      <h2 className="text-xl font-bold mb-4 sm:mb-6 text-green-600 flex items-center"> {/* Changed from red to green */}
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
          value={user?.phone}
        >
          {configCabinet.home.editPhone &&
            <Tooltip title="Змінити номер телефону" arrow>
              <IconButton 
                aria-label="edited" 
                onClick={handleEditPhone} 
                className="ml-2"
              >
                <ModeEditOutlineTwoToneIcon className="text-gray-300" fontSize="small" />
              </IconButton>
            </Tooltip>
          }
        </InfoItem>
        <InfoItem icon={AddressIcon} label="Адреса" value={user?.address} />
        <InfoItem 
          icon={InternetIcon} 
          label="Стан з'єднання" 
          value={renderConnectionStatus()} 
        />
        <InfoItem 
          icon={Router} 
          label="MAC" 
          value={
            <Tooltip title="Інтернет сесія працює на цьому mac-адресі" arrow>
              <IconButton size="small" className="ml-2">
                <div className='text-white'>{user?.cid}</div> 
              </IconButton>
            </Tooltip>
          } 
        />
        <InfoItem 
          icon={UserIcon} 
          label="Статус" 
          value={
            user?.status 
              ? <div className="inline-flex gap-x-2"><AnimatedLoginShield /> Активний</div>
              : <div className="inline-flex gap-x-2"><PauseIcon /> На паузі</div>
          } 
        />
        <InfoItem 
          icon={PasswordIcon} 
          label="Пароль" 
          value="********"
        >
          {configCabinet.home.changePassword &&
            <Tooltip title="Змінити пароль для входу" arrow>
              <IconButton 
                aria-label="change password" 
                onClick={handleEditPassword} 
                className="ml-2"
              >
                <ModeEditOutlineTwoToneIcon className="text-gray-300" fontSize="small" />
              </IconButton>
            </Tooltip>
          }
        </InfoItem>
      </div>
      <motion.div 
        className="mt-4"
        whileHover={{ scale: 1.02 }}
      >
        {configCabinet.home.stopPlayLogin &&
          <GlasmorphizmButton 
            label={user?.status ? `Призупинити логін` : 'Активувати логін'} 
            handleAction={handleStopPlayLogin} 
          />
        }
      </motion.div>
    </motion.div>
  );
};

export default MainInfo;