import React, { useState, useEffect } from 'react'
import classes from "./Loader.module.css";
import Backdrop from '@mui/material/Backdrop';
import bigW from "../../assets/round-bigw.png"
import useInfoStore from '../../store/infoStore';
import { motion } from 'framer-motion';

const RainDrop = ({ delay }) => {
  return (
    <motion.div
      className="absolute bg-green-400 w-0.5 h-2 rounded-full"
      initial={{ opacity: 0, y: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        y: [0, 300],
        transition: { 
          duration: 1,
          delay,
          repeat: Infinity,
          ease: "linear"
        }
      }}
      style={{
        left: `${Math.random() * 100}%`,
      }}
    />
  );
};

export default function Loader() {
    const openLoader = useInfoStore(state => state.openLoader)
    const [raindrops, setRaindrops] = useState([]);

    useEffect(() => {
        const dropCount = 20;
        const newDrops = [...Array(dropCount)].map((_, i) => ({
            id: i,
            delay: Math.random() * 2
        }));
        setRaindrops(newDrops);
    }, []);

    const loadingVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const letterVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.5
            }
        }
    }

    return (
        <Backdrop
            sx={{ 
                color: '#fff', 
                zIndex: (theme) => theme.zIndex.drawer + 1000,
                backgroundColor: 'rgba(0, 0, 0, 0.8)' // Darker backdrop
            }}
            open={openLoader}
        >
            <div className={classes.container}>
                <div className={`${classes.cloud} relative overflow-visible`}>
                    <img  
                        className='absolute top-[-120px] z-[1000000000000000] left-[60px] w-[60px] h-[60px] mb-1 animate-spin'
                        src={bigW} 
                        alt="Big W"
                        style={{ filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)' }} // Makes the image green
                    />
                    <img  
                        className='absolute top-[-80px] z-[1000000000000000] left-[115px] w-[40px] h-[40px] mb-1 animate-reverse-spin'
                        src={bigW} 
                        alt="Small W"
                        style={{ filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)' }} // Makes the image green
                    />
                    <motion.h2 
                        className='text-white relative z-10'
                        variants={loadingVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {'Loading'.split('').map((letter, index) => (
                            <motion.span key={index} variants={letterVariants}>
                                {letter}
                            </motion.span>
                        ))}
                    </motion.h2>
                    {raindrops.map(drop => (
                        <RainDrop key={drop.id} delay={drop.delay} />
                    ))}
                </div>
            </div>
        </Backdrop>
    )
}