import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService, CreateOrderRequest } from '../services/orderService';

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  company: string;
}

interface CartProps {
  navigateTo: (path: string) => void;
}

const Cart: React.FC<CartProps> = ({ navigateTo }) => {
  const { isLoggedIn, userInfo } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // 장바구니 데이터 (임시 데이터)
  useEffect(() => {
    // 실제로는 API에서 가져올 데이터
    const mockCartItems: CartItem[] = [
      {
        id: 1,
        productId: 1,
        productName: 'iPhone 15 Pro',
        price: 1500000,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=iPhone',
        company: 'Apple'
      },
      {
        id: 2,
        productId: 2,
        productName: 'Samsung Galaxy S24',
        price: 1200000,
        quantity: 2,
        image: 'https://via.placeholder.com/100x100?text=Galaxy',
        company: 'Samsung'
      }
    ];
    setCartItems(mockCartItems);
  }, []);

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
      setSelectAll(true);
    }
  };

  // 개별 아이템 선택/해제
  const handleSelectItem = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, itemId]);
      if (selectedItems.length + 1 === cartItems.length) {
        setSelectAll(true);
      }
    }
  };

  // 수량 변경
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // 아이템 삭제
  const handleDeleteItem = (itemId: number) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    setSelectedItems(selectedItems.filter(id => id !== itemId));
  };

  // 선택된 아이템 삭제
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }
    
    if (window.confirm('선택한 상품을 삭제하시겠습니까?')) {
      setCartItems(cartItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      setSelectAll(false);
    }
  };

  // 주문하기
  const handleOrder = async () => {
    console.log('주문하기 버튼 클릭됨');
    
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigateTo('/login');
      return;
    }

    if (selectedItems.length === 0) {
      alert('주문할 상품을 선택해주세요.');
      return;
    }

    try {
      console.log('주문 처리 시작');
      
      // 선택된 상품들만 주문 데이터 구성
      const selectedItemsData = cartItems.filter(item => selectedItems.includes(item.id));
      console.log('선택된 상품들:', selectedItemsData);
      
      const orderData: CreateOrderRequest = {
        userId: userInfo?.user_id || 1, // 실제 로그인한 사용자 ID 사용
        items: selectedItemsData.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: finalPrice,
      };
      
      console.log('주문 데이터:', orderData);

      // 주문 생성
      console.log('API 호출 시작');
      const orderResult = await orderService.createOrder(orderData);
      console.log('주문 결과:', orderResult);
      
      // 주문 완료 페이지로 이동
      console.log('주문 완료 페이지로 이동:', `/order-complete?orderId=${orderResult.orderId}`);
      navigateTo(`/order-complete?orderId=${orderResult.orderId}`);
      
      // 장바구니에서 주문된 상품들 제거
      setCartItems(cartItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      setSelectAll(false);
      
    } catch (error) {
      console.error('주문 처리 오류:', error);
      alert(error instanceof Error ? error.message : '주문 처리 중 오류가 발생했습니다.');
    }
  };

  // 계산
  const selectedItemsData = cartItems.filter(item => selectedItems.includes(item.id));
  const totalPrice = selectedItemsData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = 0; // 할인 금액 (추후 구현)
  const finalPrice = totalPrice - discountAmount;

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
              <h1 className="ml-4 text-xl font-semibold text-gray-900">장바구니</h1>
            </div>
          </div>
        </div>
      </header>

      {/* 진행 단계 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                01
              </div>
              <span className="ml-2 text-black font-medium">장바구니</span>
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
              <div className="bg-gray-200 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                03
              </div>
              <span className="ml-2 text-gray-500">주문완료</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 장바구니 상품 목록 */}
          <div className="flex-1">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">장바구니에 담긴 상품이 없습니다.</h3>
                <p className="text-gray-500 mb-6">원하는 상품을 장바구니에 담아보세요.</p>
                <button
                  onClick={() => navigateTo('/')}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  쇼핑 계속하기
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                {/* 장바구니 헤더 */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm font-medium">전체선택</span>
                      </label>
                      <button
                        onClick={handleDeleteSelected}
                        className="text-sm text-gray-600 hover:text-red-600"
                      >
                        선택삭제
                      </button>
                    </div>
                  </div>
                </div>

                {/* 이달의 혜택 */}
                <div className="p-4 bg-yellow-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">이달의 혜택 : 장바구니쿠폰 1장 바로받기</span>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                      받기
                    </button>
                  </div>
                </div>

                {/* 본인인증 안내 */}
                <div className="p-4 bg-red-50 border-b">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-sm text-gray-700">
                      본인인증 후 11번가 제공 혜택을 받으세요! (미인증 고객은 이벤트/일부 할인 혜택 제외, 구입상품 제한 및 1회 구입금액 한도 50만원 적용됨)
                    </p>
                  </div>
                </div>

                {/* 상품 목록 */}
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{item.productName}</h3>
                          <p className="text-sm text-gray-500">{item.company}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center border rounded">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="px-3 py-1 text-gray-600 hover:text-gray-900 flex items-center justify-center"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="px-3 py-1 border-x">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="px-3 py-1 text-gray-600 hover:text-gray-900 flex items-center justify-center"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-sm text-gray-500 hover:text-red-600 flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              삭제
                            </button>
                          </div>
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
              </div>
            )}
          </div>

          {/* 주문 요약 */}
          <div className="w-80">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">주문 요약</h2>
              
              {/* 적립혜택 */}
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <h3 className="text-sm font-medium text-gray-900 mb-2">적립혜택</h3>
                <p className="text-sm text-gray-600">적립 혜택이 없습니다.</p>
              </div>

              {/* 결제 예정금액 */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">상품금액</span>
                  <span className="text-gray-900">{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">할인금액</span>
                  <span className="text-gray-900">{discountAmount.toLocaleString()}원</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">합계</span>
                    <span className="text-red-600">{finalPrice.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {/* 주문하기 버튼 */}
              <button
                onClick={handleOrder}
                disabled={selectedItems.length === 0}
                className="w-full bg-red-600 text-white py-3 rounded-md font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                주문하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
