import { Controller, Get, Query } from '@nestjs/common';
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
}
