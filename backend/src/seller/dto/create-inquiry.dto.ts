import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsNumber()
  sellerId: number;
}