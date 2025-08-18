import { IsString, IsEmail } from 'class-validator';

export class CreateSellerDto {
  @IsEmail()
  email: string;

  @IsString()
  businessName: string;

  @IsString()
  businessNumber: string;

  @IsString()
  contactNumber: string;
}