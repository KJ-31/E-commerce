const API_BASE_URL = 'http://localhost:3001';

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  userId: number;
  items: OrderItem[];
  totalPrice: number;
}

export interface OrderResponse {
  orderId: number;
  orderDate: Date;
  totalPrice: number;
  orderStatus: string;
  items: {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    image: string;
    company: string;
  }[];
}

export const orderService = {
  // 주문 생성
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('주문 생성에 실패했습니다.');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || '주문 처리 중 오류가 발생했습니다.');
      }

      return result.data;
    } catch (error) {
      console.error('주문 생성 오류:', error);
      throw error;
    }
  },

  // 주문 조회
  async getOrderById(orderId: number): Promise<OrderResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);

      if (!response.ok) {
        throw new Error('주문 정보를 찾을 수 없습니다.');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || '주문 조회 중 오류가 발생했습니다.');
      }

      return result.data;
    } catch (error) {
      console.error('주문 조회 오류:', error);
      throw error;
    }
  },

  // 사용자 주문 내역 조회
  async getUserOrders(userId: number): Promise<OrderResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);

      if (!response.ok) {
        throw new Error('주문 내역을 조회할 수 없습니다.');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || '주문 내역 조회 중 오류가 발생했습니다.');
      }

      return result.data;
    } catch (error) {
      console.error('주문 내역 조회 오류:', error);
      throw error;
    }
  },
};
