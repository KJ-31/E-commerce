import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from '../entities/seller.entity';
import { CreateSellerDto } from '../dto/create-seller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
  ) {}

  async create(createSellerDto: CreateSellerDto): Promise<Seller> {
    const seller = this.sellerRepository.create(createSellerDto);
    return this.sellerRepository.save(seller);
  }

  async findOne(id: number): Promise<Seller> {
    const seller = await this.sellerRepository.findOne({
      where: { id },
      relations: ['products', 'orders'],
    });
    
    if (!seller) {
      throw new NotFoundException('판매자를 찾을 수 없습니다');
    }
    
    return seller;
  }

  async update(id: number, updateData: Partial<Seller>): Promise<Seller> {
    const seller = await this.findOne(id);
    Object.assign(seller, updateData);
    return this.sellerRepository.save(seller);
  }

  async getSellerProfile(sellerId: number) {
    const seller = await this.findOne(sellerId);
    const totalProducts = seller.products?.length || 0;
    const totalOrders = seller.orders?.length || 0;
    
    return {
      ...seller,
      stats: {
        totalProducts,
        totalOrders,
      },
    };
  }
}