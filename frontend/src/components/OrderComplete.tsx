import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService, OrderResponse } from '../services/orderService';

interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  company: string;
}

interface OrderCompleteProps {
  navigateTo: (path: string) => void;
}

const OrderComplete: React.FC<OrderCompleteProps> = ({ navigateTo }) => {
  console.log('OrderComplete 컴포넌트 마운트');
  const { isLoggedIn } = useAuth();
  const [orderInfo, setOrderInfo] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('OrderComplete useEffect 실행');
    const fetchOrderInfo = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        console.log('URL에서 orderId:', orderId);
        
        if (orderId) {
          console.log('주문 정보 조회 시작');
          const orderData = await orderService.getOrderById(parseInt(orderId));
          console.log('주문 정보 조회 완료:', orderData);
          setOrderInfo(orderData);
        } else {
          console.log('orderId가 없음');
        }
      } catch (error) {
        console.error('주문 정보 조회 오류:', error);
        alert('주문 정보를 불러올 수 없습니다.');
        navigateTo('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderInfo();
  }, [navigateTo]);

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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">주문 정보를 불러오는 중...</h2>
        </div>
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">주문 정보를 찾을 수 없습니다</h2>
          <button
            onClick={() => navigateTo('/')}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            홈으로 돌아가기
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
                onClick={() => navigateTo('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">주문 완료</h1>
            </div>
          </div>
        </div>
      </header>

      {/* 진행 단계 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="bg-gray-200 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                01
              </div>
              <span className="ml-2 text-gray-500">장바구니</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="bg-gray-200 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                02
              </div>
              <span className="ml-2 text-gray-500">주문서</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                03
              </div>
              <span className="ml-2 text-black font-medium">주문완료</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 주문 완료 메시지 */}
        <div className="bg-white rounded-lg shadow p-8 text-center mb-8">
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">주문이 완료되었습니다!</h2>
          <p className="text-gray-600 mb-6">주문해주셔서 감사합니다. 주문 내역은 마이페이지에서 확인하실 수 있습니다.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">주문번호</span>
              <span className="font-semibold text-gray-900">{orderInfo.orderId}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">주문일시</span>
              <span className="font-semibold text-gray-900">
                {new Date(orderInfo.orderDate).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigateTo('/mypage')}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              주문 내역 보기
            </button>
            <button
              onClick={() => navigateTo('/')}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              쇼핑 계속하기
            </button>
          </div>
        </div>

        {/* 주문 상품 목록 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">주문 상품</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {orderInfo.items.map((item, index) => (
              <div key={index} className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                    <p className="text-sm text-gray-500">{item.company}</p>
                    <p className="text-sm text-gray-500 mt-1">수량: {item.quantity}개</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.price.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 주문 요약 */}
          <div className="p-6 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">총 결제금액</span>
              <span className="text-2xl font-bold text-red-600">
                {orderInfo.totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;
