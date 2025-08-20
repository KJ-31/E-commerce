import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport'; // New import
import { JwtModule } from '@nestjs/jwt'; // New import
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { Admin } from '../entities/admin.entity';
import { Seller } from '../entities/seller.entity';
import { JwtStrategy } from './jwt.strategy'; // New import

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin, Seller]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // New line
    JwtModule.register({
      secret: 'yourSecretKey', // TODO: Use environment variable
      signOptions: { expiresIn: '1h' },
    }), // New line
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Add JwtStrategy
  exports: [AuthService], // Export AuthService for use in other modules if needed
})
export class AuthModule {}
