import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { Seller } from './seller.entity';

@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column('text', { nullable: true })
  answer: string;

  @Column({ default: false })
  isAnswered: boolean;

  @ManyToOne(() => Product, { nullable: true })
  product: Product;

  @ManyToOne(() => Seller, { nullable: true })
  seller: Seller;

  @CreateDateColumn()
  createdAt: Date;
}