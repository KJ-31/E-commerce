import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getProducts(sort?: string, search?: string, limit?: number): Promise<ProductResponseDto[]> {
    let query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    // 검색 필터 적용
    if (search) {
      query = query.where(
        'product.product_name ILIKE :search OR product.description ILIKE :search OR product.company ILIKE :search',
        { search: `%${search}%` }
      );
    }

    // 정렬 적용
    switch (sort) {
      case 'new':
        query = query.orderBy('product.created_at', 'DESC');
        break;
      case 'low':
        query = query.orderBy('product.product_price', 'ASC');
        break;
      case 'high':
        query = query.orderBy('product.product_price', 'DESC');
        break;
      default:
        // 기본값: 인기순 (재고가 많은 순)
        query = query.orderBy('product.quantity', 'DESC');
    }

    // 개수 제한
    if (limit) {
      query = query.limit(limit);
    }

    const products = await query.getMany();
    
    // 프론트엔드에서 사용할 수 있는 형태로 변환
    const result = products.map(product => ({
      id: product.product_id,
      brand: product.company,
      name: product.product_name,
      price: parseFloat(product.product_price.toString()),
      sale: 0, // 할인율은 별도 계산 필요
      rating: '4.0', // 평점은 별도 테이블 필요
      img: product.main_img || 'https://picsum.photos/seed/default/600/600',
      tags: product.quantity > 0 ? ['재고있음'] : ['품절'],
      description: product.description,
      category: product.category?.category_name
    }));

    console.log('Returning products:', result.length);
    return result;
  }

  async getFeaturedProducts() {
    // 인기 상품 (재고가 많은 상품 중 상위 12개)
    return await this.getProducts('best', undefined, 12);
  }

// 모든 상품 조회
async getAllProducts() {
  return await this.getProducts();
}

// 검색어를 사용한 상품 검색
async searchProducts(searchQuery: string) {
  return await this.getProducts(undefined, searchQuery);
}

// ID 기반 상품 조회
async getProductById(id: number): Promise<ProductResponseDto | undefined> {
  const product = await this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category')
    .where('product.product_id = :id', { id })
    .getOne();

  if (!product) {
    return undefined;
  }

  return {
      id: product.product_id,
      brand: product.company,
      name: product.product_name,
      price: parseFloat(product.product_price.toString()),
      sale: 0, // 할인율은 별도 계산 필요
      rating: '4.0', // 평점은 별도 테이블 필요
      img: product.main_img || 'https://picsum.photos/seed/default/600/600',
      tags: product.quantity > 0 ? ['재고있음'] : ['품절'],
      description: product.description,
      category: product.category?.category_name
    };
  }
}
