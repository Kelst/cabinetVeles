import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  HelpCircle as HelpIcon,
  FileText as ContractIcon
} from 'lucide-react';
import MysteriousText from '../MysteriousText/MysteriousText';
import GlasmorphizmButton from '../button/glasmorphizm/GlasmorphizmButton';
import useStore from '../../store/store';
import useConfigPage from '../../store/configPage';
import useInfoStore from '../../store/infoStore';

const iconVariants = {
  animate: {
    rotate: [0, 5, 0, -5, 0],
    scale: [1, 1.1, 1, 1.1, 1],
    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)", "brightness(1.2)", "brightness(1)"],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1
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

  const handleOpenContract = () => {
    if (configCabinet.contract_pdf) {
      window.open(configCabinet.contract_pdf, '_blank');
    }
  };

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
      className={`mt-8 bg-sky-80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg border border-sky-500/20 w-full max-w-[1600px] mx-auto ${style.animationBorder}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ boxShadow: "0 0 20px rgba(132, 204, 22, 0.2)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-sky-400 flex items-center">
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
            className="w-6 h-6 text-sky-400 hover:text-sky-300 cursor-help transition-colors duration-300"
          />
        </motion.div>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
        variants={containerVariants}
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
              className="w-full"
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
                className="w-full h-full min-h-[44px] text-sm whitespace-normal px-4 py-2 bg-sky-950/20 hover:bg-sky-900/30 border-sky-500/20 transition-all duration-300"
              />
            </motion.div>
          ) : null;
        })}
      </motion.div>

      {/* Contract button */}
      <motion.div 
        className="mt-6 flex justify-center"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.3 } }
        }}
      >
        <motion.button
          onClick={handleOpenContract}
          className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-sky-950/30 to-sky-900/20 hover:from-sky-900/40 hover:to-sky-800/30 border border-sky-500/20 rounded-lg transition-all duration-300"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 0 15px rgba(132, 204, 22, 0.3)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <ContractIcon className="w-5 h-5 text-sky-400 group-hover:text-sky-300 transition-colors duration-300" />
          <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors duration-300">
            Договір публічної оферти
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default LoginManagement;