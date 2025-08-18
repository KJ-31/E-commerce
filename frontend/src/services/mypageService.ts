// 마이페이지 API 서비스

const API_BASE_URL = 'http://localhost:3001';

export interface UserInfo {
  user_id: number;
  email: string;
  user_name: string;
  user_addr: string;
  user_phone_num: string;
  created_at: string;
}

export interface OrderStats {
  pending: number;
  paid: number;
  preparing: number;
  shipping: number;
  completed: number;
  cancelled: number;
  exchanged: number;
  returned: number;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string;
  created_at: string;
  product: {
    product_id: number;
    product_name: string;
    product_price: string;
    company: string;
    description: string;
    main_img: string;
  };
}

export interface Order {
  order_id: number;
  user_id: number;
  total_price: string;
  order_status: string;
  created_at: string;
  orderItems: OrderItem[];
}

export interface Benefits {
  points: number;
  coupons: Array<{
    id: number;
    name: string;
    discount: number;
    validUntil: string;
  }>;
  cashback: number;
  membership: string;
}

export interface DashboardData {
  userInfo: UserInfo;
  orderStats: OrderStats;
  recentOrders: Order[];
  benefits: Benefits;
  timestamp: string;
}

// 마이페이지 대시보드 전체 정보 조회
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mypage/dashboard`);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// 사용자 정보 조회
export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mypage/user-info`);
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

// 주문 통계 조회
export const getOrderStats = async (): Promise<OrderStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mypage/order-stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch order stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }
};

// 최근 주문 내역 조회
export const getRecentOrders = async (limit: number = 3): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mypage/recent-orders?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recent orders');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};

// 주문 상세 정보 조회
export const getOrderDetail = async (orderId: number): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mypage/orders/${orderId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch order detail');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching order detail:', error);
    throw error;
  }
};

// 사용자 혜택 정보 조회
export const getUserBenefits = async (): Promise<Benefits> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mypage/benefits`);
    if (!response.ok) {
      throw new Error('Failed to fetch user benefits');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user benefits:', error);
    throw error;
  }
};
