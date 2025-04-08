import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  redirect
} from "react-router-dom";
import Layout from "../pages/layout/Layout";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import ErrorPage from "../pages/errorPage/ErrorPage";
import Payment from "../pages/paid/Payment";
import Info from "../pages/info/Info";
import News from "../pages/news/News";
import useStore from "../store/store";
import ShopFrame from "../components/shopFrame/ShopFrame";
import useConfigPage from "../store/configPage";
import RouterDetector from "../components/networkDetector/NetworkDetector";
import NetworkDiagnostics from "../components/networkDiagnostics/NetworkDiagnostics";
import NetworkInfo from "../components/networkComponent/NetworkInfo";
import NetworkDetector from "../components/networkDetector/NetworkDetector";
import LocalIPFinder from "../components/networkDetector/NetworkDetector";
import NetworkIdentifier from "../components/networkDetector/NetworkDetector";
import NoMoney from "../components/noMoney/NoMoney";

async function rootLoader() {
  try {
    const checkUser = useStore.getState().checkUser;
    const getData = useStore.getState().getData;
    const getConfigCabinet = useConfigPage.getState().getConfigCabinet;
    const getNews = useConfigPage.getState().getNews;
    
    const flag = await checkUser();
    if (!flag.isAuth) {
      return redirect("/login");
    }
    const uid = localStorage.getItem('uid');    
    if (uid) {
      await getData(uid);
      await getConfigCabinet("Veles")
      await getNews("Veles")
    }
    return { isAuth: true };
  } catch (error) {
    console.error("Error in root loader:", error);
    return redirect("/login");
  }
}

async function loginLoader() {
  try {
    const checkUser = useStore.getState().checkUser;
    const flag = await checkUser();
    const getImageUrl = useConfigPage.getState().getImageUrl;
    await getImageUrl("Veles")

     const imageUrl = useConfigPage(state => state.imageUrl);
    if (flag.isAuth) {
      return redirect("/home");
    }
    return null;
  } catch (error) {
    console.error("Error in login loader:", error);
    return null;
  }
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/info",
        element: <Info />,
      },
      {
        path: "/news",
        element: <News />,
      },
      {
        path: "/Veles-shop",
        element: <ShopFrame />,
      },
   
    ],
  },
  {
    path: "/login",
    element: <Login />,
    loader: loginLoader,
  },
  {
    path: "/nomoney/veles/*",  // Використовуємо * для перехоплення всіх підшляхів
    element: <NoMoney />,
  },
 
]);