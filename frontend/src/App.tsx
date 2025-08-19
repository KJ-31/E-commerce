import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import React from 'react';
import ElevenStreetHome from './11st-Home';
import MyPage from './components/MyPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import SellerMyPage from './seller_mypage/SellerMyPage';
import ProductDetail from './components/ProductDetail'; // ProductDetail 컴포넌트 임포트
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { isLoggedIn, userType } = useAuth();
  const navigate = useNavigate(); // useNavigate 훅 사용

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ElevenStreetHome navigateTo={navigateTo} />} />
        <Route path="/product/:id" element={<ProductDetail />} /> {/* 상품 상세 페이지 라우트 추가 */}
        <Route path="/mypage" element={isLoggedIn ? <MyPage navigateTo={navigateTo} /> : <Login navigateTo={navigateTo} />} />
        <Route path="/seller/mypage" element={isLoggedIn && userType === 'seller' ? <SellerMyPage /> : <Login navigateTo={navigateTo} />} />
        <Route path="/signup" element={<SignUp navigateTo={navigateTo} />} />
        <Route path="/login" element={<Login navigateTo={navigateTo} />} />
        <Route path="*" element={<ElevenStreetHome navigateTo={navigateTo} />} /> {/* 존재하지 않는 경로 처리 */}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
