import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderStatus, UpdateOrderStatusDto } from '../dto/order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAllBySeller(sellerId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { seller: { id: sellerId } },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, sellerId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, seller: { id: sellerId } },
      relations: ['orderItems', 'orderItems.product'],
    });
    
    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다');
    }
    
    return order;
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto, sellerId: number): Promise<Order> {
    const order = await this.findOne(id, sellerId);
    order.status = updateOrderStatusDto.status;
    return this.orderRepository.save(order);
  }

  async getTodayOrders(sellerId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const count = await this.orderRepository.count({
      where: {
        seller: { id: sellerId },
        createdAt: MoreThanOrEqual(today),
      },
    });
    
    return count;
  }

  async getTodaySales(sellerId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.sellerId = :sellerId', { sellerId })
      .andWhere('order.createdAt >= :today', { today })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }
}
