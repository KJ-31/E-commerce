import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export enum SearchType {
  PRODUCT = 'product',
  ORDER = 'order',
  CUSTOMER = 'customer',
}

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(SearchType)
  type?: SearchType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}