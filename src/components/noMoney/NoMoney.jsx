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
    <div className="min-h-screen bg-white p-5">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg">
        <div className="text-center">
          <div className="flex justify-center items-center mb-8">
            <img 
              src={Logo} 
              className="w-96 h-64 object-contain" 
              alt="Logo" 
            />
          </div>

          <div className="text-gray-800 text-xl">
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

          <div className="mt-8">
            <a
              href="https://my.opticom.plus/"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg 
                       transition-all duration-300 hover:bg-blue-700
                       transform hover:-translate-y-1 hover:shadow-xl"
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