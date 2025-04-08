import React, { useEffect, useState } from 'react';
import { Cable, Wrench, Radio, ShoppingCart } from 'lucide-react';
import useStore from '../../store/store';
import { motion } from 'framer-motion';

const getIcon = (type) => {
  switch(type) {
    case 'Підключення': return <Cable className="w-6 h-6 md:w-8 md:h-8 text-[#77cdec]" />; // sky sky
    case 'Ремонт': return <Wrench className="w-6 h-6 md:w-8 md:h-8 text-[#77cdec]" />; // sky sky
    case 'Додаткові послуги': return <Radio className="w-6 h-6 md:w-8 md:h-8 text-[#77cdec]" />; // sky sky
    case 'Магазин': return <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-[#77cdec]" />; // sky sky
    default: return null;
  }
};

const getStatusText = (status) => {
  switch(status) {
    case 0: return 'Замовлення отримано магазином';
    case 1: return 'Замовлення опрацьоване';
    case 2: return 'Замовлення завершено';
    default: return 'Невідомий статус';
  }
};

const getStatusColor = (status) => {
  switch(status) {
    case 0: return 'text-[#90EE90]'; // Lighter sky sky
    case 1: return 'text-[#77cdec]'; // sky sky
    case 2: return 'text-[#92c7f5]'; // Matte sky-800
    default: return 'text-gray-500';
  }
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-sky-800 rounded-xl border-2 border-dashed border-[#77cdec] mt-4"> {/* Changed border color */}
    <div className="bg-[#92c7f5] p-4 rounded-full mb-4">
      <Wrench className="w-12 h-12 text-[#77cdec]" /> {/* Changed to sky sky */}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">
      Заявок немає
    </h3>
  </div>
);

const LoadingSpinner = () => {
  const dotVariants = {
    animate: {
      scale: [1, 1.5, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="flex gap-3">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-[#77cdec] rounded-full" // Changed to sky sky
            variants={dotVariants}
            animate="animate"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

const MyTaskViewer = () => {
  const getTaskUser = useStore(state => state.getTaskUser);
  const uid = useStore(state => state.user.uid);
  const [tasks, setTask] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const taskData = await getTaskUser(uid);
        setTask(taskData.taskUser || []);
      } catch (error) {
        console.error('Error fetching taskData:', error);
        setError('Виникла помилка при завантаженні заявок. Спробуйте оновити сторінку.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [getTaskUser, uid]);

  const [selectedType, setSelectedType] = useState('Всі');
  const types = ['Всі', ...new Set(tasks.map(task => task.type))];

  const filteredTasks = selectedType === 'Всі' 
    ? tasks 
    : tasks.filter(task => task.type === selectedType);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-gray-400">
          <LoadingSpinner/>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-sky-800 border border-[#77cdec] rounded-lg p-4 text-[#77cdec]"> {/* Changed colors */}
          {error}
        </div>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="container mx-auto p-2 sm:p-4">
        <EmptyState />
      </div>
    );
  }

  const renderTaskContent = (task) => {
    if (task.type === 'Магазин') {
      return (
        <>
          <p className={`text-sm sm:text-lg ${getStatusColor(task.status)} font-medium mb-1 sm:mb-2`}>
            {getStatusText(task.status)}
          </p>
          {task.cartJson && (
            <div className="mt-2 p-2 bg-[#92c7f5] rounded-lg">
              <p className="text-sm text-gray-300">
                Замовлення: {task.cartJson}
              </p>
            </div>
          )}
        </>
      );
    } else {
      return (
        <>
          <p className={`text-sm sm:text-lg ${task.avaible ? 'text-[#92c7f5]' : 'text-[#77cdec]'} font-medium mb-1 sm:mb-2`}> {/* Changed colors */}
            {task.avaible ? 'Виконано' : 'Не виконано'}
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mb-1">
            Дата створення: {task.startDate}
          </p>
          {task.avaible && task.endDate && (
            <p className="text-xs sm:text-sm text-gray-400">
              Дата закриття: {task.endDate}
            </p>
          )}
          {task.duration && (
            <p className="text-xs sm:text-sm text-gray-400">
              Тривалість: {task.duration}
            </p>
          )}
        </>
      );
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-white">Типи заявок:</h2>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full ${
                selectedType === type
                  ? 'bg-[#77cdec] text-sky-800' // Changed to sky sky
                  : 'bg-[#92c7f5] text-gray-300 hover:bg-gray-700'
              } transition-colors duration-200`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        {filteredTasks.map((task) => (
          <div 
            key={task.id} 
            className="
              bg-sky-800 rounded-lg sm:rounded-xl shadow p-3 sm:p-6 
              transform transition duration-300 hover:scale-105 
              hover:shadow-lg border border-[#77cdec]/30 hover:border-[#77cdec]
            "
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <span className="text-lg sm:text-2xl font-bold text-[#77cdec]">#{task.id}</span> {/* Changed to sky sky */}
              <div className="text-gray-400">
                {getIcon(task.type)}
              </div>
            </div>
            <h2 className="text-base sm:text-xl font-semibold text-white uppercase mb-1 sm:mb-2">
              {task.type}
            </h2>
            {renderTaskContent(task)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTaskViewer;