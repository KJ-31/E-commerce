export class CreateProductDto {
  title: string;
  price: number;
  originalPrice?: number;
  description?: string;
  brand: string;
  seller: string;
  category: string;
  stock: number;
  specifications?: Record<string, any>;
  images?: Array<{ imageUrl: string; order: number; isMain: boolean }>;
}

export class UpdateProductDto extends CreateProductDto {}