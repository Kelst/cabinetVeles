import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import style from  "./Home.module.css"
import MacCreditDialog from '../../components/dialog/MacCreditDialog';
import useInfoStore from '../../store/infoStore';
import AddService from '../../components/dialog/AddService';
import StopPlayDialog from '../../components/dialog/StopPlayDialog';
import {  extractInfoFromString } from '../../tools/tools';
import EditPhone from '../../components/dialog/EditPhone';
import TariffDialog from '../../components/dialog/TariffDialog';
import { NavLink } from 'react-router-dom';
import {  useSpring } from "react-spring";
import ControllPanelDialog from '../../components/dialog/ControllPanelDialog';
import CountdownTimer from '../../components/сountdownTimer/CountdownTimer';
import InternetInfo from '../../components/internetInfo/InternetInfo';
import PaymentInfo from '../../components/internetInfo/PaymentInfo';
import MainInfo from '../../components/internetInfo/MainInfo';
import LoginManagement from '../../components/internetInfo/LoginManagement';
import UserHeader from '../../components/internetInfo/UserHeader';
import ReloadSesion from '../../components/dialog/ReloadSesion';
import ContactInfoButton from '../../components/сontactInfoButton/ContactInfoButton';
import ClearCID from '../../components/dialog/ClearCID';
import StaticIpDialog from '../../components/dialog/StaticIpDialog';
import EditPassword from '../../components/dialog/EditPassword';
import useConfigPage from '../../store/configPage';
import BalancePopup from '../../components/balancePopup/BalancePopup';
import useStore from '../../store/store';
import UnlinkPhoneModal from '../../components/unlinckPhone/UnlinkPhoneModal';
import ExitDialog from '../../components/dialog/ExitDialog';
import { Feedback } from '@mui/icons-material';
import FeedbackModal from '../../components/callBack/FeedbackModal';
import UserMenu from '../../components/navigation/UserMenu';
import UserMenuHome from '../../components/navigation/UserMenuHome';
import HomeTour from '../../components/tutorial/HomeTour';
export default function Home() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
const [openControllPanelDialog,setControllPanelDialog]=useState(false)
const [openDialogCredit,setOpenDialogCredit]=useState(false)
const [showPopup,setShowPopup]=useState(false)
const [openDialogStatic,setOpenDialogStatic]=useState(false)
const [openDialogService,setOpenDialogService]=useState(false)
const [openDialogStopPlay,setOpenDialogStopPlay]=useState(false)
const [openDialogReloadSession,setOpenDialogReloadSession]=useState(false)
const [openCid,setOpenCid]=useState(false)
const configCabinet = useConfigPage(state => state.configCabinet);
const hasAnyTrueValue = configCabinet.home.clearMac || 
configCabinet.home.setCredit || 
configCabinet.home.additionalService || 
configCabinet.home.staticIp || 
configCabinet.home.tariffPlans||configCabinet.home.unlinkLogin;
const [openDialogEditPhone,setOpenDialogEditPhone]=useState(false)
const [openDialogEditPassword,setOpenDialogEditPassword]=useState(false)

const [openDialogTariff,setOpenDialogTariff]=useState(false)
useSpring({ opacity: 1, from: { opacity: 0 }, delay: Math.random() * 450 });

const setLoader=useInfoStore(state=>state.setLoader) 
const showAllert=useInfoStore(state=>state.showAllert) 
const [exitDialogOpen, setExitDialogOpen] = useState(false);
const logOut = useStore(state => state.logOut);
const navigate = useNavigate(); 
const handleLogOut = async () => {
  try {
    await logOut();
    navigate("/login");
  } catch (e) {
   //console.log('Помилка виходу з акаунта');
  }
};
function handleExitDialogOpen() {
  setExitDialogOpen(true)
}
function handleStopPlayLogin(){
  setOpenDialogStopPlay(true)
}
function handleReloadSession(){
  setOpenDialogReloadSession(true)
}
function handleEditPhone(){
  setOpenDialogEditPhone(true)
}
function handleEditPassword(){
  setOpenDialogEditPassword(true)
}
function handleClearMac(){
   showAllert(2,"Mac очищено")
}
function handleSetCredit(){
  setOpenDialogCredit(true)
}
function handleAddService(){
setOpenDialogService(true)
}
function handleStaticIp(){

}

function handleDisplayTariff(){
  setOpenDialogTariff(true)
}
function handleUnlick() {
  setOpenUnlink(true)
}
function handleOpenStaticIp(){
  setOpenDialogStatic(true)
}

function handleCid(){
  setOpenCid(true)
}

const user = useStore(state => state.userData);


