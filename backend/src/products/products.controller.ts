import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get('search')
  async searchProducts(@Query('q') query: string) {
    if (!query) {
      return [];
    }
    return this.productsService.searchProducts(query);
  }
}