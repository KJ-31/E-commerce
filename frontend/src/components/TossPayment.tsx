import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { tossPaymentService } from '../services/tossPaymentService';

interface TossPaymentProps {
  navigateTo: (path: string) => void;
}

interface PaymentData {
  items: any[];
  totalPrice: number;
  userInfo: any;
}

const TossPayment: React.FC<TossPaymentProps> = ({ navigateTo }) => {
  const { isLoggedIn, userInfo } = useAuth();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 로그인 체크
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigateTo('/login');
      return;
    }

    // 결제 데이터 로드
    const pendingPaymentData = sessionStorage.getItem('pendingPayment');
    if (!pendingPaymentData) {
      alert('결제 정보를 찾을 수 없습니다.');
      navigateTo('/cart');
      return;
    }

    try {
      const data = JSON.parse(pendingPaymentData);
      setPaymentData(data);
      
      // 토스페이먼츠 초기화 및 UI 렌더링
      initializeTossPayments(data);
    } catch (error) {
      console.error('결제 데이터 파싱 오류:', error);
      alert('결제 정보가 올바르지 않습니다.');
      navigateTo('/cart');
    }
  }, [isLoggedIn, navigateTo]);

  const initializeTossPayments = async (data: PaymentData) => {
    try {
      setLoading(true);
      
      // 고유한 customerKey 생성 (사용자 ID 기반)
      const customerKey = `customer_${data.userInfo?.user_id || 'anonymous'}`;
      
      // 토스페이먼츠 초기화 (결제창 방식)
      await tossPaymentService.initialize(customerKey);
      
      setLoading(false);
    } catch (error) {
      console.error('토스페이먼츠 초기화 오류:', error);
      setError('결제 시스템을 초기화하는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentData) return;

    try {
      // 주문 ID 생성
      const orderId = `order_${Date.now()}`;
      
      // 주문명 생성
      const orderName = paymentData.items.length === 1 
        ? (paymentData.items[0].name || paymentData.items[0].productName) 
        : `${paymentData.items[0].name || paymentData.items[0].productName} 외 ${paymentData.items.length - 1}개`;

      // 결제 요청
      await tossPaymentService.requestPayment({
        amount: paymentData.totalPrice || paymentData.totalAmount,
        orderId: orderId,
        orderName: orderName,
        customerName: paymentData.userInfo?.user_name || '고객',
        customerEmail: paymentData.userInfo?.email || '',
        customerMobilePhone: paymentData.userInfo?.user_phone_num || '',
      });
    } catch (error) {
      console.error('결제 요청 오류:', error);
      alert(error instanceof Error ? error.message : '결제 요청 중 오류가 발생했습니다.');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">결제 시스템 로딩 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">오류 발생</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigateTo('/cart')}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            장바구니로 돌아가기
          </button>
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
                onClick={() => navigateTo('/cart')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">토스페이먼츠 결제</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 주문 정보 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">주문 정보</h2>
            
            {paymentData && (
              <div className="space-y-4">
                {paymentData.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name || item.productName}</h3>
                      <p className="text-sm text-gray-600">수량: {item.quantity}개</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {((item.price || 0) * (item.quantity || 0)).toLocaleString()}원
                    </p>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>총 결제금액</span>
                    <span className="text-red-600">{(paymentData.totalPrice || paymentData.totalAmount || 0).toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 결제 방법 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">결제 방법</h2>
            
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">카드 결제</h3>
                <p className="text-gray-600">결제하기 버튼을 클릭하면 토스페이먼츠 결제창이 열립니다.</p>
              </div>
            </div>
            
            {/* 결제하기 버튼 */}
            <button
              onClick={handlePayment}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              토스페이먼츠로 결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TossPayment;
