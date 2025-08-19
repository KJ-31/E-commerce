import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { tossPaymentService } from '../services/tossPaymentService';
import { orderService } from '../services/orderService';

interface PaymentSuccessProps {
  navigateTo: (path: string) => void;
}

interface PaymentResult {
  paymentKey: string;
  orderId: string;
  amount: number;
  approvedAt: string;
  method: string;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ navigateTo }) => {
  const { isLoggedIn, userInfo, restoreSession } = useAuth();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // 중복 실행 방지
  const hasProcessed = useRef(false); // useRef로 중복 실행 방지

  useEffect(() => {
    // 토스페이먼츠 결제 후 리다이렉트로 인해 세션이 끊어질 수 있으므로
    // 로그인 상태를 다시 확인하고, 결제 처리를 진행
    // React Strict Mode 대응을 위한 중복 실행 방지
    const paymentKey = new URLSearchParams(window.location.search).get('paymentKey');
    if (paymentKey && !hasProcessed.current) {
      hasProcessed.current = true;
      
      // 결제 전에 저장된 로그인 정보 복구 시도
      if (!isLoggedIn) {
        restoreSession();
        console.log('PaymentSuccess에서 세션 복구 시도 완료');
      }
      
      handlePaymentSuccess();
    }
  }, []); // 의존성 배열에서 navigateTo 제거

  const handlePaymentSuccess = async () => {
    // 중복 실행 방지 (useRef 사용)
    if (hasProcessed.current && isProcessing) {
      console.log('이미 처리 중입니다.');
      return;
    }

    try {
      setIsProcessing(true);
      
      // URL에서 결제 결과 파라미터 추출
      const urlParams = new URLSearchParams(window.location.search);
      const paymentKey = urlParams.get('paymentKey');
      const orderId = urlParams.get('orderId');
      const amount = urlParams.get('amount');

      if (!paymentKey || !orderId || !amount) {
        throw new Error('결제 정보가 누락되었습니다.');
      }

      console.log('결제 승인 요청:', { paymentKey, orderId, amount });

      // 토스페이먼츠 결제 승인
      const confirmResult = await tossPaymentService.confirmPayment(
        paymentKey,
        orderId,
        parseInt(amount)
      );

      console.log('결제 승인 결과:', confirmResult);

      if (confirmResult.success) {
        // 세션에서 결제 데이터 가져오기
        const pendingPaymentData = sessionStorage.getItem('pendingPayment');
        if (pendingPaymentData) {
          const paymentData = JSON.parse(pendingPaymentData);
          
          // 로그인 상태 확인 - 토스페이먼츠 리다이렉트로 인해 세션이 끊어질 수 있음
          // 저장된 사용자 정보를 우선 사용
          const currentUserInfo = userInfo || paymentData.userInfo;
          
          if (!currentUserInfo) {
            console.log('사용자 정보가 없으므로 주문 생성은 건너뜁니다.');
            // 결제는 성공했지만 주문 생성은 하지 않음
          } else {
            // 주문 생성
            const orderData = {
              userId: currentUserInfo.user_id,
              items: paymentData.items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
              totalPrice: parseInt(amount),
            };

            console.log('주문 생성 시작:', orderData);
            const orderResult = await orderService.createOrder(orderData);
            console.log('주문 생성 완료:', orderResult);
          }
          
          // 세션 데이터 정리
          sessionStorage.removeItem('pendingPayment');
        }

        setPaymentResult({
          paymentKey,
          orderId,
          amount: parseInt(amount),
          approvedAt: confirmResult.data?.approvedAt || new Date().toISOString(),
          method: confirmResult.data?.method || '카드',
        });
      } else {
        throw new Error(confirmResult.message || '결제 승인에 실패했습니다.');
      }
    } catch (error) {
      console.error('결제 성공 처리 오류:', error);
      setError(error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  // 로그인하지 않은 상태에서는 결제 성공 정보만 표시하고 주문 내역 보기 버튼은 숨김
  const showOrderHistoryButton = isLoggedIn;
  
  // 저장된 사용자 정보 가져오기
  const [savedUserInfo, setSavedUserInfo] = useState<any>(null);
  
  useEffect(() => {
    const savedInfo = sessionStorage.getItem('userInfo');
    if (savedInfo) {
      try {
        setSavedUserInfo(JSON.parse(savedInfo));
      } catch (error) {
        console.error('저장된 사용자 정보 파싱 오류:', error);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">결제 처리 중...</h2>
          <p className="text-gray-600">결제 승인을 확인하고 있습니다.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 처리 실패</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigateTo('/cart')}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              장바구니로 돌아가기
            </button>
            <button
              onClick={() => navigateTo('/')}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigateTo('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">결제 완료</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 결제 완료 메시지 */}
        <div className="bg-white rounded-lg shadow p-8 text-center mb-8">
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h2>
          <p className="text-gray-600 mb-6">토스페이먼츠로 안전하게 결제가 처리되었습니다.</p>
          
          {/* 사용자 정보 표시 */}
          {savedUserInfo && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>{savedUserInfo.user_name}</strong>님의 결제가 완료되었습니다.
              </p>
            </div>
          )}
          
          {paymentResult && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">주문번호</span>
                  <span className="font-semibold text-gray-900">{paymentResult.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제금액</span>
                  <span className="font-semibold text-gray-900">{paymentResult.amount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제수단</span>
                  <span className="font-semibold text-gray-900">{paymentResult.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제일시</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(paymentResult.approvedAt).toLocaleString('ko-KR')}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigateTo('/')}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              쇼핑 계속하기
            </button>
            {showOrderHistoryButton && (
              <button
                onClick={() => navigateTo('/mypage')}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                주문 내역 보기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
