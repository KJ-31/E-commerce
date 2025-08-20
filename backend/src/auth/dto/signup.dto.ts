import { IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsOptional } from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[^0-9]+$/, { message: 'Name should not contain numbers' })
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}