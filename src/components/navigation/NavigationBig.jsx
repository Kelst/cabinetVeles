import React, { useEffect, useState } from 'react'
import clases from "./NavigationBig.module.css";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PaidIcon from '@mui/icons-material/Paid';
import InfoIcon from '@mui/icons-material/Info';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';

import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import minLogo from "../../assets/min-logo.png"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NavLink, useNavigate } from 'react-router-dom';
import useInfoStore from '../../store/infoStore';
import HeaderSignboard from '../headerSignboard/HeaderSignboard';
import ExitDialog from '../dialog/ExitDialog';
import useStore from '../../store/store';
import UserMenu from './UserMenu';
import useConfigPage from '../../store/configPage';

export default function NavigationBig() {
  // const [activeItem,setActiveItem]=useState("Item1")
  const user=useStore(state=>state.user)
  const activeItem=useInfoStore(state=>state.activeItem)
  const setActiveItem=useInfoStore(state=>state.setActiveItem)
  const configCabinet = useConfigPage(state => state.configCabinet);

  const [openExit, setOpenExit] = React.useState(false);

  const imageUrl = useConfigPage(state => state.imageUrl);


  const handleSwitchLogin=()=>{
  }
  const navigate=useNavigate()

  const logOut=useStore(state=>state.logOut)

  const handleLogOuth = async ()=>{
    try {
        await logOut()
      
        navigate("/login")

    }
    catch (e){
          console.log('помилка виходу з акаунта');
    }

}
const handleClickOpen = () => {
  setOpenExit(true);
};
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseExit = () => {
    setOpenExit(false);
  };
  const handleSetActive=(item)=>{
    console.log(item);
setActiveItem(item)
  }
  return (
    <div className="">
    <HeaderSignboard user={user} clases={clases} />
    <div className={'transition-all duration-500 bg-[#060606] -translate-y-80 md:translate-y-[0px] relative -z-10 ' + ' ' + clases.navigation}>
      <div 
        className="absolute -left-6  w-[210px] h-[200px] z-50 cursor-pointer overflow-hidden"
        onClick={() => navigate('/home')}
      >
        <motion.div 
         whileFocus={{ scale: 1.02 }}
         whileTap={{ scale: 0.98 }}
        className="relative w-full h-full flex items-center justify-center">
          <img 
            src={configCabinet.logo_min_navigation}
            alt="Logo"
            className="w-[70%] h-auto object-contain" 
          />
        </motion.div>
      </div>
      {/*    <div className=' absolute font-bold  hidden 2xl:block  top-[90px] transition-all duration-500  left-0 uppercase text-white text-[10px]  2xl:top-[21px] 2xl:left-60 2xl:text-black '> 
       <span className={clases.spanText}> Особистий кабінет   </span>  </div> */}
      <ul>
      
        <li className={clases.list +' '+ `${activeItem=='Item1'? clases.active:''}`}
        onClick={()=>handleSetActive('Item1')}
        >
        <NavLink to={"/"}>
            <span className={clases.icon}><PermIdentityIcon fontSize='medium' /></span>
            <span className={clases.text}>Загальне</span>
        </NavLink>
        </li>
        <li className={clases.list +' '+ `${activeItem=='Item2'? clases.active:''}`}
         onClick={()=>handleSetActive('Item2')}
        >
            <NavLink to={"/payment"}>
            <span className={clases.icon}><PaidIcon fontSize='medium' /></span>
            <span className={clases.text}>Оплати</span>
            </NavLink>

        </li>
        <li className={clases.list +' '+ `${activeItem=='Item3'? clases.active:''}`}
         onClick={()=>handleSetActive('Item3')}
        >
             <NavLink to={"/info"}>
            <span className={clases.icon}><InfoIcon fontSize='medium' /></span>
            <span className={clases.text}>Додатково</span>
            </NavLink>
        </li>
        <li className={clases.list +' '+ `${activeItem=='Item4'? clases.active:''}`}
         onClick={()=>handleSetActive('Item4')}
        >
          
         <NavLink to={"/news"}>
            <span className={clases.icon}><NewspaperIcon fontSize='medium'  /></span>
            <span className={clases.text}>Новини </span>
          </NavLink>
        </li>
        <li className={clases.list +' '+ `${activeItem=='Item5'? clases.active:''}`}
         onClick={()=>handleSetActive('Item5')}
        >
          
         {configCabinet.additional.showStore?  <NavLink to={"/intelekt-shop"}>
            <span className={clases.icon}><ShoppingBasketIcon fontSize='medium'  /></span>
            <span className={clases.text}>Магазин </span>
          </NavLink> :<></>}
        </li>


       

        <li className={clases.list +' '+ clases.logout }>
            
          <a href="#">
            <span className={clases.icon} onClick={handleClickOpen} ><LogoutIcon  className=' hover:text-white' fontSize='medium' /></span>
            <span className={clases.text}>Вийти</span>
          </a>
        </li>
        {
          activeItem!='Item1'? <div className=' font-mono absolute font-bold top-[95px] right-[0px]  text-center transition-all duration-500 sm:hidden md:block  uppercase text-white 2xl:n 2xl:top-4  2xl:right-[60px] 2xl:text-black'>
        <UserMenu user={user}/>
          </div>
          :""
        }
       
        <div className={clases.indicator}></div>
        
      </ul>
        
    </div>
    <ExitDialog open={openExit} handleClose={handleCloseExit} handleLogOuth={handleLogOuth}/>

    </div>
  )
}