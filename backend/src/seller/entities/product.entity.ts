import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Seller } from './seller.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column()
  category: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ nullable: true })
  brand: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  views: number;

  @ManyToOne(() => Seller, seller => seller.products)
  seller: Seller;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
