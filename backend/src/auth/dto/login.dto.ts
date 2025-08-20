import { IsString, IsNotEmpty, Matches, IsEnum } from 'class-validator';

export enum UserType {
  GENERAL = 'general',    // 일반 사용자
  SELLER = 'seller'       // 셀러
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;

}
