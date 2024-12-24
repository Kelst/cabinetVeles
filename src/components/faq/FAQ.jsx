import React, { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useConfigPage from '../../store/configPage';

const FAQItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="mb-6 perspective-1000"
      initial={{ opacity: 0, rotateX: -15 }}
      animate={{ opacity: 1, rotateX: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`w-full group relative overflow-hidden
          ${isOpen 
            ? 'bg-gradient-to-r from-[#000000] via-[#353535] to-[#000000] rounded-t-xl' 
            : 'bg-gradient-to-r from-[#000000] to-[#353535] rounded-xl'
          } 
          p-6 text-left transform transition-all duration-300
          hover:shadow-[0_0_15px_rgba(164,222,2,0.3)]
          border border-[#A4DE02]`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#A4DE02]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <motion.div
                animate={{
                  rotate: isHovered ? 180 : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-tr from-[#A4DE02] to-[#87B300] p-2 rounded-lg shadow-lg"
              >
                <Zap className="w-5 h-5 text-black" />
              </motion.div>
              {isHovered && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -inset-1 bg-[#A4DE02]/20 rounded-lg blur-sm z-0"
                />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white group-hover:text-[#A4DE02] transition-colors duration-300">
                {item.title}
              </h3>
            </div>
          </div>
          
          <motion.div
            animate={{ 
              rotate: isOpen ? 180 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="text-[#A4DE02]"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              height: 'auto', 
              scale: 1,
              transition: {
                height: { duration: 0.4 },
                scale: { duration: 0.3 },
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0, 
              scale: 0.95,
              transition: {
                height: { duration: 0.3 },
                scale: { duration: 0.2 },
              }
            }}
            className="overflow-hidden"
          >
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              className="p-6 bg-[rgba(0,0,0,0.9)] backdrop-blur-[8px]  
                rounded-b-xl border-t border-[#A4DE02] shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
            >
              <p className="text-white leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const { faq, getFaq } = useConfigPage();

  useEffect(() => {
    getFaq('Opticom');
  }, [getFaq]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#000000] via-[#353535] to-[#000000] p-6 shadow-2xl text-white">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-[#A4DE02] mb-4">
            Часті запитання  
          </h2>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#A4DE02] to-[#87B300] rounded-full" />
          <div className="absolute -inset-1 bg-[#A4DE02]/20 filter blur-xl opacity-50 rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {faq
            .filter(item => item.displayFaq)
            .map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <FAQItem item={item} />
              </motion.div>
            ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;