import React, { useState, useContext, createContext } from 'react';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Truck } from 'lucide-react';

// 장바구니 Context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// 장바구니 페이지 컴포넌트
const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const [selectedItems, setSelectedItems] = useState(new Set());

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (itemId, checked) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const getSelectedTotal = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSelectedCount = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8">장바구니</h1>
        <div className="text-center py-16">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
          <div className="text-lg text-gray-500">장바구니가 비어있습니다</div>
          <div className="text-sm text-gray-400 mt-2">원하는 상품을 담아보세요!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">장바구니</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 장바구니 아이템 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 전체 선택 */}
          <div className="bg-white rounded-lg p-4 border">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded text-red-500"
              />
              <span className="font-medium">전체선택 ({cartItems.length})</span>
            </label>
          </div>

          {/* 상품 목록 */}
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-6 border">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                  className="mt-2 rounded text-red-500"
                />
                
                <img
                  src={item.image || item.images?.[0]?.imageUrl}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1 space-y-2">
                  <h3 className="font-medium text-gray-800 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {item.brand} | {item.seller}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold">
                      {formatPrice(item.price)}원
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.originalPrice)}원
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 border sticky top-4">
            <h3 className="font-bold text-lg mb-4">주문 요약</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>선택 상품 ({getSelectedCount()}개)</span>
                <span>{formatPrice(getSelectedTotal())}원</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span className="text-blue-600">무료</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>총 결제금액</span>
                <span className="text-red-500">{formatPrice(getSelectedTotal())}원</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                disabled={selectedItems.size === 0}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                선택상품 주문하기
              </button>
              <button 
                disabled={cartItems.length === 0}
                className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              >
                전체상품 주문하기
              </button>
            </div>

            {/* 혜택 정보 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-2">
                🎁 추가 혜택
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• 첫 구매 시 5% 추가 할인</div>
                <div>• 무료배송 (3만원 이상)</div>
                <div>• 적립금 최대 5% 적립</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 주문 페이지 컴포넌트
const OrderPage = () => {
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    detailAddress: '',
    zipCode: '',
    deliveryRequest: '',
    paymentMethod: 'card'
  });

  const [orderItems] = useState([
    {
      id: 1,
      title: "2022 애플 맥북 에어 M2 칩 13인치",
      price: 1540600,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100"
    }
  ]);

  const handleInputChange = (field, value) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = () => {
    // 주문 처리 로직
    alert('주문이 완료되었습니다!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">주문/결제</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 주문 정보 입력 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 주문 상품 */}
          <div className="bg-white rounded-lg p-6 border">
            <h3 className="font-bold mb-4">주문 상품</h3>
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 py-4 border-b">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">수량: {item.quantity}개</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatPrice(item.price * item.quantity)}원</div>
                </div>
              </div>
            ))}
          </div>

          {/* 배송 정보 */}
          <div className="bg-white rounded-lg p-6 border">
            <h3 className="font-bold mb-4">배송 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">받는 분</label>
                <input
                  type="text"
                  value={orderForm.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">연락처</label>
                <input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                  placeholder="010-0000-0000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">배송 주소</label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={orderForm.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="w-32 p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                      placeholder="우편번호"
                    />
                    <button className="px-4 py-3 bg-gray-500 text-white rounded hover:bg-gray-600">
                      주소 검색
                    </button>
                  </div>
                  <input
                    type="text"
                    value={orderForm.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                    placeholder="주소"
                  />
                  <input
                    type="text"
                    value={orderForm.detailAddress}
                    onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                    placeholder="상세주소"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">배송 요청사항</label>
                <select
                  value={orderForm.deliveryRequest}
                  onChange={(e) => handleInputChange('deliveryRequest', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                >
                  <option value="">선택하세요</option>
                  <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                  <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                  <option value="직접 받겠습니다">직접 받겠습니다</option>
                  <option value="부재 시 연락주세요">부재 시 연락주세요</option>
                </select>
              </div>
            </div>
          </div>

          {/* 결제 방법 */}
          <div className="bg-white rounded-lg p-6 border">
            <h3 className="font-bold mb-4">결제 방법</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'card', label: '신용카드', icon: '💳' },
                { value: 'account', label: '계좌이체', icon: '🏦' },
                { value: 'phone', label: '휴대폰', icon: '📱' },
                { value: 'kakao', label: '카카오페이', icon: '💛' }
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    orderForm.paymentMethod === method.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={orderForm.paymentMethod === method.value}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-2xl mb-1">{method.icon}</div>
                  <div className="text-sm font-medium">{method.label}</div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 border sticky top-4">
            <h3 className="font-bold text-lg mb-4">결제 정보</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>{formatPrice(getTotalPrice())}원</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span className="text-blue-600">무료</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>할인 금액</span>
                <span>-50,000원</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-xl">
                <span>총 결제금액</span>
                <span className="text-red-500">{formatPrice(getTotalPrice() - 50000)}원</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-sm text-gray-600 space-y-1">
                <div>• 적립 예정 포인트: {formatPrice(Math.floor(getTotalPrice() * 0.01))}P</div>
                <div>• 무료배송 (3만원 이상 구매시)</div>
              </div>
            </div>

            <button
              onClick={handleSubmitOrder}
              className="w-full bg-red-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-600 transition-colors"
            >
              {formatPrice(getTotalPrice() - 50000)}원 결제하기
            </button>

            {/* 배송 정보 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Truck size={16} className="text-blue-600" />
                <span className="font-medium text-sm">배송 정보</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• 평일 오후 2시 이전 주문시 당일 발송</div>
                <div>• 주말/공휴일은 익일 발송</div>
                <div>• 배송 기간: 1-3일 (도서산간 지역 제외)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 메인 앱 컴포넌트 (라우팅 예시)
const App = () => {
  const [currentPage, setCurrentPage] = useState('productList');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'productList':
        return <ProductListPage onProductClick={(id) => {
          setSelectedProductId(id);
          setCurrentPage('productDetail');
        }} />;
      case 'productDetail':
        return <ProductDetailPage productId={selectedProductId} />;
      case 'cart':
        return <CartPage />;
      case 'order':
        return <OrderPage />;
      default:
        return <ProductListPage />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        {/* 네비게이션 바 */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <button 
                  onClick={() => setCurrentPage('productList')}
                  className="text-2xl font-bold text-red-500"
                >
                  11ST
                </button>
                <div className="hidden md:flex space-x-6 text-sm">
                  <button 
                    onClick={() => setCurrentPage('productList')}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    상품목록
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">베스트</button>
                  <button className="text-gray-600 hover:text-gray-800">신상품</button>
                  <button className="text-gray-600 hover:text-gray-800">할인상품</button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentPage('cart')}
                  className="relative p-2 text-gray-600 hover:text-gray-800"
                >
                  <ShoppingCart size={24} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>
                <button className="px-4 py-2 text-gray-600 hover:text-gray-800">로그인</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  회원가입
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* 페이지 컨텐츠 */}
        <main>
          {renderPage()}
        </main>
      </div>
    </CartProvider>
  );
};

export default App;