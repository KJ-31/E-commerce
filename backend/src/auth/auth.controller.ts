import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

export class SignUpDto {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
}

export class SellerSignUpDto extends SignUpDto {
  companyName: string;
  businessNumber: string;
  companyPhone: string;
  companyAddress: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const result = await this.authService.signUp(signUpDto);
      return {
        success: true,
        message: '회원가입이 완료되었습니다.',
        data: result
      };
    } catch (error) {
      throw new HttpException(
        error.message || '회원가입에 실패했습니다.',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('seller-signup')
  async sellerSignUp(@Body() sellerSignUpDto: SellerSignUpDto) {
    try {
      const result = await this.authService.sellerSignUp(sellerSignUpDto);
      return {
        success: true,
        message: '셀러 회원가입이 완료되었습니다.',
        data: result
      };
    } catch (error) {
      throw new HttpException(
        error.message || '셀러 회원가입에 실패했습니다.',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
