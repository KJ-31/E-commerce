import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css";
import App from "./App";
import ElevenStreetHome from "./11st-Home.tsx";
import ElevenStreetLogin from './login/11st-Login.tsx' 

const router = createBrowserRouter([
  { path: '/', element: <ElevenStreetHome /> },
  { path: '/login', element: <ElevenStreetLogin /> },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
