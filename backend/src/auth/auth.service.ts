import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Admin } from '../entities/admin.entity';
import { Seller } from '../entities/seller.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { SellerSignUpDto } from './dto/seller-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, name, phone, address } = signUpDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new ConflictException('이미 존재하는 이메일입니다.');

    const hashedPassword = await bcrypt.hash(password, 10);
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
      companyAddress,
    } = sellerSignUpDto;

    const existingSeller = await this.sellerRepository.findOne({ where: { email } });
    if (existingSeller) throw new ConflictException('이미 존재하는 이메일입니다.');

    const hashedPassword = await bcrypt.hash(password, 10);
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

    let payload: { sub: number; email: string; type: string; name: string };

    if (userType === 'seller') {
      const seller = await this.sellerRepository.findOne({ where: { email } });
      if (!seller) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

      const isPasswordValid = await bcrypt.compare(password, seller.seller_pw);
      if (!isPasswordValid) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

      payload = { sub: seller.seller_id, email: seller.email, type: 'seller', name: seller.seller_name };
    } else {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

      const isPasswordValid = await bcrypt.compare(password, user.user_pw);
      if (!isPasswordValid) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

      payload = { sub: user.user_id, email: user.email, type: 'user', name: user.user_name };
    }

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
