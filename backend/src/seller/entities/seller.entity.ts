import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  businessName: string;

  @Column()
  businessNumber: string;

  @Column()
  contactNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Product, product => product.seller)
  products: Product[];

  @OneToMany(() => Order, order => order.seller)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;
}