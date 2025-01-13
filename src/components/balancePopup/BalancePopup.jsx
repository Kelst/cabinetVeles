import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import useInfoStore from '../../store/infoStore';
import useStore from '../../store/store';

const BalancePopup = ({ balance, credit = 0, deposit = 0, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const setLoader = useInfoStore(store => store.setLoader);
  const showAllert = useInfoStore(state => state.showAllert);
  const addCredit = useStore(state => state.addCredit);
  const uid = useStore(state => state.user.uid);
  const login = useStore(state => state.user.login);

  useEffect(() => {
    setIsVisible(balance < 0 && credit === 0);
  }, [balance, credit]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleSetCredit = async () => {
    let result;
    try {
      setLoader(true);
      result = await addCredit(uid, login);
      
      if (result.status) {
        showAllert(2, result.message);
      } else {
        showAllert(0, result.message);
      }
    } catch (error) {
      showAllert(0, "Помилка при встановленні кредиту");
    } finally {
      setLoader(false);
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 z-[1000] right-4 max-w-sm bg-black rounded-lg shadow-lg p-6 border border-green-600"
      >
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 text-green-500 hover:text-green-400"
        >
          <XCircle className="h-5 w-5" />
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              <span className="text-green-500 text-xl">⚠️</span>
            </motion.div>
            <h3 className="font-medium text-white">Від'ємний баланс</h3>
          </div>
          
          <p className="text-gray-300">
            На вашому рахунку: 
            <span className="font-semibold text-green-500 ml-1">
              {balance.toFixed(2)} грн
            </span>
          </p>
          
          <p className="text-sm text-gray-400 mt-1">
            Для продовження користування послугами, будь ласка, поповніть баланс
          </p>
        </div>

        <div className="space-y-2">
          <NavLink to="/payment">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              Перейти до оплати
            </motion.button>
          </NavLink>

          {deposit === 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSetCredit}
              className="w-full bg-white text-black py-2 px-4 rounded hover:bg-gray-100 transition-colors"
            >
              Встановити кредит
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BalancePopup;