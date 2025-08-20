export class ProductResponseDto {
  id: number;
  brand: string;
  name: string;
  price: number;
  sale: number;
  rating: string;
  img: string;
  tags: string[];
  description: string;
  category: string; // category_name을 문자열로 반환하므로 string 타입으로 정의
}
