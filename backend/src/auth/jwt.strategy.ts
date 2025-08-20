import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service'; // Assuming AuthService can validate user based on payload

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'yourSecretKey', // TODO: Use environment variable
    });
  }

  async validate(payload: any) {
    // In a real application, you would fetch the user from the database
    // using the payload (e.g., payload.sub which is typically the user ID)
    // and return the user object.
    // For now, we'll just return the payload.
    // const user = await this.authService.validateUserById(payload.sub);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
    return payload; // For simplicity, returning the payload directly
  }
}
