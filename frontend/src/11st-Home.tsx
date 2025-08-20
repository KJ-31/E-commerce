import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  ChevronDown, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from './context/AuthContext';
import { productService, Product } from './services/productService';
import { cartService } from './services/cartService';

/**
 * 11번가 메인 페이지 느낌의 반응형 홈 스켈레톤 (TypeScript + TSX)
 * - Tailwind + framer-motion + lucide-react
 * - 접근성 / 반응형 / 더미 데이터 포함
 *
 * 설치 필요: npm i framer-motion lucide-react
 */

type Category = { name: string; icon: React.ReactNode };
type Slide = { id: number; title: string; subtitle: string; img: string; bg: string };

const CATEGORIES: Category[] = [
  { name: "패션", icon: <Shield className="w-5 h-5" aria-hidden /> },
  { name: "뷰티", icon: <Star className="w-5 h-5" aria-hidden /> },
  { name: "디지털", icon: <RotateCcw className="w-5 h-5" aria-hidden /> },
  { name: "가전", icon: <Truck className="w-5 h-5" aria-hidden /> },
  { name: "식품", icon: <Star className="w-5 h-5" aria-hidden /> },
  { name: "리빙", icon: <Shield className="w-5 h-5" aria-hidden /> },
  { name: "스포츠", icon: <RotateCcw className="w-5 h-5" aria-hidden /> },
  { name: "도서", icon: <Star className="w-5 h-5" aria-hidden /> },
  { name: "티켓/여행", icon: <Truck className="w-5 h-5" aria-hidden /> },
];

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "오늘의 특가",
    subtitle: "한정수량, 놓치면 품절!",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2000&auto=format&fit=crop",
    bg: "from-pink-100 to-rose-100",
  },
  {
    id: 2,
    title: "새학기 준비",
    subtitle: "디지털&라이프 최대 50%",
    img: "https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=2000&auto=format&fit=crop",
    bg: "from-blue-100 to-indigo-100",
  },
  {
    id: 3,
    title: "쿠킹 위크",
    subtitle: "주방가전 BEST 모음",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000&auto=format&fit=crop",
    bg: "from-emerald-100 to-teal-100",
  },
];

function currency(n: number): string {
  return n.toLocaleString("ko-KR");
}

type WithChildren = { children: React.ReactNode };

const Pill = ({ children }: WithChildren) => (
  <span className="inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium text-gray-700 bg-white/80 shadow-sm">
    {children}
  </span>
);

type IconBtnProps = { label: string; onClick?: () => void } & WithChildren;
const IconBtn = ({ label, children, onClick }: IconBtnProps) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-2xl border bg-white/80 px-3 py-2 text-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-400"
    aria-label={label}
  >
    {children}
  </button>
);

function TopNotice() {
  return (
    <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm">
      <div className="mx-auto max-w-screen-2xl px-4 py-2 flex items-center justify-between">
        <div className="font-medium">신규 회원 웰컴 쿠폰팩 지급 중 🎁</div>
        <a href="#" className="underline underline-offset-4 hover:opacity-90">자세히 보기</a>
      </div>
    </div>
  );
}

