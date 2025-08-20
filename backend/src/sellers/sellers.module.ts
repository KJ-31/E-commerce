import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from '../entities/seller.entity';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-images.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Category } from '../entities/category.entity';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Seller,
      Product,
      ProductImage,
      Order,
      OrderItem,
      Category
    ])
  ],
  controllers: [SellersController],
  providers: [SellersService],
  exports: [TypeOrmModule]
})
export class SellersModule {}