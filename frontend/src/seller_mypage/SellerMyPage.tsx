// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  getSellerDashboard, 
  getSellerProducts, 
  getSellerOrders, 
  getSellerInquiries, 
  createProduct,
  deleteProducts,
  SellerDashboard,
  SellerProduct,
  SellerOrder,
  SellerInquiry
} from '../services/sellerService';
import { getCurrentUser, getCurrentSellerId } from '../services/authService';
import { 
  Package, 
  DollarSign, 
  ShoppingBag, 
  MessageCircle, 
  Settings,
  Bell,
  User,
  Search,
  ChevronRight,
  TrendingUp,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

function SellerMyPage() {
  const [activeTab, setActiveTab] = useState('상품관리');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 상품 삭제 관련 상태
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  
  // API 데이터 상태
  const [dashboardData, setDashboardData] = useState<SellerDashboard | null>(null);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [inquiries, setInquiries] = useState<SellerInquiry[]>([]);
  
  // 로그인한 판매자 ID 가져오기
  const getCurrentSellerId = () => {
    const user = getCurrentUser();
    return user?.id || 1; // 기본값으로 1 사용
  };
  
  const [sellerId, setSellerId] = useState<number | null>(null);
  
  useEffect(() => {
    try {
      const id = getCurrentSellerId();
      setSellerId(id);
    } catch (error) {
      console.error('Failed to get seller ID:', error);
      // 판매자 로그인이 안되어 있으면 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
  }, []);
  
  // 상품 등록 폼 상태
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    images: []
  });

  // API 데이터 로드 함수들
  const loadDashboardData = async () => {
    if (!sellerId) return;
    try {
      setLoading(true);
      const data = await getSellerDashboard(sellerId);
      setDashboardData(data);
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    if (!sellerId) return;
    try {
      const data = await getSellerProducts(sellerId);
      setProducts(data);
    } catch (error) {
      console.error('상품 데이터 로드 실패:', error);
    }
  };

  const loadOrders = async () => {
    if (!sellerId) return;
    try {
      const data = await getSellerOrders(sellerId);
      setOrders(data);
    } catch (error) {
      console.error('주문 데이터 로드 실패:', error);
    }
  };

  const loadInquiries = async () => {
    if (!sellerId) return;
    try {
      const data = await getSellerInquiries(sellerId);
      setInquiries(data);
    } catch (error) {
      console.error('문의 데이터 로드 실패:', error);
    }
  };

  useEffect(() => {
    if (sellerId) {
      // sellerId가 설정된 후 초기 데이터 로드
      loadDashboardData();
      loadProducts();
      loadOrders();
      loadInquiries();
      
      // 알림 데이터 설정
      setNotifications([
        { id: 1, type: 'order', message: '새로운 주문이 들어왔습니다', time: '5분 전' },
        { id: 2, type: 'inquiry', message: '고객 문의가 등록되었습니다', time: '15분 전' },
        { id: 3, type: 'stock', message: '재고가 부족합니다', time: '1시간 전' }
      ]);
    }
  }, [sellerId]);

  // 상품 등록 폼 핸들러
  const handleProductFormChange = (field, value) => {
    setProductForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    if (!sellerId) {
      alert('판매자 인증이 필요합니다.');
      return;
    }
    
    try {
      setLoading(true);
      
      const result = await createProduct(sellerId, {
        name: productForm.name,
        description: productForm.description,
        price: productForm.price,
        stock: productForm.stock,
        category: productForm.category,
        brand: productForm.brand
      }, productForm.images);
      
      alert('상품이 성공적으로 등록되었습니다!');
      setShowProductForm(false);
      setProductForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        brand: '',
        images: []
      });
      
      // 상품 목록 새로고침
      await loadProducts();
      
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert('상품 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  // 이미지 제거 핸들러
  const handleImageRemove = (index) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // 상품 설명에 이미지 추가 핸들러
  const handleDescriptionImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        const currentDesc = productForm.description;
        const newDesc = currentDesc + `\n\n![이미지](${imageData})\n\n`;
        handleProductFormChange('description', newDesc);
      };
      reader.readAsDataURL(file);
    });

    // 파일 입력 초기화
    event.target.value = '';
  };

  // 상품 등록 페이지 렌더링
  const renderProductRegistration = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowProductForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">상품 등록</h2>
              <p className="text-gray-600">새로운 상품을 등록해보세요</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleProductSubmit} className="bg-white rounded-lg border p-6 space-y-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상품명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => handleProductFormChange('name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="상품명을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  브랜드
                </label>
                <input
                  type="text"
                  value={productForm.brand}
                  onChange={(e) => handleProductFormChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="브랜드명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={productForm.category}
                  onChange={(e) => handleProductFormChange('category', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="">카테고리를 선택하세요</option>
                  <option value="패션">패션</option>
                  <option value="뷰티">뷰티</option>
                  <option value="디지털">디지털</option>
                  <option value="가전">가전</option>
                  <option value="식품">식품</option>
                  <option value="리빙">리빙</option>
                  <option value="스포츠">스포츠</option>
                  <option value="도서">도서</option>
                  <option value="티켓/여행">티켓/여행</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  판매가격 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) => handleProductFormChange('price', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">원</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  재고수량 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={productForm.stock}
                  onChange={(e) => handleProductFormChange('stock', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="재고수량을 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* 상품 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상품 설명 <span className="text-red-500">*</span>
            </label>
            
            {/* 툴바 */}
            <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex gap-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  const textarea = document.getElementById('product-description') as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const selectedText = text.substring(start, end);
                  const newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
                  handleProductFormChange('description', newText);
                }}
                className="px-2 py-1 bg-white border rounded hover:bg-gray-100"
                title="굵게"
              >
                <strong>B</strong>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const textarea = document.getElementById('product-description') as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const selectedText = text.substring(start, end);
                  const newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
                  handleProductFormChange('description', newText);
                }}
                className="px-2 py-1 bg-white border rounded hover:bg-gray-100"
                title="기울임"
              >
                <em>I</em>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const currentDesc = productForm.description;
                  handleProductFormChange('description', currentDesc + '\n\n• ');
                }}
                className="px-2 py-1 bg-white border rounded hover:bg-gray-100"
                title="목록 추가"
              >
                • 목록
              </button>
              
              <span className="text-gray-400">|</span>
              
              {/* 이미지 업로드 버튼 */}
              <label className="px-2 py-1 bg-white border rounded hover:bg-gray-100 cursor-pointer flex items-center gap-1" title="이미지 추가">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                이미지
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleDescriptionImageUpload}
                  className="hidden"
                />
              </label>
              
              <span className="text-gray-400">|</span>
              
              <span className="text-xs text-gray-500 flex items-center">
                마크다운 지원 (**굵게**, *기울임*, • 목록, 이미지)
              </span>
            </div>
            
            <textarea
              id="product-description"
              required
              rows={8}
              value={productForm.description}
              onChange={(e) => handleProductFormChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono text-sm"
              placeholder="상품에 대한 자세한 설명을 입력하세요.

예시:
**주요 특징:**
• 고품질 소재 사용
• 다양한 색상 선택 가능
• *무료배송* 서비스 제공

**사용법:**
1. 첫 번째 단계
2. 두 번째 단계"
            />
            
            {/* 미리보기 */}
            {productForm.description && (
              <div className="mt-2 p-3 bg-gray-50 border rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">미리보기:</p>
                <div className="prose prose-sm max-w-none">
                  {productForm.description
                    .split('\n')
                    .map((line, index) => {
                      // 이미지 처리
                      const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
                      if (imageMatch) {
                        const [, altText, src] = imageMatch;
                        return (
                          <div key={index} className="my-3">
                            <img 
                              src={src} 
                              alt={altText} 
                              className="max-w-full h-auto rounded-lg shadow-sm border"
                              style={{ maxHeight: '300px' }}
                            />
                          </div>
                        );
                      }
                      
                      // 굵게 처리
                      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                      // 기울임 처리 (굵게가 아닌 경우만)
                      line = line.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
                      
                      // 목록 처리
                      if (line.trim().startsWith('•')) {
                        return <li key={index} dangerouslySetInnerHTML={{ __html: line.replace('•', '').trim() }} />;
                      }
                      // 번호 목록 처리
                      if (/^\d+\./.test(line.trim())) {
                        return <li key={index} dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\./, '').trim() }} />;
                      }
                      // 빈 줄
                      if (line.trim() === '') {
                        return <br key={index} />;
                      }
                      // 일반 텍스트
                      return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
                    })
                  }
                </div>
              </div>
            )}
          </div>

          {/* 상품 이미지 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상품 이미지
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">이미지를 드래그하거나 클릭하여 업로드</p>
                  <p className="text-xs text-gray-400">JPG, PNG 파일만 가능 (최대 5MB)</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  파일 선택
                </label>
              </div>
            </div>
            
            {/* 업로드된 이미지 미리보기 */}
            {productForm.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">업로드된 이미지:</p>
                <div className="grid grid-cols-4 gap-4">
                  {productForm.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`상품 이미지 ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 배송 정보 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">배송 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배송비
                </label>
                <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400">
                  <option value="free">무료배송</option>
                  <option value="3000">유료배송 (3,000원)</option>
                  <option value="conditional">조건부 무료배송</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배송 소요일
                </label>
                <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400">
                  <option value="1-2">1-2일</option>
                  <option value="2-3">2-3일</option>
                  <option value="3-5">3-5일</option>
                  <option value="5-7">5-7일</option>
                </select>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowProductForm(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
            >
              상품 등록
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderTabContent = () => {
    // 상품 등록 폼이 열려있으면 상품 등록 페이지 표시
    if (showProductForm) {
      return renderProductRegistration();
    }

    switch (activeTab) {
      case '상품관리':
        return (
          <div className="space-y-6 bg-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">상품 관리</h2>
                <p className="text-gray-600">등록된 상품을 관리하고 수정할 수 있습니다</p>
                <p className="text-sm text-blue-600">현재 {products.length}개의 상품이 있습니다</p>
              </div>
              <div className="flex gap-2">
                {isDeleteMode && (
                  <>
                    <button
                      className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                      onClick={handleSelectAll}
                    >
                      전체 선택 ({selectedProducts.size}/{products.length})
                    </button>
                    <button
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      onClick={handleDeleteSelected}
                      disabled={selectedProducts.size === 0}
                    >
                      선택 삭제 ({selectedProducts.size})
                    </button>
                    <button
                      className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                      onClick={handleDeleteModeToggle}
                    >
                      취소
                    </button>
                  </>
                )}
                {!isDeleteMode && (
                  <>
                    <button 
                      className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
                      onClick={() => setShowProductForm(true)}
                    >
                      <Plus className="w-4 h-4" />
                      상품 등록
                    </button>
                    <button
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      onClick={handleDeleteModeToggle}
                    >
                      상품 삭제
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="상품명으로 검색"
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                필터
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                엑셀
              </button>
            </div>

            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {isDeleteMode && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">
                          <input
                            type="checkbox"
                            checked={selectedProducts.size === products.length && products.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상품정보</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가격</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">재고</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">조회수</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">주문수</th>
                      {!isDeleteMode && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        {isDeleteMode && (
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedProducts.has(product.id)}
                              onChange={() => handleProductSelect(product.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900">₩{product.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {product.stock}개
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900">{product.views.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-900">{product.orders}</td>
                        {!isDeleteMode && (
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-gray-400 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-green-600">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case '주문관리':
        return (
          <div className="space-y-6 bg-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">주문 관리</h2>
                <p className="text-sm text-blue-600">현재 {orders.length}개의 주문이 있습니다</p>
                <p className="text-gray-600">고객 주문을 확인하고 처리할 수 있습니다</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <RefreshCw className="w-4 h-4" />
                새로고침
              </button>
            </div>

            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">주문번호</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상품명</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">고객</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">금액</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">시간</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 text-gray-900">{order.product}</td>
                          <td className="px-6 py-4 text-gray-900">{order.customer}</td>
                          <td className="px-6 py-4 text-gray-900">₩{order.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${order.statusColor}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{order.time}</td>
                          <td className="px-6 py-4">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">처리</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          주문이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case '매출관리':
        return (
          <div className="space-y-6 bg-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">매출 관리</h2>
                <p className="text-gray-600">매출 현황과 통계를 확인할 수 있습니다</p>
              </div>
              <div className="flex items-center gap-2">
                <select className="px-3 py-2 border rounded-lg">
                  <option>이번 달</option>
                  <option>지난 달</option>
                  <option>최근 3개월</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  리포트
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">일별 매출</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">매출 차트 영역</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">상품별 매출</h3>
                <div className="space-y-3">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover" />
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <span className="font-bold text-green-600">₩{(product.price * product.orders).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case '고객관리':
        return (
          <div className="space-y-6 bg-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">고객 관리</h2>
                <p className="text-gray-600">고객 문의와 리뷰를 관리할 수 있습니다</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-900">고객 문의</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{inquiry.subject}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            inquiry.isAnswered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {inquiry.isAnswered ? '답변완료' : '답변대기'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{inquiry.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>고객: {inquiry.customer}</span>
                          <span>상품: {inquiry.product}</span>
                          <span>{inquiry.time}</span>
                        </div>
                      </div>
                      {!inquiry.isAnswered && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          답변하기
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case '설정':
        return (
          <div className="space-y-6 bg-white p-6 rounded-lg">
            <div>
              <h2 className="text-xl font-bold text-gray-900">판매자 설정</h2>
              <p className="text-gray-600">판매자 정보와 스토어 설정을 관리할 수 있습니다</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사업자명</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-lg" defaultValue="11번가 스토어" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사업자등록번호</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-lg" defaultValue="123-45-67890" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-lg" defaultValue="02-1234-5678" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">배송 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기본 배송비</label>
                    <input type="number" className="w-full px-3 py-2 border rounded-lg" defaultValue="3000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">무료배송 기준</label>
                    <input type="number" className="w-full px-3 py-2 border rounded-lg" defaultValue="50000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">배송 소요일</label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      <option>1-2일</option>
                      <option>2-3일</option>
                      <option>3-5일</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">
                설정 저장
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-6 rounded-lg text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">선택된 메뉴</h3>
            <p className="text-gray-600 mt-2">{activeTab} 페이지입니다.</p>
          </div>
        );
    }
  };

  // 상품 삭제 관련 함수들
  const handleDeleteModeToggle = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedProducts(new Set()); // 삭제 모드 토글시 선택 초기화
  };

  const handleProductSelect = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      // 모든 상품이 선택된 경우 선택 해제
      setSelectedProducts(new Set());
    } else {
      // 모든 상품 선택
      const allProductIds = new Set(products.map(p => p.id));
      setSelectedProducts(allProductIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (!sellerId || selectedProducts.size === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }

    const confirmed = window.confirm(`선택한 ${selectedProducts.size}개의 상품을 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      setLoading(true);
      const productIds = Array.from(selectedProducts);
      
      const result = await deleteProducts(sellerId, productIds);
      
      alert(result.message);
      
      // 상품 목록 새로고침
      await loadProducts();
      
      // 삭제 모드 종료 및 선택 초기화
      setIsDeleteMode(false);
      setSelectedProducts(new Set());
      
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      alert('상품 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // sellerId가 로드되지 않았으면 로딩 표시
  if (!sellerId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">판매자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm border-b">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">판매자님, 안녕하세요!</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <a href="/" className="hover:text-rose-600">구매자 홈으로</a>
              <span>|</span>
              <a href="#" className="hover:text-rose-600">고객센터</a>
              <span>|</span>
              <a href="#" className="hover:text-rose-600">로그아웃</a>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-black text-rose-600">11ST</h1>
              <div className="h-6 w-px bg-gray-300"></div>
              <h2 className="text-xl font-bold text-gray-900">판매자센터</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="상품명, 주문번호 검색"
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 w-64"
                />
              </div>
              <button 
                className="p-2 rounded-lg hover:bg-gray-100 relative"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="flex items-center gap-6 py-3 border-t">
            {[
              { id: '상품관리', label: '상품관리', icon: Package },
              { id: '주문관리', label: '주문관리', icon: ShoppingBag },
              { id: '매출관리', label: '매출관리', icon: DollarSign },
              { id: '고객관리', label: '고객관리', icon: MessageCircle },
              { id: '설정', label: '설정', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                    : 'text-gray-700 hover:text-rose-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">오늘 조회수</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.todayStats.views.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  전일 대비 +12%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">오늘 주문</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.todayStats.orders || 0}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  전일 대비 +8%
                </p>
              </div>
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">오늘 매출</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₩{dashboardData?.todayStats.sales.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  전일 대비 +15%
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">신규 문의</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.todayStats.inquiries || 0}
                </p>
                <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  답변 대기중
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">최근 주문 현황</h3>
                <button className="text-sm text-rose-600 hover:text-rose-700 flex items-center gap-1">
                  전체보기 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {(dashboardData?.recentOrders || []).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{order.product}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {order.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">₩{order.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {(!dashboardData?.recentOrders || dashboardData.recentOrders.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    최근 주문이 없습니다.
                  </div>
                )}
              </div>
            </div>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="mt-6">
          {renderTabContent()}
        </div>

        {/* 공지사항 및 안내 */}
        <div className="mt-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl shadow-sm text-white p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">📢 판매자 공지사항</h4>
              <p className="text-sm opacity-90 mb-3">
                2024년 새해 맞이 판매자 수수료 할인 이벤트가 진행 중입니다. 
                신규 상품 등록 시 수수료 50% 할인 혜택을 받으세요!
              </p>
              <button className="text-sm font-medium bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                자세히 보기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SellerMyPage;