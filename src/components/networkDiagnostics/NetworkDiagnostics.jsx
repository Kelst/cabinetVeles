import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Router, Check, X, Cable, MessageCircle, Activity } from 'lucide-react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import useStore from '../../store/store';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <motion.div
      animate={{
        rotate: 360,
        borderRadius: ["25%", "25%", "50%", "50%", "25%"],
      }}
      transition={{
        duration: 2,
        ease: "linear",
        repeat: Infinity,
      }}
      className="w-16 h-16 border-4 border-blue-500 border-t-transparent"
    />
  </div>
);

// Image Modal Component
const ImageModal = ({ isOpen, onClose, imageSrc }) => (
  <Modal
    open={isOpen}
    onClose={onClose}
    aria-labelledby="image-modal"
  >
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '90vw',
      maxHeight: '90vh',
      bgcolor: 'background.paper',
      borderRadius: '8px',
      p: 2,
    }}>
      <img 
        src={imageSrc} 
        alt="Enlarged view" 
        style={{
          maxWidth: '100%',
          maxHeight: 'calc(90vh - 2rem)',
          objectFit: 'contain'
        }}
      />
    </Box>
  </Modal>
);

const DiagnosticNode = ({ children, isActive, delay }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white p-4 rounded-lg shadow-lg w-[320px] relative z-10"
  >
    {children}
  </motion.div>
);

const ProviderNote = ({ children }) => (
  <div className="mt-2 bg-blue-50 p-2 rounded-lg text-sm text-blue-800 border border-blue-100">
    <div className="flex items-start gap-2">
      <MessageCircle className="w-4 h-4 mt-1 flex-shrink-0" />
      <div>{children}</div>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="text-center p-4">
    <div className="text-red-500 mb-2">
      <X className="mx-auto mb-2" size={24} />
      <Typography variant="h6" component="h3">
        Помилка діагностики
      </Typography>
    </div>
    <Typography variant="body1" className="text-gray-600">
      {message}
    </Typography>
  </div>
);

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflow: 'auto',
  borderRadius: '8px',
  width: '800px'
};

