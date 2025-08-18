import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { Review } from '../entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_DATABASE', '11st_clone'),
        entities: [Product, ProductImage, Review],
        synchronize: configService.get('NODE_ENV') !== 'production', // 개발환경에서만 true
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

// src/database/seeds/product.seed.ts
import { DataSource } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductImage } from '../../entities/product-image.entity';

export const seedProducts = async (dataSource: DataSource) => {
  const productRepository = dataSource.getRepository(Product);
  const imageRepository = dataSource.getRepository(ProductImage);

  // 기존 데이터 삭제 (개발용)
  await imageRepository.delete({});
  await productRepository.delete({});

  const sampleProducts = [
    {
      title: '해외 2022 애플 맥북 에어 M2 칩 13인치 8GB RAM 512GB SSD 스페이스 그레이',
      price: 1540600,
      originalPrice: 1800000,
      description: 'Apple M2 칩이 탑재된 13인치 MacBook Air. 뛰어난 성능과 긴 배터리 수명을 자랑합니다.',
      brand: 'Apple',
      seller: '해외쇼핑',
      category: '노트북/PC',
      stock: 8,
      rating: 4.5,
      reviewCount: 127,
      likeCount: 245,
      specifications: {
        '상품상태': '해외직구',
        '상품번호': '8252396291',
        '배송방법': '(해외직구제품)택배',
        '배송가능지역': '전국',
        'A/S안내': '상세페이지 참조',
        '브랜드': 'Apple',
        '모델명': 'MacBook Air M2',
        '화면크기': '13.6인치',
        'CPU': 'Apple M2',
        'RAM': '8GB',
        '저장용량': '512GB SSD',
        '운영체제': 'macOS',
        '색상': '스페이스 그레이'
      },
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', order: 0, isMain: true },
        { imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800', order: 1, isMain: false },
        { imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', order: 2, isMain: false }
      ]
    },
    {
      title: '2023 삼성 갤럭시북3 프로 16인치 Intel i7 32GB 1TB SSD',
      price: 2150000,
      originalPrice: 2500000,
      description: '강력한 성능의 16인치 프리미엄 노트북. 창작과 업무에 최적화된 고성능 모델입니다.',
      brand: 'Samsung',
      seller: '삼성전자',
      category: '노트북/PC',
      stock: 15,
      rating: 4.7,
      reviewCount: 89,
      likeCount: 156,
      specifications: {
        '상품상태': '신품',
        '브랜드': 'Samsung',
        '모델명': 'Galaxy Book3 Pro',
        '화면크기': '16인치',
        'CPU': 'Intel Core i7-1360P',
        'RAM': '32GB',
        '저장용량': '1TB SSD',
        '운영체제': 'Windows 11',
        '색상': '그라파이트'
      },
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', order: 0, isMain: true },
        { imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800', order: 1, isMain: false }
      ]
    },
    {
      title: 'LG 그램 17인치 울트라 슬림 노트북 i5 16GB 512GB',
      price: 1299000,
      originalPrice: 1490000,
      description: '초경량 17인치 대화면 노트북. 휴대성과 넓은 화면을 동시에 제공합니다.',
      brand: 'LG',
      seller: 'LG전자',
      category: '노트북/PC',
      stock: 12,
      rating: 4.3,
      reviewCount: 234,
      likeCount: 89,
      specifications: {
        '상품상태': '신품',
        '브랜드': 'LG',
        '모델명': 'gram 17',
        '화면크기': '17인치',
        'CPU': 'Intel Core i5-1340P',
        'RAM': '16GB',
        '저장용량': '512GB SSD',
        '운영체제': 'Windows 11',
        '색상': '스노우 화이트',
        '무게': '1.35kg'
      },
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800', order: 0, isMain: true }
      ]
    },
    {
      title: 'HP 엘리트북 14인치 비즈니스 노트북 i7 16GB 512GB',
      price: 1890000,
      originalPrice: null,
      description: '기업용 보안 기능이 강화된 비즈니스 노트북. 내구성과 보안을 중시하는 사용자에게 적합합니다.',
      brand: 'HP',
      seller: 'HP코리아',
      category: '노트북/PC',
      stock: 6,
      rating: 4.2,
      reviewCount: 156,
      likeCount: 67,
      specifications: {
        '상품상태': '신품',
        '브랜드': 'HP',
        '모델명': 'EliteBook 840 G9',
        '화면크기': '14인치',
        'CPU': 'Intel Core i7-1255U',
        'RAM': '16GB',
        '저장용량': '512GB SSD',
        '운영체제': 'Windows 11 Pro',
        '색상': '실버',
        '보안': 'TPM 2.0, 지문인식'
      },
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800', order: 0, isMain: true }
      ]
    }
  ];

  // 상품 데이터 저장
  for (const productData of sampleProducts) {
    const { images, ...productInfo } = productData;
    
    const product = productRepository.create(productInfo);
    const savedProduct = await productRepository.save(product);

    // 이미지 데이터 저장
    for (const imageData of images) {
      const image = imageRepository.create({
        ...imageData,
        product: savedProduct
      });
      await imageRepository.save(image);
    }
  }

  console.log('샘플 상품 데이터가 성공적으로 추가되었습니다.');
};

// src/database/seeds/run-seed.ts
import { DataSource } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductImage } from '../../entities/product-image.entity';
import { Review } from '../../entities/review.entity';
import { seedProducts } from './product.seed';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || '11st_clone',
  entities: [Product, ProductImage, Review],
  synchronize: true,
});

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('데이터베이스 연결 성공');
    
    await seedProducts(AppDataSource);
    
    console.log('시드 데이터 작업이 완료되었습니다.');
  } catch (error) {
    console.error('시드 데이터 작업 중 오류 발생:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds();