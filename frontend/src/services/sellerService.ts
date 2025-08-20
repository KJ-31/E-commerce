const API_BASE_URL = 'http://localhost:3001';

export interface Product {
  product_id: number;
  product_name: string;
  price: number;
  description?: string;
  category_id?: number;
  stock_quantity: number;
  seller_id: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  order_id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  status: string;
  shipping_address?: string;
}

export interface Seller {
  seller_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  phone?: string;
  address?: string;
  company_name?: string;
  business_number?: string;
  company_phone?: string;
  company_address?: string;
  created_at: string;
  updated_at: string;
}

export interface SellerDashboard {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export interface SellerProduct extends Product {}

export interface SellerOrder extends Order {}

export interface SellerInquiry {
  inquiry_id: number;
  user_id: number;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

class SellerService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getSellerInfo(sellerId: number): Promise<Seller> {
    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('판매자 정보를 가져오는데 실패했습니다.');
    }

    return response.json();
  }

  async getSellerDashboard(sellerId: number): Promise<SellerDashboard> {
    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/dashboard`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('대시보드 정보를 가져오는데 실패했습니다.');
    }

    return response.json();
  }

  async getSellerInquiries(sellerId: number): Promise<SellerInquiry[]> {
    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/inquiries`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('문의 목록을 가져오는데 실패했습니다.');
    }

    return response.json();
  }

  async getSellerProducts(sellerId: number): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/products`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('상품 목록을 가져오는데 실패했습니다.');
    }

    return response.json();
  }

  async getSellerOrders(sellerId: number): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/orders`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('주문 목록을 가져오는데 실패했습니다.');
    }

    return response.json();
  }

  async deleteProducts(sellerId: number, productIds: number[]): Promise<{ message: string; deletedCount: number }> {
    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/products`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ productIds }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '상품 삭제에 실패했습니다.');
    }

    return response.json();
  }

  async addProduct(sellerId: number, productData: Omit<Product, 'product_id' | 'seller_id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/products`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '상품 등록에 실패했습니다.');
    }

    return response.json();
  }

  async updateProduct(sellerId: number, productId: number, productData: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/sellers/${sellerId}/products/${productId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '상품 수정에 실패했습니다.');
    }

    return response.json();
  }
}

export const sellerService = new SellerService();

// Named exports for backward compatibility
export const getSellerDashboard = sellerService.getSellerDashboard.bind(sellerService);
export const getSellerProducts = sellerService.getSellerProducts.bind(sellerService);
export const getSellerOrders = sellerService.getSellerOrders.bind(sellerService);
export const getSellerInquiries = sellerService.getSellerInquiries.bind(sellerService);
export const createProduct = sellerService.addProduct.bind(sellerService);
export const deleteProducts = sellerService.deleteProducts.bind(sellerService);