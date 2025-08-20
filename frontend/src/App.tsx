import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import React from 'react';
import ElevenStreetHome from './11st-Home';
import MyPage from './components/MyPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Cart from './components/Cart';
import OrderComplete from './components/OrderComplete';
import TossPayment from './components/TossPayment';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFail from './components/PaymentFail';
import SellerMyPage from './seller_mypage/SellerMyPage';
import ProductDetail from './components/ProductDetail'; // ProductDetail 컴포넌트 임포트
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { isLoggedIn, userType } = useAuth();
  const navigate = useNavigate(); // useNavigate 훅 사용

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
      case '/toss-payment':
        return <TossPayment navigateTo={navigateTo} />;
      case '/payment-success':
        return <PaymentSuccess navigateTo={navigateTo} />;
      case '/payment-fail':
        return <PaymentFail navigateTo={navigateTo} />;
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
