import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common'; // Modified
import { AuthGuard } from '@nestjs/passport'; // New import
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SellerSignUpDto } from './dto/seller-signup.dto';
import { LoginDto } from './dto/login.dto';

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
