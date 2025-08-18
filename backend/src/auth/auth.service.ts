import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Admin } from '../entities/admin.entity';
import { SignUpDto, SellerSignUpDto } from './auth.controller';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({
      where: { email: signUpDto.email }
    });

    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    // 새 사용자 생성
    const newUser = this.userRepository.create({
      email: signUpDto.email,
      user_pw: hashedPassword,
      user_name: signUpDto.name,
      user_phone_num: signUpDto.phone,
      user_addr: signUpDto.address,
    });

    const savedUser = await this.userRepository.save(newUser);

    // 비밀번호는 제외하고 반환
    const { user_pw, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async sellerSignUp(sellerSignUpDto: SellerSignUpDto) {
    // 이메일 중복 확인 (관리자 테이블에서도 확인)
    const existingUser = await this.userRepository.findOne({
      where: { email: sellerSignUpDto.email }
    });

    const existingAdmin = await this.adminRepository.findOne({
      where: { email: sellerSignUpDto.email }
    });

    if (existingUser || existingAdmin) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(sellerSignUpDto.password, 10);

    // 새 관리자(셀러) 생성
    const newAdmin = this.adminRepository.create({
      email: sellerSignUpDto.email,
      admin_pw: hashedPassword,
      admin_name: sellerSignUpDto.name,
      admin_phone_num: sellerSignUpDto.phone,
      admin_addr: sellerSignUpDto.address,
    });

    const savedAdmin = await this.adminRepository.save(newAdmin);

    // 비밀번호는 제외하고 반환
    const { admin_pw, ...adminWithoutPassword } = savedAdmin;
    return adminWithoutPassword;
  }
}
