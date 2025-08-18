import React, { useState, useEffect } from 'react';
import ElevenStreetHome from './11st-Home';
import MyPage from './components/MyPage';
import SignUp from './components/SignUp';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // URL 변경 감지
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 페이지 이동 함수
  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // 현재 경로에 따른 컴포넌트 렌더링
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <ElevenStreetHome navigateTo={navigateTo} />;
      case '/mypage':
        return <MyPage navigateTo={navigateTo} />;
      case '/signup':
        return <SignUp navigateTo={navigateTo} />;
      default:
        // 알 수 없는 경로는 메인 페이지로 리다이렉트
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