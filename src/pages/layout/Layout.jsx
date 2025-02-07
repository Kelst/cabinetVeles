import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useLoaderData } from 'react-router-dom';
import Navigation from '../../components/navigation/Navigation';
import Loader from '../../components/loader/Loader';
import NavigationBig from '../../components/navigation/NavigationBig';
import CustomAlert from '../../components/alert/CustomAlert';
import useInfoStore from '../../store/infoStore';
import hand from "../../assets/hand.png";
import IntertwiningLinesAnimation from '../../components/intertwiningLinesAnimation/IntertwiningLinesAnimation';
import useConfigPage from '../../store/configPage';
import HeaderSignboard from '../../components/headerSignboard/HeaderSignboard';
import useStore from '../../store/store';

export default function Layout() {
  const user = useStore(state => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const loaderData = useLoaderData();
  const location = useLocation();
  const setActiveItem = useInfoStore(state => state.setActiveItem);
  const showCursor = useInfoStore(state => state.showCursor);
  const setLoader = useInfoStore(store => store.setLoader);
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    const checkAuthData = () => {
        const authData = localStorage.getItem('authData');
       //console.log('Current auth data:', authData ? JSON.parse(authData) : null);
    };
    
    checkAuthData();
    const interval = setInterval(checkAuthData, 5000);
    
    return () => clearInterval(interval);
}, []);
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      setIsLoading(false);
    }, 700);
  }, []);

  useEffect(() => {
    const routes = {
      "/": "Item1",
      "/payment": "Item2",
      "/info": "Item3",
      "/news": "Item4",
      "/intelekt-shop": "Item5"
    };
    setActiveItem(routes[location.pathname] || "Item1");
  }, [location, showCursor]);

  useEffect(() => {
    const handleScrollButton = () => {
      setShowButton(window.pageYOffset > 100);
    };
    window.addEventListener('scroll', handleScrollButton);
    return () => window.removeEventListener('scroll', handleScrollButton);
  }, []);

  if (!loaderData.isAuth || isLoading) {
    return <Loader />;
  }

  return (
    
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* <video
        autoPlay
        loop
        muted
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source src="./src/assets/hsv4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}

      <Loader />
      <CustomAlert />
      <IntertwiningLinesAnimation />
      <HeaderSignboard user={user} />

      <div className="flex flex-col md:flex-row w-full">
        <nav className="w-full md:w-auto flex-shrink-0">
          <div className="block z-[1000] md:hidden">
            <Navigation />
          </div>
          <div className="hidden md:block">
            <NavigationBig />
          </div>
        </nav>

        <main className="flex-grow px-4 mt-[10px] md:mt-[200px] mx-auto w-full max-w-[90%] sm:max-w-[550px] md:max-w-[900px] lg:max-w-[1019px] xl:max-w-[1100px] 2xl:max-w-[1450px]">
     
          <Outlet />
    
        </main>
      </div>

      {showButton && (
       <button
       onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
       className="fixed bottom-5 right-4 z-50 p-4 transition-opacity hover:opacity-80 text-black"
     >
       <img 
         src={hand} 
         alt="Scroll to top" 
         className="w-12 h-12 animate-bounce filter invert brightness-100"
       />
     </button>
      )}
    </div>
  );
}