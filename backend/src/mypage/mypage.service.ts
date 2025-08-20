import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class MyPageService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // 사용자 정보 조회
  async getUserInfo(userId: number) {
    return await this.userRepository.findOne({
      where: { user_id: userId },
      select: ['user_id', 'user_name', 'email', 'user_addr', 'user_phone_num', 'created_at']
    });
  }

  // 주문 통계 조회 (최근 6개월)
  async getOrderStats(userId: number) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.user_id = :userId', { userId })
      .andWhere('order.created_at >= :sixMonthsAgo', { sixMonthsAgo })
      .getMany();

    // 주문 상태별 통계
    const stats = {
      pending: 0,      // 입금대기중
      paid: 0,         // 결제완료
      preparing: 0,    // 배송준비중
      shipping: 0,     // 배송중
      completed: 0,    // 배송완료
      cancelled: 0,    // 취소
      exchanged: 0,    // 교환
      returned: 0,     // 반품
    };

    orders.forEach(order => {
      switch (order.order_status) {
        case '주문접수':
        case 'pending':
          stats.pending++;
          break;
        case '결제완료':
        case 'paid':
          stats.paid++;
          break;
        case '배송준비중':
        case 'preparing':
          stats.preparing++;
          break;
        case '배송중':
        case 'shipping':
          stats.shipping++;
          break;
        case '배송완료':
        case 'completed':
          stats.completed++;
          break;
        case '취소':
        case 'cancelled':
          stats.cancelled++;
          break;
        case '교환':
        case 'exchanged':
          stats.exchanged++;
          break;
        case '반품':
        case 'returned':
          stats.returned++;
          break;
      }
    });

    return stats;
  }

  // 최근 주문 내역 조회 (최근 3건, 6개월 내)
  async getRecentOrders(userId: number, limit: number = 3) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .where('order.user_id = :userId', { userId })
      .andWhere('order.created_at >= :sixMonthsAgo', { sixMonthsAgo })
      .orderBy('order.created_at', 'DESC')
      .take(limit)
      .getMany();
  }

  // 주문 상세 정보 조회
  async getOrderDetail(userId: number, orderId: number) {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .where('order.user_id = :userId', { userId })
      .andWhere('order.order_id = :orderId', { orderId })
      .getOne();
  }

  // 주문 상태별 주문 목록 조회
  async getOrdersByStatus(userId: number, status: string) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .where('order.user_id = :userId', { userId })
      .andWhere('order.order_status = :status', { status })
      .andWhere('order.created_at >= :sixMonthsAgo', { sixMonthsAgo })
      .orderBy('order.created_at', 'DESC')
      .getMany();
  }

  // 사용자 포인트/쿠폰 정보 (더미 데이터)
  async getUserBenefits(userId: number) {
    // 실제로는 별도 테이블에서 조회해야 함
    return {
      points: 15000,
      coupons: [
        { id: 1, name: '신규 회원 웰컴 쿠폰', discount: 5000, validUntil: '2024-12-31' },
        { id: 2, name: '생일 축하 쿠폰', discount: 10000, validUntil: '2024-12-31' }
      ],
      cashback: 2500,
      membership: 'GOLD'
    };
  }

  // 찜한 상품 목록 (더미 데이터)
  async getWishlist(userId: number) {
    // 실제로는 별도 테이블에서 조회해야 함
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .take(10)
      .getMany();
  }

  // 최근 본 상품 목록 (더미 데이터)
  async getRecentlyViewed(userId: number) {
    // 실제로는 별도 테이블에서 조회해야 함
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.updated_at', 'DESC')
      .take(10)
      .getMany();
  }
}
