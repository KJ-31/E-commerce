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
