import React, { useState, useEffect } from 'react';
import { Heart, Share2, ChevronLeft, ChevronRight, Star, Truck, ShieldCheck } from 'lucide-react';

// 샘플 데이터 (실제로는 API에서 가져올 데이터)
const sampleProduct = {
  id: 8252396291,
  title: "해외 2022 애플 맥북 에어 M2 칩 13인치 8GB RAM 512GB SSD 스페이스 그레이",
  price: 1540600,
  originalPrice: 1800000,
  brand: "Apple",
  seller: "해외쇼핑",
  category: "노트북/PC",
  rating: 4.5,
  reviewCount: 127,
  likeCount: 245,
  stock: 8,
  images: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
  ],
  specifications: {
    "상품상태": "해외직구",
    "제조사": "Apple",
    "상품번호": "8252396291",
    "배송방법": "(해외직구제품)택배",
    "배송가능지역": "전국",
    "A/S안내": "상세페이지 참조",
    "품질보증": "1년"
  },
  description: "2022년 최신 MacBook Air M2 모델입니다. 뛰어난 성능과 휴대성을 자랑합니다.",
  freeShipping: true,
  deliveryInfo: "해외에서 모레 8/20(수) 발송"
};

const ProductDetailPage = () => {
  const [product, setProduct] = useState(sampleProduct);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('상품정보');

  const handleImagePrevious = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleImageNext = () => {
    setCurrentImageIndex(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleQuantityChange = (increment) => {
    setQuantity(prev => {
      const newQuantity = prev + increment;
      return Math.max(1, Math.min(newQuantity, product.stock));
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setProduct(prev => ({
      ...prev,
      likeCount: isLiked ? prev.likeCount - 1 : prev.likeCount + 1
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const calculateDiscount = () => {
    if (product.originalPrice) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-red-500">11ST</div>
          <div className="text-sm text-gray-600">
            홈 &gt; 노트북/PC &gt; 맥북
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
                src={product.images[currentImageIndex]} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={handleImagePrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleImageNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex space-x-2 mt-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 rounded border-2 overflow-hidden ${
                    currentImageIndex === index ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 상품 정보 섹션 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-medium text-gray-800 mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviewCount}개 리뷰)
                </span>
              </div>
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                <span className="text-sm">{product.likeCount}</span>
              </button>
            </div>

            {/* 가격 정보 */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)}원
                </span>
                {calculateDiscount() > 0 && (
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
                💰 최대 적립 포인트: 20,170P
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Truck size={16} className="text-blue-600" />
                <span className="font-medium text-blue-900">무료배송</span>
              </div>
              <div className="text-sm text-blue-700">
                {product.deliveryInfo}
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
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-600">총 1개</div>
                <div className="text-2xl font-bold text-red-500">
                  {formatPrice(product.price * quantity)} 원
                </div>
              </div>

              {/* 구매 버튼들 */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button className="border border-red-500 text-red-500 py-3 rounded font-medium hover:bg-red-50 transition-colors">
                    장바구니
                  </button>
                  <button className="bg-red-500 text-white py-3 rounded font-medium hover:bg-red-600 transition-colors">
                    구매하기
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
                <span className="font-medium">{product.seller}</span>
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
          {['상품정보', '리뷰 (0)', 'Q&A 0', '판매자정보 (반품/교환)'].map((tab) => (
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

          {activeTab === '리뷰 (0)' && (
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
                  <div>상호: {product.seller}</div>
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
          <button className="flex-1 border border-red-500 text-red-500 py-3 rounded font-medium">
            장바구니
          </button>
          <button className="flex-1 bg-red-500 text-white py-3 rounded font-medium">
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;