const NetworkDiagnostics = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const getDataOnu = useStore(state => state.getDataOnu);
  const uid = useStore(state => state?.user?.uid);

  const DiagnosticIcon = () => (
    <Tooltip title="Діагностика мережі" arrow>
      <div 
        onClick={handleOpen}
        className="cursor-pointer p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200 shadow-lg flex items-center justify-center group"
      >
        <Activity 
          size={24} 
          className="text-white group-hover:scale-110 transition-transform duration-200" 
        />
      </div>
    </Tooltip>
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCurrentStep(0);
    setResults(null);
    setError(null);
  };

  const handleImageClick = (imageSrc) => {
    if (imageSrc) {
      setSelectedImage(imageSrc);
    }
  };

  const handleImageClose = () => {
    setSelectedImage(null);
  };

  const handleCheck = async () => {
    setIsChecking(true);
    setError(null);
    setCurrentStep(0);
    setResults(null);

    if (!uid) {
      setError("Помилка автентифікації користувача. Спробуйте перезавантажити сторінку.");
      setIsChecking(false);
      return;
    }

    try {
      const data = await getDataOnu(uid);
      
      // Validate received data
      if (!data) {
        throw new Error("Не вдалося отримати дані діагностики");
      }

      setResults(data);
      
      let step = 1;
      const interval = setInterval(() => {
        if (step < 3) {
          setCurrentStep(step);
          step++;
        } else {
          clearInterval(interval);
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Виникла помилка під час діагностики. Спробуйте пізніше.");
    } finally {
      setIsChecking(false);
    }
  };

  const isOnuActive = React.useMemo(() => {
    return results?.activeOnu === true;
  }, [results?.activeOnu]);

  const isPortStateUp = React.useMemo(() => {
    if (!results?.portState?.linkState) return false;
    const linkState = results.portState.linkState.toLowerCase();
    return linkState === "up" || linkState === "link-up";
  }, [results?.portState?.linkState]);

  const renderContent = () => {
    if (error) {
      return <ErrorState message={error} />;
    }

    if (isChecking && currentStep === 0) {
      return <LoadingSpinner />;
    }

    return (
      <div className="w-full">
        <div className="text-center mb-8">
          <Typography variant="h4" component="h2" className="mb-4">
            Діагностика Обладнання
          </Typography>
          {!isChecking && currentStep === 0 && (
            <Button 
              variant="contained" 
              onClick={handleCheck}
              sx={{ 
                borderRadius: '9999px',
                textTransform: 'none',
                py: 1.5,
                px: 4
              }}
            >
              Почати перевірку
            </Button>
          )}
        </div>

        <div className="relative flex flex-wrap justify-center gap-8 items-start mt-8">
          {/* ONU Status Node */}
          <DiagnosticNode isActive={currentStep >= 1} delay={0.5}>
            <div className="flex flex-col items-center">
              <Router className={isOnuActive ? "text-sky-500 mb-2" : "text-red-500 mb-2"} size={24} />
              <h3 className="font-semibold mb-2">Оптичний термінал</h3>
              {isOnuActive ? (
                <div className="text-center">
                  <span className="text-sky-500 flex items-center justify-center mb-2">
                    <Check size={16} className="mr-1" /> Обладнання в мережі
                  </span>
                  <p className="text-sm text-gray-600">
                    Оптичний термінал працює справно та підтримує стабільне з'єднання з мережею
                  </p>
                  <ProviderNote>
                    Ваше оптичне обладнання функціонує оптимально. Переконайтеся, що налаштування вашого роутера відповідають рекомендованим параметрам для найкращої продуктивності.
                  </ProviderNote>
                </div>
              ) : (
                <div className="text-red-500">
                  <span className="flex items-center mb-2">
                    <X size={16} className="mr-1" /> Термінал не в мережі
                  </span>
                  <img 
                    src="src/assets/onu.png" 
                    alt="ONU Inactive" 
                    className="mb-2 rounded-lg w-full cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleImageClick("src/assets/onu.png")}
                  />
                  <div className="text-sm bg-red-50 p-2 rounded">
                    Будь ласка, перевірте:
                    <ul className="list-disc list-inside mt-1 text-gray-700">
                      <li>Чи включений оптичний термінал в розетку</li>
                      <li>Чи не горить LOS лампочка на терміналі</li>
                      <li>Чи правильно підключений оптичний кабель</li>
                      <li>Блок живлення має бути 12 Вольт 0.5 ампер</li>
                    </ul>
                  </div>
                  <ProviderNote>
                    Я бачу, що ваш термінал зараз не на зв'язку. Давайте разом перевіримо базові речі, щоб відновити з'єднання.
                  </ProviderNote>
                </div>
              )}
            </div>
          </DiagnosticNode>

          {/* Connection Status Node */}
          <DiagnosticNode isActive={currentStep >= 2} delay={1}>
            <div className="flex flex-col items-center">
              <Cable className="text-blue-500 mb-2" size={24} />
              <h3 className="font-semibold mb-2">З'єднання з обладнанням</h3>
              {results?.portState ? (
                <div className="text-center">
                  {isPortStateUp ? (
                    <>
                      <div className="text-sky-500 font-bold mb-2">
                        <Check size={16} className="inline mr-1" />
                        З'єднання з роутером активне
                      </div>
                      <ProviderNote>
                        З'єднання встановлено успішно. Для оптимальної роботи перевірте налаштування вашого роутера:
                        <ul className="list-disc list-inside mt-1 text-sm">
                          <li>DNS сервери</li>
                          <li>Режим роботи WAN порту</li>
                          <li>Налаштування DHCP</li>
                        </ul>
                      </ProviderNote>
                    </>
                  ) : (
                    <div className="text-red-500">
                      <X size={16} className="inline mr-1" />
                      Відсутнє з'єднання з роутером
                      <img 
                        src="src/assets/linkD.jpg" 
                        alt="Link Down" 
                        className="my-2 rounded-lg w-full cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick("src/assets/linkD.jpg")}
                      />
                      <div className="text-sm bg-red-50 p-2 rounded mt-2">
                        Необхідно перевірити:
                        <ul className="list-disc list-inside mt-1 text-gray-700">
                          <li>Кабель між терміналом та роутером,роутер та оптичний термінал мають бути з`єднані, LAN port термінала з wan портом Роутера </li>
                          <li>Живлення роутера</li>
                          <li>Справність мережевих портів</li>
                        </ul>
                      </div>
                      <ProviderNote>
                        Виявлено проблему зі з'єднанням між оптичним терміналом та вашим роутером. Спробуйте перезавантажити обладнання та перевірити кабель.
                      </ProviderNote>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-yellow-500">
                  <span className="flex items-center mb-2">
                    <MessageCircle size={16} className="mr-1" /> Немає даних про стан з'єднання
                  </span>
                  <p className="text-sm text-gray-600">
                    Не вдалося отримати інформацію про стан з'єднання. Спробуйте повторити перевірку.
                  </p>
                </div>
              )}
            </div>
          </DiagnosticNode>
        </div>

        {currentStep >= 2 && (
          <div className="text-center mt-8">
            <Button 
              variant="contained" 
              onClick={handleCheck}
              sx={{ 
                borderRadius: '9999px',
                textTransform: 'none',
                py: 1.5,
                px: 4
              }}
            >
              Перевірити знову
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <DiagnosticIcon />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-diagnostic"
        aria-describedby="modal-network-diagnostic"
      >
        <Box sx={modalStyle}>
          {renderContent()}
        </Box>
      </Modal>
      <ImageModal 
        isOpen={!!selectedImage}
        onClose={handleImageClose}
        imageSrc={selectedImage}
      />
    </>
  );
};

export default NetworkDiagnostics;