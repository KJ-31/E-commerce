import { Navigate, Route, Routes } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import ElevenStreetHome from './11st-Home';
import MyPage from './components/MyPage';
import SignUp from './components/SignUp';
import SellerSignUp from './components/SellerSignUp';
import Login from './components/Login';
import SellerMyPage from './seller_mypage/SellerMyPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { isAuthenticated, user } = useAuth();
  
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
    return path === '/mypage' || path === '/seller-mypage';
  };

  // 로그인 필요 경로 접근 시 처리
  const handleProtectedRouteAccess = (path: string) => {
    if (!isAuthenticated) {
      alert('로그인 후 이용 가능합니다.');
      navigateTo('/login');
      return false;
    }
    return true;
  };

  // 사용자 타입에 따른 마이페이지 리다이렉트
  const handleMyPageAccess = () => {
    if (!isAuthenticated) {
      alert('로그인 후 이용 가능합니다.');
      navigateTo('/login');
      return false;
    }
    
    if (user?.role === 'seller') {
      navigateTo('/seller-mypage');
      return false;
    }
    
    return true;
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <ElevenStreetHome navigateTo={navigateTo} />;
      case '/mypage':
        if (!handleMyPageAccess()) return null;
        return <MyPage navigateTo={navigateTo} />;
      case '/seller-mypage':
        if (!handleProtectedRouteAccess(currentPath)) return null;
        if (user?.role !== 'seller') {
          alert('셀러 계정으로 로그인 후 이용 가능합니다.');
          navigateTo('/');
          return null;
        }
        return <SellerMyPage />;
      case '/signup':
        return <SignUp navigateTo={navigateTo} />;
      case '/seller-signup':
        return <SellerSignUp 
          onSuccess={() => navigateTo('/login')} 
          onSwitchToLogin={() => navigateTo('/login')} 
        />;
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