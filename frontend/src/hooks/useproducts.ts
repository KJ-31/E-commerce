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