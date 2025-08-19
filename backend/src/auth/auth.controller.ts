import { Controller, Post, Body } from '@nestjs/common';
import { AuthService, SignUpDto, SellerSignUpDto, LoginDto } from './auth.service';

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
}
