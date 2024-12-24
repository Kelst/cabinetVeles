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

  return (
    <motion.div 
      className={`mt-8 bg-black/80 p-4 sm:p-6 rounded-lg shadow-lg border border-lime-500/20 w-full max-w-[1600px] mx-auto ${style.animationBorder}`}
      whileHover={{ boxShadow: "0 0 15px rgba(132, 204, 22, 0.3)" }}
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl font-bold text-lime-400 flex items-center">
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
            className="w-6 h-6 text-lime-400 hover:text-lime-300 cursor-help"
          />
        </motion.div>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center"
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
            'Вийти з особистого кабінету': true
          }[action.label];

          return shouldShow ? (
            <motion.div
              key={index}
              className="w-full max-w-xs"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <GlasmorphizmButton 
                handleAction={action.action}
                label={action.label}
                disabled={action.disabled}
                disabledReason={action.disabled ? `Ви вже використовуєте статичну IP: ${ipStatic}` : ""}
                className="w-full h-full min-h-[48px] text-sm whitespace-normal px-6 py-3 bg-lime-950/20 hover:bg-lime-900/30 border-lime-500/20"
              />
            </motion.div>
          ) : null;
        })}
      </motion.div>
    </motion.div>
  );
};

export default LoginManagement;