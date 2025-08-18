import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../backend/src/entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(page: number = 1, limit: number = 20, category?: string): Promise<{ products: Product[], total: number }> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.isActive = :isActive', { isActive: true });

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    const [products, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    return { products, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .where('product.id = :id', { id })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getOne();

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    // 조회수 증가
    await this.productRepository.increment({ id }, 'viewCount', 1);

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.update(id, { isActive: false });
    if (result.affected === 0) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }
  }

  async toggleLike(id: number): Promise<Product> {
    await this.productRepository.increment({ id }, 'likeCount', 1);
    return this.findOne(id);
  }

  async searchProducts(query: string, page: number = 1, limit: number = 20): Promise<{ products: Product[], total: number }> {
    const [products, total] = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('(product.title ILIKE :query OR product.description ILIKE :query OR product.brand ILIKE :query)', 
        { query: `%${query}%` })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    return { products, total };
  }
}

// src/products/dto/product.dto.ts
export class CreateProductDto {
  title: string;
  price: number;
  originalPrice?: number;
  description?: string;
  brand: string;
  seller: string;
  category: string;
  stock: number;
  specifications?: Record<string, any>;
  images?: Array<{ imageUrl: string; order: number; isMain: boolean }>;
}

export class UpdateProductDto extends CreateProductDto {}