//
const [openUnlink, setOpenUnlink] = useState(false);

  return (
      <section  >
        

<BalancePopup 
  balance={user?.balance}
  onClose={() => setShowPopup(false)}
  onNavigateToPayments={() => navigate('/payments')}
  showPopup={showPopup}
/>
    <div className=' hidden lg:block relative z-10'>
    <div className=" text-white  flex items-center justify-center rounded-lg">
      <div className="container mx-auto p-8 bg-white   opacity-95 text-sky-800 rounded-md shadow-md">
      <UserHeader 
        open={open}
        handleClick={handleClick}
        handleClose={handleClose}
        showPopup={showPopup}
      />

        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>

        <MainInfo 
        id="main-info"
    // user={user}
    style={style}
    handleEditPhone={handleEditPhone}
    handleEditPassword={handleEditPassword}
    handleStopPlayLogin={handleStopPlayLogin}
    handleReloadSession={handleReloadSession}
    handleCid={handleCid}
  />
          <PaymentInfo 
          id="payment-info"
    // user={user}
    style={style}
  />

        
  <InternetInfo 
  id="internet-info" 
    // user={user} 
    extractInfoFromString={extractInfoFromString} 
    style={style}
  />
  
        </div>
        

   {   
hasAnyTrueValue?
   <LoginManagement 
   id="login-management"
    style={style}
    setControllPanelDialog={setControllPanelDialog}
    handleClearMac={handleCid}
    handleSetCredit={handleSetCredit}
    handleAddService={handleAddService}
    handleDisplayTariff={handleDisplayTariff}
    handleOpenStaticIp={handleOpenStaticIp}
    handleUnlick={handleUnlick}
    handleExitDialogOpen={handleExitDialogOpen}

  />:<></>}
      </div>
    </div>
     

    </div>

    <div className='lg:hidden'>
    {/* <UserMenu  user={user} centered/> */}
    <UserMenuHome/>
   
       
        <div className="flex flex-col gap-y-6 items-center justify-center sm:p-4">
         
          <MainInfo 
            // user={user}
            style={style}
            handleEditPhone={handleEditPhone}
            handleEditPassword={handleEditPassword}
            handleStopPlayLogin={handleStopPlayLogin}
            handleReloadSession={handleReloadSession}
            handleCid={handleCid}

          />

          <PaymentInfo 
            // user={user}
            style={style}
          >
            <NavLink to="/payment" className="mt-4 block w-full">
              <div className={`${style.animationBorderSM} cursor-pointer relative inline-flex items-center justify-center p-4 px-2 py-1 overflow-hidden font-medium transition duration-300 ease-out border-2 rounded-full group w-full`}>
                <span className="absolute inset-0 flex items-center justify-center w-full h-full duration-300 -translate-x-full group-hover:translate-x-0 ease">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
                <span className="absolute flex items-center justify-center w-full h-full tracking-widest text-sm text-white transition-all duration-300 transform group-hover:translate-x-full ease">оплатити</span>
                <span className="relative invisible">Button Text</span>
              </div>
            </NavLink>
            <div className="mt-4">
              <CountdownTimer />
            </div>
          </PaymentInfo>

          <InternetInfo 
            // user={user} 
            extractInfoFromString={extractInfoFromString} 
            style={style}
          />
          {
            hasAnyTrueValue?
          <LoginManagement 
            style={style}
            setControllPanelDialog={setControllPanelDialog}
            handleClearMac={handleClearMac}
            handleSetCredit={handleSetCredit}
            handleAddService={handleAddService}
            handleDisplayTariff={handleDisplayTariff}
            handleOpenStaticIp={handleOpenStaticIp}
            handleUnlick={handleUnlick}
            handleExitDialogOpen={handleExitDialogOpen}
          />:<></>}
      
        </div>
      </div>

     <ControllPanelDialog open={openControllPanelDialog} handleAction={showAllert} handleClose={()=>{setControllPanelDialog(false)}}   />
     <MacCreditDialog open={openDialogCredit} handleAction={showAllert} handleClose={()=>{setOpenDialogCredit(false)}}   />
     <StaticIpDialog open={openDialogStatic} handleAction={showAllert} handleClose={()=>{setOpenDialogStatic(false)}}   />
     <AddService open={openDialogService} handleClose={()=>setOpenDialogService(false)}/>
     {/* <StopPlayDialog open={openDialogStopPlay}   handleClose={()=>{setOpenDialogStopPlay(false)}} /> */}
     <ClearCID  open={openCid}  handleClose={()=>{setOpenCid(false)}}/>
     <ReloadSesion open={openDialogReloadSession}   handleClose={()=>{setOpenDialogReloadSession(false)}} />
     <EditPhone open={openDialogEditPhone} handleClose={()=>{setOpenDialogEditPhone(false)}}/>
     <EditPassword open={openDialogEditPassword} handleClose={()=>{setOpenDialogEditPassword(false)}}/>
     <TariffDialog open={openDialogTariff}  handleClose={()=>{setOpenDialogTariff(false)}} />
     <UnlinkPhoneModal open={openUnlink} onClose={()=>setOpenUnlink(false)} />
     <ExitDialog 
        open={exitDialogOpen}
        handleClose={() => setExitDialogOpen(false)}
        handleLogOuth={handleLogOut}
      />
      

      </section>

  
  )
}
