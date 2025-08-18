import React, { useState, useEffect } from 'react';
import { getDashboardData, UserInfo, OrderStats, Order, Benefits } from '../services/mypageService';

type MyPageProps = {
  navigateTo?: (path: string) => void;
};

const MyPage: React.FC<MyPageProps> = ({ navigateTo }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [benefits, setBenefits] = useState<Benefits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setUserInfo(data.userInfo);
        setOrderStats(data.orderStats);
        setRecentOrders(data.recentOrders);
        setBenefits(data.benefits);
        setError(null);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <div className="text-gray-700 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* 로고 및 검색 */}
            <div className="flex items-center space-x-6">
              <div className="font-black text-2xl text-rose-600">11ST</div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  className="w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <button className="absolute right-2 top-2 text-gray-400">
                  🔍
                </button>
              </div>
            </div>
            
            {/* 상단 메뉴 */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">4 찌개</span>
              <button className="p-2 hover:bg-gray-100 rounded">👤</button>
              <button className="p-2 hover:bg-gray-100 rounded">🚚</button>
              <button className="p-2 hover:bg-gray-100 rounded">🛒</button>
              <button className="p-2 hover:bg-gray-100 rounded">📚</button>
              <span className="text-sm text-blue-600">앱 다운로드</span>
            </div>
          </div>
          
          {/* 사용자 정보 */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-4">
              <span className="font-medium">
                {loading ? '로딩 중...' : userInfo?.user_name || '사용자'}님
              </span>
              <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded">바로가기 ON</button>
            </div>
          </div>
          
          {/* 네비게이션 바 */}
          <nav className="flex items-center space-x-6 py-3 text-sm">
            <a href="#" className="text-gray-700 hover:text-rose-600">베스트</a>
            <a href="#" className="text-gray-700 hover:text-rose-600">쇼킹딜</a>
            <a href="#" className="text-gray-700 hover:text-rose-600">마트플러스</a>
            <a href="#" className="text-gray-700 hover:text-rose-600">쿠폰/기획전</a>
            <a href="#" className="text-gray-700 hover:text-rose-600">9900원샵</a>
            <a href="#" className="text-gray-700 hover:text-rose-600">리퍼블리</a>
            <a href="#" className="text-gray-700 hover:text-rose-600">T공식대리점</a>
            <a href="#" className="text-gray-700 hover:text-rose-600">아마존</a>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 좌측 사이드바 */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6">
            {/* 사용자 프로필 */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">☀️</div>
              <div className="font-semibold text-lg">
                {loading ? '로딩 중...' : userInfo?.user_name || '사용자'}님
              </div>
              <button className="mt-3 w-full bg-rose-500 text-white py-2 rounded-lg text-sm">
                11번가플러스 바로가기
              </button>
            </div>

            {/* 나의 쇼핑 내역 */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">나의 쇼핑 내역</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-rose-600">주문/배송조회</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">취소/반품/교환 신청</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">취소/반품/교환 현황</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">환불/입금내역</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">영수증/소득공제/배송비</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">T공식대리점 주문조회</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">여행 예약결제조회</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">항공권 예약결제조회</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">SK렌터카 견적/계약 조회</a></li>
              </ul>
            </div>

            {/* 선물함 */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">선물함</h3>
            </div>

            {/* 나의 혜택 관리 */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">나의 혜택 관리</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-rose-600">11번가 쿠폰</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">11pay 포인트/머니</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">T멤버십</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">캐시</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">OK캐쉬백</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">11번가 머니백</a></li>
              </ul>
            </div>

            {/* 나의 관심 목록 */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">나의 관심 목록</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-rose-600">찜한 상품</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">최근 본 상품</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">찜한/구매스토어</a></li>
              </ul>
            </div>

            {/* 나의 쇼핑 지식 */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">나의 쇼핑 지식</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-rose-600">상품 Q&A</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">메일상담내역</a></li>
                <li><a href="#" className="text-gray-600 hover:text-rose-600">채팅상담내역</a></li>
              </ul>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1 space-y-6">
            {/* 희망쇼핑 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">우리의 반려/유기동물을 도와주세요.</h2>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-rose-600 mb-2">희망후원금 117,279,220원</div>
                  <div className="text-gray-600 mb-4">322,489명 참여중</div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>올해 목표 2.5억원</span>
                      <span>47%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-rose-500 h-2 rounded-full" style={{ width: '47%' }}></div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">희망쇼핑 소개</button>
                    <button className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm">희망상품 구매</button>
                  </div>
                </div>
                <div className="ml-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
                    🐱
                  </div>
                </div>
              </div>
            </div>

            {/* 진행 중인 주문 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">진행 중인 주문 (최근 6개월 기준)</h2>
              
              {/* 단계별 주문 현황 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">📋</div>
                    <div className="text-sm text-gray-600">입금대기중</div>
                    <div className="font-semibold">{loading ? '...' : orderStats?.pending || 0}건</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mb-2">💳</div>
                    <div className="text-sm text-gray-600">결제완료</div>
                    <div className="font-semibold">{loading ? '...' : orderStats?.paid || 0}건</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mb-2">📦</div>
                    <div className="text-sm text-gray-600">배송준비중</div>
                    <div className="font-semibold">{loading ? '...' : orderStats?.preparing || 0}건</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mb-2">🚚</div>
                    <div className="text-sm text-gray-600">배송중</div>
                    <div className="font-semibold">{loading ? '...' : orderStats?.shipping || 0}건</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-rose-200 rounded-full flex items-center justify-center mb-2">✅</div>
                    <div className="text-sm text-gray-600">배송완료</div>
                    <div className="font-semibold">{loading ? '...' : orderStats?.completed || 0}건</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">취소 {loading ? '...' : orderStats?.cancelled || 0}건</div>
                  <div className="text-sm text-gray-600 mb-1">교환 {loading ? '...' : orderStats?.exchanged || 0}건</div>
                  <div className="text-sm text-gray-600">반품 {loading ? '...' : orderStats?.returned || 0}건</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                주문 확정 및 영문 11번가 주문 정보 안내
              </div>
            </div>

            {/* 주문 정보 탭 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b">
                <div className="flex">
                  <button className="px-6 py-3 border-b-2 border-rose-500 text-rose-600 font-medium">배송상품</button>
                  <button className="px-6 py-3 text-gray-600 hover:text-rose-600">T공식대리점</button>
                  <button className="px-6 py-3 text-gray-600 hover:text-rose-600">여행</button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">최근 주문 3건(6개월 내)</h3>
                
                {/* 주문 정보 테이블 */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">주문일자</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">주문 상품정보</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">상품금액(수량)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">배송비(판매자)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">주문상태</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">확인/취소/리뷰</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            로딩 중...
                          </td>
                        </tr>
                      ) : recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            최근 주문/배송 조회 내역이 없습니다.
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map((order) => (
                          <tr key={order.order_id} className="border-b">
                            <td className="px-4 py-3 text-sm">
                              {new Date(order.created_at).toLocaleDateString('ko-KR')}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {order.orderItems.map((item, index) => (
                                <div key={item.order_item_id}>
                                  {item.product.product_name}
                                  {index < order.orderItems.length - 1 && <br />}
                                </div>
                              ))}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {order.orderItems.map((item, index) => (
                                <div key={item.order_item_id}>
                                  {parseInt(item.price).toLocaleString()}원 ({item.quantity}개)
                                  {index < order.orderItems.length - 1 && <br />}
                                </div>
                              ))}
                            </td>
                            <td className="px-4 py-3 text-sm">무료</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs ${
                                order.order_status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.order_status === 'shipping' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.order_status === 'completed' ? '배송완료' :
                                 order.order_status === 'shipping' ? '배송중' :
                                 order.order_status === 'pending' ? '입금대기' :
                                 order.order_status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button className="text-rose-600 hover:underline">확인</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex space-x-4">
                  <a href="#" className="text-sm text-rose-600 hover:underline">리스트보기</a>
                  <a href="#" className="text-sm text-rose-600 hover:underline">캘린더보기</a>
                </div>
              </div>
            </div>

            {/* T공식대리점 주문 정보 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">최근 주문 1건(6개월 내)</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">주문일자</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">주문상품 정보</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">상품금액(수량)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">배송비(판매자)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">주문상태</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">확인/취소/문의</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          최근 주문/배송 조회 내역이 없습니다.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4">
                  <button className="bg-rose-500 text-white px-6 py-2 rounded-lg text-sm">
                    전체주문보기
                  </button>
                </div>
              </div>
            </div>

            {/* 하단 안내 문구 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-600">
                OK캐쉬백 적립 내역 및 구매확정 금액에 대한 안내 문구가 여기에 표시됩니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
