import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { Review } from './review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column('decimal', { precision: 10, scale: 0 })
  price: number;

  @Column('decimal', { precision: 10, scale: 0, nullable: true })
  originalPrice?: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 100 })
  brand: string;

  @Column({ length: 100 })
  seller: string;

  @Column({ length: 50 })
  category: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column('int', { default: 0 })
  reviewCount: number;

  @Column('int', { default: 0 })
  likeCount: number;

  @Column('json', { nullable: true })
  specifications: Record<string, any>;

  @Column({ length: 50, default: 'available' })
  status: string;

  @Column('int', { default: 0 })
  viewCount: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => ProductImage, image => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// src/entities/product-image.entity.ts
@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  imageUrl: string;

  @Column('int', { default: 0 })
  order: number;

  @Column({ type: 'boolean', default: false })
  isMain: boolean;

  @ManyToOne(() => Product, product => product.images, { onDelete: 'CASCADE' })
  product: Product;
}

// src/entities/review.entity.ts
@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  userName: string;

  @Column('int')
  rating: number;

  @Column('text')
  content: string;

  @Column('json', { nullable: true })
  images: string[];

  @ManyToOne(() => Product, product => product.reviews, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}