import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  image_id: number;

  @Column()
  product_id: number;

  @Column()
  image_url: string;

  @Column({ default: 0 })
  image_order: number;

  @Column({ default: false })
  is_main: boolean;

  @ManyToOne(() => Product, product => product.productImages)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}