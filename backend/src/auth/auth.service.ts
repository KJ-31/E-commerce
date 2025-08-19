import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Seller } from '../entities/seller.entity';

export class SignUpDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export class SellerSignUpDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  companyName?: string;
  businessNumber?: string;
  companyPhone?: string;
  companyAddress?: string;
}

export class LoginDto {
  email: string;
  password: string;
  userType: 'user' | 'seller';
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
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

    if (userType === 'seller') {
      // 셀러 로그인
      const seller = await this.sellerRepository.findOne({ where: { email } });
      if (!seller) {
        throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      // 테스트용: 실제 해시가 아닌 경우 문자열 비교
      let isPasswordValid = false;
      if (seller.seller_pw.startsWith('$2b$') || seller.seller_pw.startsWith('$2a$')) {
        isPasswordValid = await bcrypt.compare(password, seller.seller_pw);
      } else {
        isPasswordValid = password === seller.seller_pw;
      }
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      return {
        message: '로그인 성공',
        user: {
          user_id: seller.seller_id,
          email: seller.email,
          user_name: seller.seller_name,
          user_phone_num: seller.seller_phone_num,
          user_addr: seller.seller_addr,
          type: 'seller'
        }
      };
    } else {
      // 일반 사용자 로그인
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      // 테스트용: 실제 해시가 아닌 경우 문자열 비교
      let isPasswordValid = false;
      if (user.user_pw.startsWith('$2b$') || user.user_pw.startsWith('$2a$')) {
        isPasswordValid = await bcrypt.compare(password, user.user_pw);
      } else {
        isPasswordValid = password === user.user_pw;
      }
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      return {
        message: '로그인 성공',
        user: {
          user_id: user.user_id,
          email: user.email,
          user_name: user.user_name,
          user_phone_num: user.user_phone_num,
          user_addr: user.user_addr,
          type: 'user'
        }
      };
    }
  }
}
