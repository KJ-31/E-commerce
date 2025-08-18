import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ElevenStreetHome from "./11st-Home.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetail from "./productdetail.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 홈 페이지 */}
        <Route path="/" element={<ElevenStreetHome />} />
        {/* 상품 상세 페이지 */}
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
