import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
      synchronize: process.env.NODE_ENV === 'development', // 개발 환경에서만 true
      logging: process.env.NODE_ENV === 'development',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
