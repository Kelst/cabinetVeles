import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo-01.png';

const NoMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (location.pathname !== '/nomoney/veles') {
      navigate('/nomoney/veles', { replace: true });
    }
    setIsVisible(true);
  }, [location, navigate]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="max-w-4xl w-full px-4">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <img 
              src={Logo} 
              className="w-40 h-48 object-contain" 
              alt="Logo" 
            />
          </div>

          <div className="text-center max-w-2xl">
            <h2 className="text-3xl font-light mb-6 text-gray-900">
              Шановний абонент!
            </h2>
            <div className="space-y-4 text-lg text-gray-600 font-light">
              <p>
                Ми зафіксували недостатньо коштів на вашому рахунку...
              </p>
              <p>
                Для продовження використання послуги поповніть рахунок будь-яким зручним способом.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <a
              href="https://my.opticom.plus/"
              className="inline-block px-12 py-5 bg-blue-500 
                       text-white text-lg font-light rounded-full
                       transition-all duration-300 hover:bg-blue-600
                       hover:shadow-2xl hover:scale-105 transform"
            >
              Особистий кабінет
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoMoney;