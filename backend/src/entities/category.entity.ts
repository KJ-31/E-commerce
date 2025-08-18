import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  category_name: string;

  @Column({ nullable: true })
  parent_category_id: number;

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
