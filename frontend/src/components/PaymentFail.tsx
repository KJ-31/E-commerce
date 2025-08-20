import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface PaymentFailProps {
  navigateTo: (path: string) => void;
}

interface FailureInfo {
  code: string;
  message: string;
  orderId?: string;
}

const PaymentFail: React.FC<PaymentFailProps> = ({ navigateTo }) => {
  const { isLoggedIn } = useAuth();
  const [failureInfo, setFailureInfo] = useState<FailureInfo | null>(null);

  useEffect(() => {
    // URL에서 실패 정보 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const message = urlParams.get('message');
    const orderId = urlParams.get('orderId');

    if (code && message) {
      setFailureInfo({
        code,
        message: decodeURIComponent(message),
        orderId: orderId || undefined,
      });
    }

    // 세션 데이터 정리 (결제 실패 시)
    sessionStorage.removeItem('pendingPayment');
  }, []);

  const getFailureMessage = (code: string, message: string) => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return {
          title: '결제가 취소되었습니다',
          description: '고객님이 결제를 취소하셨습니다.',
          action: '다시 결제하시려면 장바구니에서 결제를 진행해주세요.'
        };
      case 'PAY_PROCESS_ABORTED':
        return {
          title: '결제가 실패했습니다',
          description: message || '결제 처리 중 오류가 발생했습니다.',
          action: '잠시 후 다시 시도해주세요.'
        };
      case 'REJECT_CARD_COMPANY':
        return {
          title: '카드 결제가 거부되었습니다',
          description: message || '카드 정보를 확인하고 다시 시도해주세요.',
          action: '다른 카드를 사용하시거나 카드사에 문의해주세요.'
        };
      default:
        return {
          title: '결제 처리 중 오류가 발생했습니다',
          description: message || '알 수 없는 오류가 발생했습니다.',
          action: '잠시 후 다시 시도해주세요.'
        };
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">로그인이 필요합니다</h2>
          <button
            onClick={() => navigateTo('/login')}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  const failure = failureInfo ? getFailureMessage(failureInfo.code, failureInfo.message) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigateTo('/cart')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">결제 실패</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 결제 실패 메시지 */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {failure?.title || '결제 처리 중 오류가 발생했습니다'}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {failure?.description || '알 수 없는 오류가 발생했습니다.'}
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            {failure?.action || '잠시 후 다시 시도해주세요.'}
          </p>

          {failureInfo && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">오류 상세 정보</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><span className="font-medium">오류 코드:</span> {failureInfo.code}</div>
                {failureInfo.orderId && (
                  <div><span className="font-medium">주문번호:</span> {failureInfo.orderId}</div>
                )}
                <div><span className="font-medium">오류 메시지:</span> {failureInfo.message}</div>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigateTo('/cart')}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              장바구니로 돌아가기
            </button>
            <button
              onClick={() => navigateTo('/')}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              홈으로 이동
            </button>
          </div>
        </div>

        {/* 도움말 */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">결제 문제 해결 도움말</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• 카드 한도나 잔액을 확인해주세요</p>
            <p>• 카드 정보(번호, 유효기간, CVC)를 정확히 입력했는지 확인해주세요</p>
            <p>• 인터넷 연결 상태를 확인해주세요</p>
            <p>• 다른 결제수단을 시도해보세요</p>
            <p>• 문제가 계속되면 고객센터(1544-7772)로 문의해주세요</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
