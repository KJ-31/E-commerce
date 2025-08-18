import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

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
