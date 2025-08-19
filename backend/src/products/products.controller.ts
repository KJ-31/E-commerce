import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query('sort') sort?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: number
  ) {
    return await this.productsService.getProducts(sort, search, limit);
  }

  @Get('featured')
  async getFeaturedProducts() {
    return await this.productsService.getFeaturedProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    const product = await this.productsService.getProductById(id);
    if (!product) {
      throw new NotFoundException(`ID가 ${id}인 상품을 찾을 수 없습니다.`);
    }
    return product;
}
}
