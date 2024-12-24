import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PaidIcon from '@mui/icons-material/Paid';
import InfoIcon from '@mui/icons-material/Info';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import CloseIcon from '@mui/icons-material/Close';
import useStore from "../../store/store";
import useInfoStore from "../../store/infoStore";
import useConfigPage from "../../store/configPage";
import ExitDialog from "../dialog/ExitDialog";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const activeItem = useInfoStore(state => state.activeItem);
  const setActiveItem = useInfoStore(state => state.setActiveItem);
  const logOut = useStore(state => state.logOut);
  const navigate = useNavigate();
  const configCabinet = useConfigPage(state => state.configCabinet);

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (e) {
      console.log('Помилка виходу з акаунта');  
    }
  };

  const handleNavItemClick = (item) => {
    setActiveItem(item);
    setIsOpen(false);
  };

  return (
    <div className="fixed left-0 top-0 z-[1000]">
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="p-3 m-4 rounded-full bg-black shadow-lg hover:shadow-[#A4DE02]/50"
      >
        <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
          <div className="h-0.5 bg-white rounded-full" />
          <div className="h-0.5 bg-white rounded-full" />
          <div className="h-0.5 bg-white rounded-full" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-[8px] flex items-center justify-center"
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[rgba(164,222,2,0.1)]"
            >
              <CloseIcon className="w-8 h-8 text-white" />
            </motion.button>

            <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-8">
              <motion.div 
                className="w-full flex justify-center items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200
                  }
                }}
              >
                <motion.img 
                  src={configCabinet.logo_min_navigation} 
                  alt="Logo" 
                  className="w-32 h-32 object-contain"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                />
              </motion.div>
              
              <motion.nav className="w-full mt-8">
                <motion.ul 
                  className="space-y-4 px-6"
                  initial="closed"
                  animate="open"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.07, delayChildren: 0.2 }
                    },
                    closed: {
                      transition: { staggerChildren: 0.05, staggerDirection: -1 }
                    }
                  }}
                >
                  <NavItem 
                    to="/"
                    icon={<PermIdentityIcon className="text-[#A4DE02]" />}
                    text="Загальне"
                    isActive={activeItem === 'Item1'}
                    onClick={() => handleNavItemClick('Item1')}
                  />
                  <NavItem 
                    to="/payment"
                    icon={<PaidIcon className="text-[#A4DE02]" />}
                    text="Оплати"
                    isActive={activeItem === 'Item2'}
                    onClick={() => handleNavItemClick('Item2')}
                  />
                  <NavItem 
                    to="/info"
                    icon={<InfoIcon className="text-[#A4DE02]" />}
                    text="Додатково"
                    isActive={activeItem === 'Item3'}
                    onClick={() => handleNavItemClick('Item3')}
                  />
                  <NavItem 
                    to="/news"
                    icon={<NewspaperIcon className="text-[#A4DE02]" />}
                    text="Новини"
                    isActive={activeItem === 'Item4'}
                    onClick={() => handleNavItemClick('Item4')}
                  />
                  {configCabinet.additional?.showStore && (
                    <NavItem 
                      to="/intelekt-shop"
                      icon={<ShoppingBasketIcon className="text-[#A4DE02]" />}
                      text="Магазин"
                      isActive={activeItem === 'Item5'}
                      onClick={() => handleNavItemClick('Item5')}
                    />
                  )}
                  
                  <motion.li 
                    className="pt-4"
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: 20 }
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setExitDialogOpen(true)}
                      className="w-full flex items-center p-3 rounded-lg text-white hover:bg-[rgba(164,222,2,0.1)] transition-colors justify-center gap-2"
                    >
                      <LogoutIcon className="text-[#A4DE02]" />  
                      <span>LogOut</span>
                    </motion.button>
                  </motion.li>
                </motion.ul>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ExitDialog 
        open={exitDialogOpen}
        handleClose={() => setExitDialogOpen(false)}
        handleLogOuth={handleLogOut}  
      />
    </div>
  );
};

const NavItem = ({ to, icon, text, isActive, onClick }) => (
  <motion.li
    variants={{
      open: { opacity: 1, y: 0 },
      closed: { opacity: 0, y: 20 }  
    }}
  >
    <NavLink
      to={to}
      onClick={onClick}
      className={`
        flex items-center p-3 rounded-lg
        transition-all duration-200  
        ${isActive 
          ? 'bg-[rgba(164,222,2,0.1)] text-black shadow-sm' 
          : 'text-white hover:bg-[rgba(164,222,2,0.1)]'
        }
      `}
    >
      <motion.span 
        className="mr-3"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {icon}
      </motion.span>
      <span>{text}</span>
    </NavLink>
  </motion.li>
);

export default Navigation;