type HeaderProps = { 
  query: string; 
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  navigateTo?: (path: string) => void;
};
function Header({ query, setQuery, navigateTo }: HeaderProps) {
  const { isLoggedIn, userType, logout, userInfo } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // 장바구니 개수 업데이트를 위한 이벤트 리스너
  useEffect(() => {
    const updateCartCount = () => {
      const userId = userInfo?.user_id;
      setCartCount(cartService.getCartItemCount(userId));
    };

    // 초기 로드 시 장바구니 개수 설정
    updateCartCount();

    // 커스텀 이벤트 리스너 추가
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [userInfo]);

  const handleLogout = () => {
    logout();
    alert('로그아웃되었습니다.');
  };

  const handleMyPageClick = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigateTo?.('/login');
      return;
    }
    
    if (userType === 'seller') {
      navigateTo?.('/seller/mypage');
    } else {
      navigateTo?.('/mypage');
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* 로고 */}
          <div className="flex items-center gap-8">
            <h1 
              className="text-2xl font-black text-rose-600 cursor-pointer hover:text-rose-700 transition-colors"
              onClick={() => navigateTo?.('/')}
            >
              11ST
            </h1>
            
            {/* 검색바 */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* 우측 메뉴 */}
          <div className="flex items-center gap-4">
            {/* 모바일 검색 */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5" />
            </button>

            {/* 데스크톱 메뉴 */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-700">
              {isLoggedIn ? (
                <>
                  <span className="font-medium">
                    {userType === 'seller' ? '셀러' : '사용자'}님 환영합니다!
                  </span>
                  <button 
                    onClick={handleMyPageClick}
                    className="hover:text-rose-600"
                  >
                    마이페이지
                  </button>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-rose-600"
                  >
                    로그아웃
                  </button>
                  <span className="text-gray-300">|</span>
                  <a className="hover:text-rose-600" href="#">고객센터</a>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigateTo?.('/login')}
                    className="hover:text-rose-600"
                  >
                    로그인
                  </button>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={() => navigateTo?.('/signup')}
                    className="hover:text-rose-600"
                  >
                    회원가입
                  </button>
                  <span className="text-gray-300">|</span>
                  <a className="hover:text-rose-600" href="#">고객센터</a>
                </>
              )}
            </div>

            {/* 아이콘 메뉴 */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Heart className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigateTo?.('/cart')}
                className="p-2 hover:bg-gray-100 rounded-lg relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {isLoggedIn && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pb-4">
          <form
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              // 검색은 실시간으로 처리됨 (useEffect에서 query 변경 감지)
            }}
            role="search"
            aria-label="사이트 검색"
          >
            <input
              id="search-input"
              name="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="브랜드, 상품, 카테고리 검색"
              className="w-full rounded-2xl border px-5 py-3 pr-12 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg"
              aria-label="검색"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </form>
          
          <nav className="flex items-center gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category.name}
                className="flex items-center gap-1 hover:text-rose-600 transition-colors"
              >
                {category.icon}
                {category.name}
                <ChevronDown className="w-3 h-3" />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function HeroCarousel() {
  const [index, setIndex] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const go = (dir: number) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    timerRef.current = window.setInterval(() => go(1), 5000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const announceRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (announceRef.current) {
      announceRef.current.textContent = `${SLIDES[index].title} – ${SLIDES[index].subtitle}`;
    }
  }, [index]);

  return (
    <section className="relative mx-auto max-w-screen-2xl px-4">
      <div className="relative overflow-hidden rounded-3xl border shadow-sm">
        <div className={`bg-gradient-to-br ${SLIDES[index].bg}`}>
          <div className="relative h-[300px] md:h-[420px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={SLIDES[index].id}
                src={SLIDES[index].img}
                alt={SLIDES[index].title}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/20 to-transparent" />

            <div className="absolute left-6 top-1/2 -translate-y-1/2">
              <button
                onClick={() => go(-1)}
                className="rounded-full bg-white/80 p-2 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                aria-label="이전 배너"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <button
                onClick={() => go(1)}
                className="rounded-full bg-white/80 p-2 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                aria-label="다음 배너"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <motion.div
              className="absolute bottom-6 left-6 max-w-[80%] md:max-w-[50%] text-white"
              key={`caption-${SLIDES[index].id}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl md:text-4xl font-extrabold drop-shadow-sm">{SLIDES[index].title}</h2>
              <p className="mt-1 text-sm md:text-base opacity-90">{SLIDES[index].subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill>오늘만</Pill>
                <Pill>무료배송</Pill>
                <Pill>최대 20% 쿠폰</Pill>
              </div>
            </motion.div>

            <div className="absolute bottom-4 right-6 flex items-center gap-1">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2.5 bg-white/60"}`}
                  aria-label={`${i + 1}번째 배너 보기`}
                />
              ))}
            </div>

            {/* ARIA live for screen readers */}
            <span className="sr-only" aria-live="polite" ref={announceRef} />
          </div>
        </div>
      </div>
    </section>
  );
}

