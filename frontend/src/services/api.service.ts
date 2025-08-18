// src/services/api.service.ts
class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API 요청 실패:', error);
      throw error;
    }
  }

  // 상품 관련 API
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);

    return this.request(`/products?${queryParams.toString()}`);
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}`);
  }

  async searchProducts(query: string, page: number = 1, limit: number = 20) {
    const queryParams = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });
    
    return this.request(`/products/search?${queryParams.toString()}`);
  }

  async toggleProductLike(id: number) {
    return this.request(`/products/${id}/like`, {
      method: 'POST'
    });
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id: number, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id: number) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }
}

export const apiService = new ApiService();

// src/hooks/useProducts.ts - React Hook
import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  brand: string;
  seller: string;
  category: string;
  rating: number;
  reviewCount: number;
  likeCount: number;
  stock: number;
  images: Array<{
    id: number;
    imageUrl: string;
    order: number;
    isMain: boolean;
  }>;
  specifications: Record<string, any>;
  description: string;
  freeShipping?: boolean;
  deliveryInfo?: string;
}

export const useProducts = (category?: string, page: number = 1, limit: number = 20) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts({ page, limit, category });
        setProducts(response.products);
        setTotal(response.total);
        setError(null);
      } catch (err) {
        setError('상품을 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page, limit]);

  return { products, loading, error, total, setProducts };
};

export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProduct(id);
        setProduct(response);
        setError(null);
      } catch (err) {
        setError('상품 정보를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error, setProduct };
};

// src/utils/helpers.ts - 유틸리티 함수들
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

export const calculateDiscount = (price: number, originalPrice?: number): number => {
  if (originalPrice && originalPrice > price) {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }
  return 0;
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export const getMainImage = (images: Array<{ imageUrl: string; isMain: boolean; order: number }>): string => {
  const mainImage = images.find(img => img.isMain);
  if (mainImage) return mainImage.imageUrl;
  
  const sortedImages = images.sort((a, b) => a.order - b.order);
  return sortedImages[0]?.imageUrl || '/placeholder-image.jpg';
};