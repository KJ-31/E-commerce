import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './services/product.service';
import { OrderService } from './services/order.service';
import { InquiryService } from './services/inquiry.service';
import { ProductController } from './controllers/product.controller';
import { OrderController } from './controllers/order.controller';
import { InquiryController } from './controllers/inquiry.controller';
import { Product } from './entities/product.entity';
import { Seller } from './entities/seller.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Inquiry } from './entities/inquiry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Seller, Order, OrderItem, Inquiry]),
  ],
  controllers: [
    ProductController,
    OrderController,
    InquiryController,
  ],
  providers: [
    ProductService,
    OrderService,
    InquiryService,
  ],
  exports: [
    ProductService,
    OrderService,
    InquiryService,
  ],
})
export class SellerModule {}