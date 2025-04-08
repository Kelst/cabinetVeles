import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/900.css";
import "@fontsource/domine/400.css";
import "@fontsource/domine/600.css";
import "@fontsource/dancing-script/600.css";
import "@fontsource/montserrat/200.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/200-italic.css";
import "@fontsource/nosifer/400.css";
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(

  
    <React.StrictMode>
    <RouterProvider router={router}/>
    
    </React.StrictMode>
   

    


)
