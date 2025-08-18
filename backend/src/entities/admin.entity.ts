import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  admin_id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  admin_pw: string;

  @Column()
  admin_name: string;

  @Column({ nullable: true })
  admin_phone_num: string;

  @Column({ nullable: true })
  admin_addr: string;

  @CreateDateColumn()
  created_at: Date;
}
