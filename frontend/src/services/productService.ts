const API_BASE_URL = 'http://localhost:3001';

export interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  sale: number;
  rating: string;
  img: string;
  tags: string[];
  description?: string;
  category?: string;
  title: string; // product.title
  originalPrice?: number; // product.originalPrice
  reviewCount?: number; // product.reviewCount
  likeCount?: number; // product.likeCount
  stock?: number; // product.stock
  // images: string[]; // product.images (제거)
  specifications?: { [key: string]: string }; // product.specifications
  seller?: string; // product.seller
  freeShipping?: boolean; // product.freeShipping
  deliveryInfo?: string; // product.deliveryInfo
}

export const productService = {
  async getProducts(sort?: string, search?: string, limit?: number): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (sort) params.append('sort', sort);
      if (search) params.append('search', search);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`${API_BASE_URL}/products?${params}`);
      if (!response.ok) {
        throw new Error('상품 목록을 가져오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error('상품 목록 조회 오류:', error);
      return [];
    }
  },

  async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // 상품을 찾을 수 없음
        }
        throw new Error(`상품 상세 정보를 가져오는데 실패했습니다: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`상품 ID ${id} 조회 오류:`, error);
      return null;
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured`);
      if (!response.ok) {
        throw new Error('인기 상품을 가져오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error('인기 상품 조회 오류:', error);
      return [];
    }
  }
};
