import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  HelpCircle as HelpIcon
} from 'lucide-react';
import MysteriousText from '../MysteriousText/MysteriousText';
import GlasmorphizmButton from '../button/glasmorphizm/GlasmorphizmButton';
import useStore from '../../store/store';
import useConfigPage from '../../store/configPage';
import useInfoStore from '../../store/infoStore';

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

const LoginManagement = ({ 
  style, 
  setControllPanelDialog, 
  handleClearMac, 
  handleSetCredit, 
  handleAddService, 
  handleDisplayTariff, 
  handleOpenStaticIp,
  handleUnlick,
  handleExitDialogOpen
}) => {
  const isStaticIp = useStore(state => state.user.isStaticIp);
  const ipStatic = useStore(state => state.user.ip);
  const configCabinet = useConfigPage(state => state.configCabinet);
  const user = useStore(state => state.userData);

  const actions = [
    { 
      label: 'Очистити MAC', 
      action: handleClearMac 
    },
    { 
      label: 'Встановити кредит', 
      action: handleSetCredit,
      disabled: false
    },
    { 
      label: 'Додаткові послуги', 
      action: handleAddService 
    },
    { 
      label: 'Статична IP', 
      action: handleOpenStaticIp,
      disabled: isStaticIp
    },
    { 
      label: 'Тарифні плани', 
      action: handleDisplayTariff 
    },
    { 
      label: 'Це не мій особистий кабінет', 
      action: handleUnlick 
    },
    { 
      label: 'Вийти з особистого кабінету', 
      action: handleExitDialogOpen 
    }
  ];

  const ActionButton = ({ action, shouldShow }) => {
    if (!shouldShow) return null;

    return (
      <motion.div 
        className="w-full"
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <GlasmorphizmButton 
          handleAction={action.action}
          label={action.label}
          disabled={action.disabled}
          disabledReason={action.disabled ? `Ви вже використовуєте статичну IP: ${ipStatic}` : ""}
          className="w-full h-full min-h-[40px] text-sm whitespace-normal"
        />
      </motion.div>
    );
  };

  return (
    <motion.div 
      className={`mt-8 bg-gray-800 p-4 sm:p-6 rounded-md shadow-md ${style.animationBorder}`} // Changed from black to dark gray
      whileHover={{ boxShadow: "0 0 15px rgba(107, 142, 35, 0.3)" }} // Changed from red to olive green
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl font-bold text-green-600 flex items-center"> {/* Changed from red to green */}
          <motion.div
            variants={iconVariants}
            animate="animate"
            className="mr-2"
          >
            <SettingsIcon className="w-6 h-6" />
          </motion.div>
          <MysteriousText>Керування</MysteriousText>
        </h2>
        <motion.div
          whileHover={{ 
            scale: 1.1,
            rotate: 180,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.9 }}
        >
          <HelpIcon 
            onClick={() => setControllPanelDialog(true)} 
            className="w-6 h-6 text-gray-400 hover:text-gray-300 cursor-help" // Changed hover color to lighter gray
          />
        </motion.div>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {actions.map((action, index) => {
          const shouldShow = {
            'Очистити MAC': configCabinet.home.clearMac,
            'Встановити кредит': configCabinet.home.setCredit,
            'Додаткові послуги': configCabinet.home.additionalService,
            'Статична IP': configCabinet.home.staticIp,
            'Тарифні плани': configCabinet.home.tariffPlans,
            'Це не мій особистий кабінет': configCabinet.home.unlinkLogin && user.subLogin.length !== 0,
            'Вийти з особистого кабінету': configCabinet.home.unlinkLogin && user.subLogin.length !== 0
          }[action.label];

          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <ActionButton action={action} shouldShow={shouldShow} />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default LoginManagement;