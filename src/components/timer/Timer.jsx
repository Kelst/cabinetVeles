import React, { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import useStore from '../../store/store';

  //  setShowAllert({...showAllert,message:errorMessage,open:true,type:0})
export default function Timer({ expiryTimestamp ,showAllert,setShowAllert,setPhoneFromSMS}) {

  const setCheckedPhone= useStore(store=>store.setCheckedPhone)
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

  // isCheckedPhone
  useEffect(()=>{
if(!isRunning){
  setPhoneFromSMS(false)
  setShowAllert({...showAllert,message:'Час життя коду минув, введіть номер телефону повторно  ',open:true,type:0})
}
  },[seconds])
  return (
   
    <div style={{textAlign: 'center',marginTop:"15px"}}>
      <div className=' text-xl font-bold flex items-center justify-center'>
     <span className=' block w-[50px] bg-red-500 p-1 text-white  rounded-md'>{minutes<10?`0${minutes}`:minutes}</span>:<span className='w-[50px] block bg-red-500 p-1 text-white rounded-md'>{seconds<10?`0${seconds}`:seconds}</span>
      </div>
    </div>
  );
}

