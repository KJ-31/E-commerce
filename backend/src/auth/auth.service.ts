import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Seller } from '../entities/seller.entity';
import { JwtService } from '@nestjs/jwt'; // New import

import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { SellerSignUpDto } from './dto/seller-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    private jwtService: JwtService, // New injection
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, name, phone, address } = signUpDto;

    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = this.userRepository.create({
      email,
      user_pw: hashedPassword,
      user_name: name,
      user_phone_num: phone,
      user_addr: address,
    });

    await this.userRepository.save(user);
    return { message: '회원가입이 완료되었습니다.' };
  }

  async sellerSignUp(sellerSignUpDto: SellerSignUpDto) {
    const { 
      email, 
      password, 
      name, 
      phone, 
      address, 
      companyName, 
      businessNumber, 
      companyPhone, 
      companyAddress 
    } = sellerSignUpDto;

    // 이메일 중복 확인
    const existingSeller = await this.sellerRepository.findOne({ where: { email } });
    if (existingSeller) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 셀러 생성
    const seller = this.sellerRepository.create({
      email,
      seller_pw: hashedPassword,
      seller_name: name,
      seller_phone_num: phone,
      seller_addr: address,
      company_name: companyName,
      business_number: businessNumber,
      company_phone: companyPhone,
      company_addr: companyAddress,
    });

    await this.sellerRepository.save(seller);
    return { message: '셀러 회원가입이 완료되었습니다.' };
  }

  async login(loginDto: LoginDto) {
    const { email, password, userType } = loginDto;

    let user: User | Seller | null = null;
    let payload: { sub: number; email: string; type: string; name: string };

    if (userType === 'seller') {
      user = await this.sellerRepository.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.seller_pw);
      if (!isPasswordValid) {
        throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      payload = { sub: user.seller_id, email: user.email, type: 'seller', name: user.seller_name };
    } else {
      user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.user_pw);
      if (!isPasswordValid) {
        throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      payload = { sub: user.user_id, email: user.email, type: 'user', name: user.user_name };
    }

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
