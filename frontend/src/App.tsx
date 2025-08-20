import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ElevenStreetHome from './11st-Home';
import MyPage from './components/MyPage';
import SignUp from './components/SignUp';
import SellerSignUp from './components/SellerSignUp';
import Login from './components/Login';
import Cart from './components/Cart';
import OrderComplete from './components/OrderComplete';
import TossPayment from './components/TossPayment';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFail from './components/PaymentFail';
import SellerMyPage from './seller_mypage/SellerMyPage';
import ProductDetail from './components/ProductDetail';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { isLoggedIn, userType } = useAuth();
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ElevenStreetHome navigateTo={navigateTo} />} />
        <Route path="/cart" element={<Cart navigateTo={navigateTo} />} />
        <Route path="/order-complete" element={<OrderComplete navigateTo={navigateTo} />} />
        <Route path="/toss-payment" element={<TossPayment navigateTo={navigateTo} />} />
        <Route path="/payment-success" element={<PaymentSuccess navigateTo={navigateTo} />} />
        <Route path="/payment-fail" element={<PaymentFail navigateTo={navigateTo} />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/mypage" element={
          isLoggedIn ? <MyPage navigateTo={navigateTo} /> : <Login navigateTo={navigateTo} />
        } />
        <Route path="/seller/mypage" element={
          isLoggedIn && userType === 'seller' ? <SellerMyPage /> : <Login navigateTo={navigateTo} />
        } />
        <Route path="/signup" element={<SignUp navigateTo={navigateTo} />} />
        <Route path="/seller-signup" element={<SellerSignUp navigateTo={navigateTo} />} />
        <Route path="/login" element={<Login navigateTo={navigateTo} />} />
        <Route path="*" element={<ElevenStreetHome navigateTo={navigateTo} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
