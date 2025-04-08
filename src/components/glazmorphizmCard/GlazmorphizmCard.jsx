import React from 'react';
import rocket from "../../assets/rocket.png";
import clases from "./GlasmorphizmCard.module.css";
import { Wifi, Tv, AlertCircle, ArrowRight } from 'lucide-react';
import useStore from '../../store/store';
import useInfoStore from '../../store/infoStore';
import { useEffect } from 'react';

function extractInfo(obj) {
    const { month_fee, name } = obj;
    const [, spead, fee] = name.match(/-(\d+)\((\d+)\)_/) || [];
    return {
        fee: parseInt(fee) || 0,
        spead: parseInt(spead) || 0,
        hasTV: name?.includes('+TV') || false
    };
}

function TariffDescription({ tariffInfo }) {
    if (!tariffInfo) return null;
    
    const { spead, hasTV } = tariffInfo;

    return (
        <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5">
                <Wifi size={16} className="text-yellow-300" />
                <span className="font-medium text-yellow-300">
                    {spead >= 1000 ? 'Гігабітна швидкість' :
                     spead >= 500 ? 'Висока швидкість' :
                     'Оптимальна швидкість'}
                </span>
            </div>
            
            {spead >= 100 && (
                <div className="flex gap-1.5">
                    <AlertCircle size={16} className="min-w-[16px] mt-0.5 text-orange-300" />
                    <div className="text-orange-300">
                        <div>Для максимальної швидкості:</div>
                        <div className="ml-2 mt-0.5">
                            • Гігабітний роутер
                        </div>
                        <div className="ml-2">
                            • Кабель 8 жил
                        </div>
                    </div>
                </div>
            )}
            
            {hasTV && (
                <div className="flex items-center gap-1.5">
                    <Tv size={16} className="text-sky-300" />
                    <span className="text-sky-300">TV-пакет включено</span>
                </div>
            )}
            
            <div className="flex gap-1.5">
                <ArrowRight size={16} className="min-w-[16px] mt-0.5 text-gray-300" />
                <span className="text-gray-300">
                    {spead >= 1000 ? 'Для геймінгу та стрімінгу' :
                     spead >= 500 ? 'Для всієї родини та роботи' :
                     'Для комфортного користування'}
                </span>
            </div>
        </div>
    );
}

export default function GlazmorphizmCard({ tarriffList = [], tariff, handleClose }) {
    if (!Array.isArray(tarriffList)) {
        console.error('tarriffList must be an array');
        return null;
    }

    const sortedTariffList = [...(tarriffList.filter(e => e.name === tariff) || []), ...(tarriffList.filter(e => e.name !== tariff) || [])];
    const uid = useStore(state => state.user?.uid);
    const internetId = useStore(state => state.user?.internetId);
    const changeTariffPlan = useStore(state => state.changeTariffPlan);
    const setLoader = useInfoStore(store => store.setLoader);
    const showAllert = useInfoStore(state => state.showAllert);

    const handleChangeTariffPlan = async (tp_id) => {
        if (!tp_id || !uid || !internetId) {
            showAllert(0, 'Відсутні необхідні дані для зміни тарифу');
            return;
        }

        let result = { success: false, message: 'Помилка зміни тарифу' };
        
        try {
            setLoader(true);
            result = await changeTariffPlan(uid, internetId, tp_id);
        } catch (error) {
            console.error('Error changing tariff:', error);
            result = { 
                success: false, 
                message: error?.message || 'Помилка при зміні тарифного плану' 
            };
        } finally {
            setLoader(false);
            showAllert(result.success ? 2 : 0, result.message);
            handleClose?.();
        }
    };

    return (
        <div className='flex justify-center items-center min-h-[100%]  bg-fixed rounded-md'>
            <div className={clases.container}>
                {sortedTariffList.map((e, i) => {
                    const tariffInfo = extractInfo(e);
                    return (
                        <div 
                            className={e.name === tariff ? `${clases.card} ${clases.actives}` : clases.card} 
                            key={`tariff-${e.tp_id || i}`}
                        >
                            <div className={clases.imgBx}>
                                <img src={rocket} alt="Тариф" />
                                <div className={clases.output}>
                                    <span className={clases.data}>{tariffInfo.spead} мБіт/сек</span>
                                    <span className={clases.price}>{tariffInfo.fee} грн/міс</span>
                                </div>
                            </div>
                            <div className={clases.content}>
                                <div>
                                    <h3 className="mb-2">{e.name}</h3>
                                    <TariffDescription tariffInfo={tariffInfo} />
                                    {e.name === tariff ? (
                                        <button 
                                            type="button" 
                                            className="mt-3 text-white bg-gradient-to-r tracking-widest from-red-400 via-red-500 to-yellow-200 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-xs px-5 py-2 text-center me-2 mb-2"
                                        >
                                            Ваш тарифний план
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleChangeTariffPlan(e.tp_id)}
                                            className="mt-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden hover:text-white text-xs font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-400 via-red-500 to-yellow-200 group-hover:text-white group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-white focus:ring-4 focus:outline-none focus:color-white focus:ring-red-100 dark:focus:ring-red-400"
                                        >
                                            <span className="tracking-widest relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                                Підключити
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}