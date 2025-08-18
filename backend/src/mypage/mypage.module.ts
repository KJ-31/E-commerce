import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyPageController } from './mypage.controller';
import { MyPageService } from './mypage.service';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, OrderItem, Product, Category])
  ],
  controllers: [MyPageController],
  providers: [MyPageService],
  exports: [MyPageService]
})
export class MyPageModule {}
