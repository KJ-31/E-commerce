import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, sellerId: number): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      seller: { id: sellerId },
    });
    return this.productRepository.save(product);
  }

  async findAllBySeller(sellerId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { seller: { id: sellerId } },
      relations: ['orderItems'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, sellerId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, seller: { id: sellerId } },
      relations: ['orderItems'],
    });
    
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }
    
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, sellerId: number): Promise<Product> {
    const product = await this.findOne(id, sellerId);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number, sellerId: number): Promise<void> {
    const product = await this.findOne(id, sellerId);
    await this.productRepository.remove(product);
  }

  async updateStock(id: number, stock: number, sellerId: number): Promise<Product> {
    const product = await this.findOne(id, sellerId);
    product.stock = stock;
    return this.productRepository.save(product);
  }

  async incrementViews(id: number): Promise<void> {
    await this.productRepository.increment({ id }, 'views', 1);
  }
}
