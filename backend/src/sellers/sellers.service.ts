import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-images.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Seller } from '../entities/seller.entity';
import { Category } from '../entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getDashboard(sellerId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 판매자의 상품들
    const sellerProducts = await this.productRepository.find({
      where: { seller_id: sellerId }
    });
    const productIds = sellerProducts.map(p => p.product_id);

    // 상품이 없으면 빈 통계 반환
    if (productIds.length === 0) {
      return {
        todayStats: {
          views: 0,
          orders: 0,
          sales: 0,
          inquiries: 0
        },
        recentOrders: []
      };
    }

    // 오늘의 주문들 (판매자의 상품들만)
    const todayOrders = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.order', 'order')
      .where('orderItem.product_id IN (:...productIds)', { productIds })
      .andWhere('order.created_at >= :today', { today })
      .andWhere('order.created_at < :tomorrow', { tomorrow })
      .getMany();

    // 통계 계산
    const todayStats = {
      views: Math.floor(Math.random() * 2000) + 800, // 임시 조회수
      orders: todayOrders.length,
      sales: todayOrders.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
      inquiries: Math.floor(Math.random() * 10) + 1 // 임시 문의수
    };

    // 최근 주문들
    const recentOrders = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.order', 'order')
      .innerJoin('orderItem.product', 'product')
      .innerJoin('order.user', 'user')
      .select([
        'order.order_id as id',
        'product.product_name as product',
        'orderItem.price * orderItem.quantity as amount',
        'order.order_status as status',
        'order.created_at as time',
        'user.user_name as customer'
      ])
      .where('orderItem.product_id IN (:...productIds)', { productIds })
      .orderBy('order.created_at', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      todayStats,
      recentOrders: recentOrders.map(order => ({
        ...order,
        customer: order.customer ? order.customer.substring(0, 1) + '**' : '익명',
        time: this.getTimeAgo(order.time),
        statusColor: this.getStatusColor(order.status)
      }))
    };
  }

  async getSellerProducts(sellerId: number) {
    const products = await this.productRepository.find({
      where: { seller_id: sellerId },
      relations: ['category', 'productImages'],
      order: { created_at: 'DESC' }
    });

    return products.map(product => ({
      id: product.product_id,
      name: product.product_name,
      price: Number(product.product_price),
      stock: product.quantity,
      views: Math.floor(Math.random() * 2000) + 100, // 임시 조회수
      orders: Math.floor(Math.random() * 50) + 1, // 임시 주문수
      image: product.productImages?.[0]?.image_url || product.main_img || 'https://picsum.photos/seed/product/200/200',
      category: product.category?.category_name,
      description: product.description
    }));
  }

  async getSellerOrders(sellerId: number) {
    const sellerProducts = await this.productRepository.find({
      where: { seller_id: sellerId }
    });
    const productIds = sellerProducts.map(p => p.product_id);

    const orders = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.order', 'order')
      .innerJoin('orderItem.product', 'product')
      .innerJoin('order.user', 'user')
      .select([
        'order.order_id as id',
        'product.product_name as product',
        'orderItem.price * orderItem.quantity as amount',
        'order.order_status as status',
        'order.created_at as time',
        'user.user_name as customer'
      ])
      .where('orderItem.product_id IN (:...productIds)', { productIds })
      .orderBy('order.created_at', 'DESC')
      .limit(20)
      .getRawMany();

    return orders.map(order => ({
      ...order,
      customer: order.customer ? order.customer.substring(0, 1) + '**' : '익명',
      time: this.getTimeAgo(order.time),
      statusColor: this.getStatusColor(order.status)
    }));
  }

  async getSellerInquiries(sellerId: number) {
    // 임시 더미 데이터 (실제로는 별도 문의 테이블이 필요)
    return [
      {
        id: 1,
        customer: '김**',
        product: '상품 문의',
        subject: '배송 문의',
        message: '언제 배송되나요?',
        time: '1시간 전',
        isAnswered: false
      },
      {
        id: 2,
        customer: '이**',
        product: '상품 문의',
        subject: '교환 문의',
        message: '색상 교환이 가능한가요?',
        time: '3시간 전',
        isAnswered: true
      }
    ];
  }

  async createProduct(sellerId: number, createProductDto: CreateProductDto, images?: any[]) {
    console.log('=== Creating product ===');
    console.log('Seller ID:', sellerId);
    console.log('Product DTO:', createProductDto);
    console.log('Images count:', images?.length || 0);

    try {
      // 입력 데이터 검증
      if (!createProductDto.name || !createProductDto.price || !createProductDto.category) {
        throw new Error('필수 필드가 누락되었습니다. (이름, 가격, 카테고리)');
      }

      console.log('Looking for category:', createProductDto.category);

      // 카테고리 찾기 또는 생성
      let category = await this.categoryRepository.findOne({
        where: { category_name: createProductDto.category }
      });

      console.log('Found category:', category);

      if (!category) {
        console.log('Creating new category:', createProductDto.category);
        category = await this.categoryRepository.save({
          category_name: createProductDto.category
        });
        console.log('Created category:', category);
      }

      // 이미지 처리
      let mainImg = 'https://picsum.photos/seed/default/600/600';
      if (images && images.length > 0) {
        try {
          // 업로드 디렉토리 생성
          const uploadDir = path.join(process.cwd(), 'uploads', 'products');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          // 첫 번째 이미지를 메인 이미지로 저장
          const firstImage = images[0];
          const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
          const filePath = path.join(uploadDir, fileName);
          
          // 이미지 파일 저장
          fs.writeFileSync(filePath, firstImage.buffer);
          
          // 웹에서 접근 가능한 URL 생성
          mainImg = `/uploads/products/${fileName}`;
          console.log('Saved image to:', mainImg);
        } catch (error) {
          console.error('Image save error:', error);
          // 이미지 저장 실패 시 기본 이미지 사용
          mainImg = 'https://picsum.photos/seed/default/600/600';
        }
      }

      // 상품 생성
      const productData = {
        product_name: createProductDto.name,
        category_id: category.category_id,
        seller_id: Number(sellerId),
        product_price: Number(createProductDto.price),
        company: createProductDto.brand || '',
        description: createProductDto.description || '',
        quantity: Number(createProductDto.stock) || 0,
        main_img: mainImg
      };

      console.log('Creating product with data:', productData);

      const product = this.productRepository.create(productData);
      console.log('Created product entity:', product);

      const savedProduct = await this.productRepository.save(product);
      console.log('Saved product:', savedProduct);

      return {
        message: '상품이 성공적으로 등록되었습니다.',
        productId: savedProduct.product_id
      };
    } catch (error) {
      console.error('상품 등록 실패:', error);
      throw error;
    }
  }

  async deleteProducts(sellerId: number, productIds: number[]) {
    console.log('=== Deleting products ===');
    console.log('Seller ID:', sellerId);
    console.log('Product IDs to delete:', productIds);

    try {
      // 판매자 소유 확인 및 삭제
      const deleteResult = await this.productRepository
        .createQueryBuilder()
        .delete()
        .from(Product)
        .where('product_id IN (:...productIds)', { productIds })
        .andWhere('seller_id = :sellerId', { sellerId })
        .execute();

      console.log('Delete result:', deleteResult);

      if (deleteResult.affected === 0) {
        throw new Error('삭제할 수 있는 상품이 없습니다. 권한을 확인해주세요.');
      }

      return {
        message: `${deleteResult.affected}개의 상품이 성공적으로 삭제되었습니다.`,
        deletedCount: deleteResult.affected
      };
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      throw error;
    }
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}일 전`;
    }
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case '배송중':
        return 'bg-blue-100 text-blue-700';
      case '결제완료':
        return 'bg-yellow-100 text-yellow-700';
      case '배송완료':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}