import { Controller, Post, Body, UseGuards, Get, Request, HttpException, HttpStatus } from '@nestjs/common'; // Modified
import { AuthGuard } from '@nestjs/passport'; // New import
import { AuthService, SignUpDto, SellerSignUpDto, LoginDto } from './auth.service';

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

export class LoginDto {
  email: string;
  password: string;
  userType?: 'user' | 'seller';
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Post('seller-signup')
  async sellerSignUp(@Body() sellerSignUpDto: SellerSignUpDto) {
    return await this.authService.sellerSignUp(sellerSignUpDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt')) // New line
  @Get('profile') // New line
  getProfile(@Request() req) { // New line
    return req.user; // New line
  } // New line
}
