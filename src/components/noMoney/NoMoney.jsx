import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo-01.png';

const NoMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (location.pathname !== '/nomoney/opticom') {
      navigate('/nomoney/opticom', { replace: true });
    }
    setIsVisible(true);
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-green-50 p-5">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          {/* Logo container */}
          <div className="flex justify-center items-center mb-8">
            <img 
              src={Logo} 
              className="w-[400px] h-[300px] object-contain" 
              alt="Logo" 
            />
          </div>

          {/* Message */}
          <div className="text-green-800 text-xl animate-[bounceIn_1s_ease-out]">
            <h2 className="text-2xl font-semibold mb-4">
              Шановний абонент!
            </h2>
            <div className="space-y-4">
              <p>
                Ми зафіксували недостатньо коштів на вашому рахунку...
              </p>
              <p>
                Для продовження використання послуги поповніть рахунок будь-яким зручним способом.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 space-y-4">
            <div>
              <a
                href="https://t.me/Opticom_plus_bot"
                className="inline-block px-8 py-4 bg-blue-500 text-white rounded-lg 
                         transition-all duration-300 hover:bg-blue-600
                         hover:transform hover:-translate-y-0.5 hover:shadow-lg 
                         mx-2"
              >
                Telegram Bot
              </a>
              <a
                href="https://my.opticom.plus/"
                className="inline-block px-8 py-4 bg-green-800 text-white rounded-lg 
                         transition-all duration-300 hover:bg-green-900
                         hover:transform hover:-translate-y-0.5 hover:shadow-lg
                         mx-2"
              >
                Особистий кабінет
              </a>
            </div>
            <div>
              <a
                href="https://opticom.plus/"
                className="inline-block px-8 py-4 bg-green-800 text-white rounded-lg 
                         transition-all duration-300 hover:bg-green-900
                         hover:transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Наш сайт
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 0.9; transform: scale(1.1); }
          80% { opacity: 1; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NoMoney;