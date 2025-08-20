import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn()
  seller_id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  seller_pw: string;

  @Column()
  seller_name: string;

  @Column({ nullable: true })
  seller_phone_num: string;

  @Column({ nullable: true })
  seller_addr: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ nullable: true })
  business_number: string;

  @Column({ nullable: true })
  company_phone: string;

  @Column({ nullable: true })
  company_addr: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}