import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

export interface CreateOrderDto {
  userId: number;
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
}

export interface OrderResponse {
  orderId: number;
  orderDate: Date;
  totalPrice: number;
  orderStatus: string;
  items: {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    image: string;
    company: string;
  }[];
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponse> {
    // 트랜잭션 시작
    const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 주문 생성
      const order = this.orderRepository.create({
        user_id: createOrderDto.userId,
        total_price: createOrderDto.totalPrice,
        order_status: 'completed',
      });
      
      const savedOrder = await queryRunner.manager.save(Order, order);

      // 2. 주문 아이템 생성 및 재고 차감
      const orderItems: any[] = [];
      for (const item of createOrderDto.items) {
        // 상품 정보 조회
        const product = await queryRunner.manager.findOne(Product, {
          where: { product_id: item.productId }
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        // 재고 확인
        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.product_name}`);
        }

        // 주문 아이템 생성
        const orderItem = this.orderItemRepository.create({
          order_id: savedOrder.order_id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
        
        await queryRunner.manager.save(OrderItem, orderItem);
        orderItems.push(orderItem);

        // 재고 차감
        await queryRunner.manager.update(Product, item.productId, {
          quantity: product.quantity - item.quantity
        });
      }

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // 3. 응답 데이터 구성
      const orderWithItems = await this.getOrderById(savedOrder.order_id);
      
      return orderWithItems;

    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 쿼리 러너 해제
      await queryRunner.release();
    }
  }

  async getOrderById(orderId: number): Promise<OrderResponse> {
    const order = await this.orderRepository.findOne({
      where: { order_id: orderId },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    return {
      orderId: order.order_id,
      orderDate: order.created_at,
      totalPrice: order.total_price,
      orderStatus: order.order_status,
      items: order.orderItems.map(item => ({
        productId: item.product_id,
        productName: item.product.product_name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.main_img,
        company: item.product.company,
      })),
    };
  }

  async getUserOrders(userId: number): Promise<OrderResponse[]> {
    const orders = await this.orderRepository.find({
      where: { user_id: userId },
      relations: ['orderItems', 'orderItems.product'],
      order: { created_at: 'DESC' },
    });

    return orders.map(order => ({
      orderId: order.order_id,
      orderDate: order.created_at,
      totalPrice: order.total_price,
      orderStatus: order.order_status,
      items: order.orderItems.map(item => ({
        productId: item.product_id,
        productName: item.product.product_name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.main_img,
        company: item.product.company,
      })),
    }));
  }
}
