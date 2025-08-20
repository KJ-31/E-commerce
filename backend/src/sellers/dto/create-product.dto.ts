export class CreateProductDto {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  brand?: string;
}