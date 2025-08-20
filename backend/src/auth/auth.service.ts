import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Admin } from '../entities/admin.entity';
import { Seller } from '../entities/seller.entity';
import { SignUpDto, SellerSignUpDto, LoginDto } from './auth.controller';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
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
    console.log('Received seller signup data:', sellerSignUpDto);
    
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

    try {
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

      console.log('Created seller entity:', seller);

      const savedSeller = await this.sellerRepository.save(seller);
      console.log('Saved seller successfully:', savedSeller.seller_id);
      
      return { message: '셀러 회원가입이 완료되었습니다.' };
    } catch (error) {
      console.error('Seller signup error:', error);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password, userType } = loginDto;
    console.log('=== Login attempt ===');
    console.log('Email:', email);
    console.log('UserType:', userType);
    
    if (userType === 'seller') {
      // 판매자 로그인
      console.log('Attempting seller login...');
      const seller = await this.sellerRepository.findOne({
        where: { email }
      });

      console.log('Found seller:', seller ? 'YES' : 'NO');
      if (seller) {
        console.log('Seller ID:', seller.seller_id);
        console.log('Seller Email:', seller.email);
        console.log('Stored password hash:', seller.seller_pw);
        
        const isPasswordValid = await bcrypt.compare(password, seller.seller_pw);
        console.log('Password valid:', isPasswordValid);
        
        if (isPasswordValid) {
          const { seller_pw, ...sellerWithoutPassword } = seller;
          return { 
            user: {
              id: seller.seller_id,
              email: seller.email,
              name: seller.seller_name,
              type: 'seller'
            }
          };
        }
      }
    } else {
      // 일반 사용자 로그인
      const user = await this.userRepository.findOne({
        where: { email }
      });

      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.user_pw);
        if (isPasswordValid) {
          const { user_pw, ...userWithoutPassword } = user;
          return { 
            user: {
              id: user.user_id,
              email: user.email,
              name: user.user_name,
              type: 'user'
            }
          };
        }
      }
    }

    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }
}
