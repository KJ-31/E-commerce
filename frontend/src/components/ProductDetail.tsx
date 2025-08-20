import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, Star, Truck, ShieldCheck } from 'lucide-react';
import { productService, Product } from '../services/productService';
import { cartService } from '../services/cartService';
import { useAuth } from '../context/AuthContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('상품정보');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const foundProduct = await productService.getProductById(parseInt(id || '0'));
        if (foundProduct) {
          setProduct(foundProduct);
          setQuantity(1); // 새 상품 로드 시 수량 초기화
          setIsLiked(false); // 새 상품 로드 시 좋아요 상태 초기화
        } else {
          setError('상품을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('상품 상세 정보 조회 오류:', err);
        setError('상품 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>상품 정보가 없습니다.</p>
      </div>
    );
  }

  const handleQuantityChange = (increment: number) => {
    setQuantity(prev => {
      const newQuantity = prev + increment;
      return Math.max(1, Math.min(newQuantity, product.stock || 999)); // stock이 없을 경우를 대비하여 기본값 설정
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setProduct(prev => {
      if (!prev) return null;
      return {
        ...prev,
        likeCount: isLiked ? (prev.likeCount || 0) - 1 : (prev.likeCount || 0) + 1
      };
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const userId = userInfo?.user_id;
    cartService.addToCart(product, quantity, userId);
    
    // 장바구니 업데이트 이벤트 발생
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    alert('장바구니에 추가되었습니다.');
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login');
      return;
    }

    if (!product) return;

    // 결제할 상품 정보를 세션에 저장
    const paymentData = {
      items: [{
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: quantity
      }],
      totalAmount: product.price * quantity,
      userInfo: userInfo // AuthContext에서 사용자 정보 전달
    };

    sessionStorage.setItem('pendingPayment', JSON.stringify(paymentData));
    
    // 토스페이먼츠 결제 페이지로 이동
    navigate('/toss-payment');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center space-x-4">
          <div 
            className="text-2xl font-bold text-red-500 cursor-pointer hover:text-red-600 transition-colors"
            onClick={() => navigate('/')}
          >
            11ST
          </div>
            <div className="text-sm text-gray-600">
              홈 &gt; {product.category || '카테고리'} &gt; {product.name}
            </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 이미지 섹션 */}
        <div className="space-y-4">
          <div className="relative">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.img || 'https://picsum.photos/seed/default/600/600'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 상품 정보 섹션 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-medium text-gray-800 mb-2">
              {product.title}
            </h1>
            <p className="text-5xl font-bold text-gray-800 mb-4">{product.name}</p>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(parseFloat(product.rating || '0')) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviewCount || 0}개 리뷰)
                </span>
              </div>
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                <span className="text-sm">{product.likeCount || 0}</span>
              </button>
            </div>

            {/* 가격 정보 */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)}원
                </span>
                {calculateDiscount() > 0 && product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}원
                  </span>
                )}
              </div>
              {calculateDiscount() > 0 && (
                <div className="text-red-500 font-medium">
                  {calculateDiscount()}% 할인
                </div>
              )}
              <div className="text-sm text-blue-600 font-medium">
                💰 최대 적립 포인트: {formatPrice(Math.round(product.price * 0.01))}P
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Truck size={16} className="text-blue-600" />
                <span className="font-medium text-blue-900">{product.freeShipping ? '무료배송' : '배송비 별도'}</span>
              </div>
              <div className="text-sm text-blue-700">
                {product.deliveryInfo || '배송 정보 없음'}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                최대 22개월 무이자 할부 혜 1건
              </div>
            </div>

            {/* 구매 옵션 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">수량</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                    disabled={quantity >= (product.stock || 999)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-600">총 {quantity}개</div>
                <div className="text-2xl font-bold text-red-500">
                  {formatPrice(product.price * quantity)} 원
                </div>
              </div>

              {/* 구매 버튼들 */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleAddToCart}
                    className="border border-red-500 text-red-500 py-3 rounded font-medium hover:bg-red-50 transition-colors"
                  >
                    장바구니
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="bg-blue-500 text-white py-3 rounded font-medium hover:bg-blue-600 transition-colors"
                  >
                    토스페이먼츠로 결제하기
                  </button>
                </div>
                <button className="w-full bg-red-600 text-white py-3 rounded font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                  <span>🎁</span>
                  <span>선물</span>
                </button>
              </div>
            </div>

            {/* 판매자 정보 */}
            <div className="border-t pt-4 mt-6">
              <div className="text-sm text-gray-600 mb-2">판매자 정보</div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{product.seller || '정보 없음'}</span>
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={16} className="text-green-500" />
                  <span className="text-sm text-green-600">인증판매자</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상품 상세 탭 */}
      <div className="border-t">
        <div className="flex space-x-8 border-b">
          {['상품정보', `리뷰 (${product.reviewCount || 0})`, 'Q&A 0', '판매자정보 (반품/교환)'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === tab
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === '상품정보' && (
            <div className="space-y-6">
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b">
                        <td className="py-3 px-4 bg-gray-50 font-medium w-1/4">{key}</td>
                        <td className="py-3 px-4">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">!</div>
                  <div className="text-sm">
                    <div className="font-medium text-yellow-800 mb-1">
                      판매자가 <strong>현금결제를 요구하면 거부</strong>하시고 즉시 <strong>11번가로 신고</strong>해 주세요.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium mb-4">해외쇼핑 해외직배송 상품</h3>
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">✈️</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    해외쇼핑 코너는 글로벌 쇼핑의 인증을 받은 현지 해외 판매처가 "해외 브랜드 상품"을
                    <br />
                    해외 배송방법(국내배송,해외직배송)을 통해 판매하고 있는 상품과 서비스 입니다.
                    <br />
                    해외쇼핑 바로가기 &gt;
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === `리뷰 (${product.reviewCount || 0})` && (
            <div className="text-center py-12 text-gray-500">
              아직 리뷰가 없습니다.
            </div>
          )}

          {activeTab === 'Q&A 0' && (
            <div className="text-center py-12 text-gray-500">
              문의사항이 없습니다.
            </div>
          )}

          {activeTab === '판매자정보 (반품/교환)' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-2">판매자 정보</div>
                  <div>상호: {product.seller || '정보 없음'}</div>
                  <div>대표: 홍길동</div>
                </div>
                <div>
                  <div className="font-medium mb-2">반품/교환 정보</div>
                  <div>교환/반품 기간: 7일</div>
                  <div>교환/반품 비용: 무료</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 관련 상품 추천 */}
      <div className="mt-12 border-t pt-8">
        <h3 className="text-xl font-bold mb-6">비슷한 상품</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map((item) => (
            <div key={item} className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-square bg-gray-100 rounded mb-3">
                <img
                  src={`https://images.unsplash.com/photo-151708408400${item}?w=300`}
                  alt=""
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="text-sm text-gray-600 mb-1">Apple</div>
              <div className="font-medium text-sm mb-2 line-clamp-2">
                맥북 에어 M{item} 관련 상품
              </div>
              <div className="text-lg font-bold text-red-500">
                {formatPrice(1500000 + item * 100000)}원
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 고정 하단 구매 바 (모바일) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="flex space-x-3">
          <button
            onClick={handleLike}
            className={`p-3 border rounded ${isLiked ? 'border-red-500 text-red-500' : 'border-gray-300'}`}
          >
            <Heart size={20} className={isLiked ? 'fill-current' : ''} />
          </button>
          <button 
            onClick={handleAddToCart}
            className="flex-1 border border-red-500 text-red-500 py-3 rounded font-medium"
          >
            장바구니
          </button>
          <button 
            onClick={handleBuyNow}
            className="flex-1 bg-red-500 text-white py-3 rounded font-medium"
          >
            토스페이먼츠로 결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