type SectionHeaderProps = { title: string; subtitle?: string; right?: React.ReactNode };
function SectionHeader({ title, subtitle, right }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function ProductCard({ p, navigateTo }: { p: Product; navigateTo: (path: string) => void }) {
  const discounted = Math.round(p.price * (1 - p.sale / 100));
  const { userInfo } = useAuth();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // AuthContext에서 사용자 ID 가져오기
    const userId = userInfo?.user_id;
    
    cartService.addToCart(p, 1, userId);
    
    // 장바구니 업데이트 이벤트 발생
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    alert('장바구니에 추가되었습니다!');
  };

  return (
    <motion.div
      className="group relative block overflow-hidden rounded-2xl border bg-white shadow-sm cursor-pointer"
      initial={{ y: 8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.25 }}
      onClick={() => navigateTo(`/product/${p.id}`)}
    >
      <div className="relative aspect-square bg-gray-50">
        <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        {p.sale ? (
          <div className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow">
            {p.sale}%
          </div>
        ) : null}
        
        {/* 장바구니 담기 버튼 */}
        <button
          onClick={handleAddToCart}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          title="장바구니에 담기"
        >
          <ShoppingCart className="w-4 h-4 text-gray-700" />
        </button>
      </div>
      <div className="space-y-1.5 p-3">
        <div className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold">
          <span>{p.brand}</span>
        </div>
        <div className="line-clamp-2 text-sm text-gray-800 min-h-[2.5rem]">{p.name}</div>
        <div className="flex items-baseline gap-1">
          <div className="text-lg font-extrabold">{currency(discounted)}</div>
          <div className="text-xs text-gray-400 line-through">{currency(p.price)}</div>
        </div>
        <div className="flex flex-wrap gap-1">
          {p.tags.map((t) => (
            <span key={t} className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">
              {t}
            </span>
          ))}
        </div>
        <div className="text-xs text-amber-600">★ {p.rating}</div>
        
        {/* 하단 장바구니 버튼 */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-2 bg-rose-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
        >
          장바구니 담기
        </button>
      </div>
    </motion.div>
  );
}

type SortKey = "best" | "new" | "low" | "high";
function SortTabs({ sort, setSort }: { sort: SortKey; setSort: (v: SortKey) => void }) {
  const tabs: { id: SortKey; label: string }[] = [
    { id: "best", label: "인기순" },
    { id: "new", label: "신상품" },
    { id: "low", label: "낮은가격" },
    { id: "high", label: "높은가격" },
  ];
  return (
    <div className="flex items-center gap-1 rounded-xl border bg-white p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setSort(t.id)}
          className={`rounded-lg px-3 py-1.5 text-sm transition ${sort === t.id ? "bg-rose-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function DealsGrid({ query, navigateTo }: { query: string; navigateTo: (path: string) => void }) {
  const [sort, setSort] = useState<SortKey>("best");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // API에서 상품 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:3001/products';
        
        if (query) {
          url = `http://localhost:3001/products?search=${encodeURIComponent(query)}`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
          // 에러 시 빈 배열 사용
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // 에러 시 빈 배열 사용
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const list = useMemo(() => {
    let arr = [...products];
    switch (sort) {
      case "new":
        arr.reverse();
        break;
      case "low":
        arr.sort((a, b) => a.price * (1 - a.sale / 100) - b.price * (1 - b.sale / 100));
        break;
      case "high":
        arr.sort((a, b) => b.price * (1 - b.sale / 100) - a.price * (1 - a.sale / 100));
        break;
      default:
    }
    return arr;
  }, [sort, products]);

  if (loading) {
    return (
      <section className="mx-auto max-w-screen-2xl px-4">
        <div className="mb-4">
          <SectionHeader
            title="오늘의 딜"
            subtitle="실시간 베스트를 모아봤어요"
            right={<SortTabs sort={sort} setSort={setSort} />}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-2xl mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-screen-2xl px-4">
      <div className="mb-4">
        <SectionHeader
          title="오늘의 딜"
          subtitle="실시간 베스트를 모아봤어요"
          right={<SortTabs sort={sort} setSort={setSort} />}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {loading ? (
          // 로딩 스켈레톤
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-48 mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-1"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          ))
        ) : list.length > 0 ? (
          list.map((p) => (
            <ProductCard key={p.id} p={p} navigateTo={navigateTo} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {query ? `"${query}"에 대한 검색 결과가 없습니다.` : '상품이 없습니다.'}
          </div>
        )}
      </div>
    </section>
  );
}

function PromoTiles() {
  const tiles = [
    { id: 1, title: "슈퍼세일", desc: "카테고리 쿠폰 매일 지급", img: "https://picsum.photos/seed/sale/600/400" },
    { id: 2, title: "여행 특가", desc: "티켓/여행 최대 30%", img: "https://picsum.photos/seed/travel/600/400" },
    { id: 3, title: "브랜드 위크", desc: "단독 혜택 & 사은품", img: "https://picsum.photos/seed/brand/600/400" },
  ] satisfies { id: number; title: string; desc: string; img: string }[];

  return (
    <section className="mx-auto max-w-screen-2xl px-4">
      <div className="mb-4">
        <SectionHeader title="핫한 기획전" subtitle="지금 주목해야 할 특가 모음" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {tiles.map((t) => (
          <motion.a
            key={t.id}
            href="#"
            className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm"
            initial={{ y: 8, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.25 }}
          >
            <div className="aspect-[3/2]">
              <img src={t.img} alt={t.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white drop-shadow-sm">
                <div className="text-lg md:text-xl font-bold">{t.title}</div>
                <div className="text-sm opacity-90">{t.desc}</div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t bg-gray-50">
      <div className="mx-auto max-w-screen-2xl px-4 py-10 grid gap-6 md:grid-cols-4">
        <div>
          <div className="font-black text-xl text-rose-600">11ST</div>
          <p className="mt-2 text-sm text-gray-600">본 템플릿은 학습/클론용 스켈레톤입니다. 실제 브랜드/로고/정책은 포함되어 있지 않습니다.</p>
        </div>
        <div>
          <div className="font-semibold text-gray-900">고객 지원</div>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li><a className="hover:text-rose-600" href="#">공지사항</a></li>
            <li><a className="hover:text-rose-600" href="#">자주 묻는 질문</a></li>
            <li><a className="hover:text-rose-600" href="#">1:1 문의</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-900">약관</div>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li><a className="hover:text-rose-600" href="#">이용약관</a></li>
            <li><a className="hover:text-rose-600" href="#">개인정보처리방침</a></li>
            <li><a className="hover:text-rose-600" href="#">청소년보호정책</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-900">앱 다운로드</div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-10 w-28 rounded-xl bg-white border shadow-sm grid place-items-center text-sm">App Store</div>
            <div className="h-10 w-28 rounded-xl bg-white border shadow-sm grid place-items-center text-sm">Google Play</div>
          </div>
        </div>
      </div>
      <div className="border-t bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 text-xs text-gray-500">© {new Date().getFullYear()} Eleven Street (Clone Skeleton). All rights reserved.</div>
      </div>
    </footer>
  );
}

type ElevenStreetHomeProps = {
  navigateTo: (path: string) => void; // navigateTo를 필수로 변경
};

export default function ElevenStreetHome({ navigateTo }: ElevenStreetHomeProps) {
  const [query, setQuery] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <TopNotice />
      <Header query={query} setQuery={setQuery} navigateTo={navigateTo} />
      <main className="space-y-10 md:space-y-14">
        <HeroCarousel />
        <PromoTiles />
        <DealsGrid query={query} navigateTo={navigateTo} />
      </main>
      <Footer />
    </div>
  );
}

// --- 유틸: 스크롤바/라인클램프 보조 (Tailwind 플러그인 없이 간단히) ---
if (typeof document !== "undefined" && !document.getElementById("inline-tailwind-helpers")) {
  const style = document.createElement("style");
  style.id = "inline-tailwind-helpers";
  style.innerHTML = `
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `;
  document.head.appendChild(style);
}
