import { Navigate, Route, Routes } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import ElevenStreetHome from './11st-Home';
import MyPage from './components/MyPage';
import SignUp from './components/SignUp';
import SellerMyPage from './seller_mypage/SellerMyPage'

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <ElevenStreetHome navigateTo={navigateTo} />;
      case '/mypage':
        return <MyPage navigateTo={navigateTo} />;
      case '/signup':
        return <SignUp navigateTo={navigateTo} />;
      case '/seller/mypage':  // 추가된 부분
        return <SellerMyPage />;
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

export default App;