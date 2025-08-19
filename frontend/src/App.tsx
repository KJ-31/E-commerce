import { Navigate, Route, Routes } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import ElevenStreetHome from './11st-Home';
import MyPage from './components/MyPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Cart from './components/Cart';
import OrderComplete from './components/OrderComplete';
import SellerMyPage from './seller_mypage/SellerMyPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { isLoggedIn, userType, logout } = useAuth();
  
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // 보호된 경로 체크
  const isProtectedRoute = (path: string) => {
    return path === '/mypage' || path === '/seller/mypage';
  };

  // 로그인 필요 경로 접근 시 처리
  const handleProtectedRouteAccess = (path: string) => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigateTo('/login');
      return false;
    }
    return true;
  };

  // 사용자 타입에 따른 마이페이지 리다이렉트
  const handleMyPageAccess = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigateTo('/login');
      return false;
    }
    
    if (userType === 'seller') {
      navigateTo('/seller/mypage');
      return false;
    }
    
    return true;
  };

  const renderCurrentPage = () => {
    // 쿼리 파라미터 제거하고 경로만 추출
    const pathWithoutQuery = currentPath.split('?')[0];
    
    switch (pathWithoutQuery) {
      case '/':
        return <ElevenStreetHome navigateTo={navigateTo} />;
      case '/mypage':
        if (!handleMyPageAccess()) return null;
        return <MyPage navigateTo={navigateTo} />;
      case '/cart':
        return <Cart navigateTo={navigateTo} />;
      case '/order-complete':
        return <OrderComplete navigateTo={navigateTo} />;
      case '/seller/mypage':
        if (!handleProtectedRouteAccess(currentPath)) return null;
        if (userType !== 'seller') {
          alert('셀러 계정으로 로그인 후 이용 가능합니다.');
          navigateTo('/');
          return null;
        }
        return <SellerMyPage />;
      case '/signup':
        return <SignUp navigateTo={navigateTo} />;
      case '/login':
        return <Login navigateTo={navigateTo} />;
      default:
        navigateTo('/');
        return <ElevenStreetHome navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;