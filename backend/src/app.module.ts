import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyPageModule } from './mypage/mypage.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SellersModule } from './sellers/sellers.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'postgres',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER || 'user',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // 개발 중에만 true로 설정
      logging: process.env.NODE_ENV === 'development',
    }),
    MyPageModule,
    AuthModule,
    ProductsModule,
    SellersModule,
    OrdersModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
