import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { ProductImage } from './product-images.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  product_name: string;

  @Column()
  category_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  product_price: number;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  quantity: number;

  @Column({ nullable: true })
  main_img: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ProductImage, productImage => productImage.product)
  productImages: ProductImage[];
}
