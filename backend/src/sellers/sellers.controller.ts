import { Controller, Get, Post, Delete, Body, Param, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SellersService } from './sellers.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get(':sellerId/dashboard')
  async getDashboard(@Param('sellerId') sellerId: number) {
    return await this.sellersService.getDashboard(sellerId);
  }

  @Get(':sellerId/products')
  async getSellerProducts(@Param('sellerId') sellerId: number) {
    return await this.sellersService.getSellerProducts(sellerId);
  }

  @Get(':sellerId/orders')
  async getSellerOrders(@Param('sellerId') sellerId: number) {
    return await this.sellersService.getSellerOrders(sellerId);
  }

  @Get(':sellerId/inquiries')
  async getSellerInquiries(@Param('sellerId') sellerId: number) {
    return await this.sellersService.getSellerInquiries(sellerId);
  }

  @Post(':sellerId/products')
  @UseInterceptors(FilesInterceptor('images', 10))
  async createProduct(
    @Param('sellerId') sellerId: number,
    @Body() body: any,
    @UploadedFiles() images?: any[]
  ) {
    console.log('Received product creation request for seller:', sellerId);
    console.log('Body:', body);
    console.log('Images:', images?.length || 0, 'files');
    
    try {
      // FormData에서 productData 파싱
      let createProductDto: CreateProductDto;
      if (body.productData) {
        createProductDto = JSON.parse(body.productData);
      } else {
        createProductDto = body;
      }
      
      console.log('Parsed product data:', createProductDto);
      
      const result = await this.sellersService.createProduct(sellerId, createProductDto, images);
      console.log('Product creation successful:', result);
      return result;
    } catch (error) {
      console.error('Product creation failed:', error);
      throw error;
    }
  }

  @Delete(':sellerId/products')
  async deleteProducts(
    @Param('sellerId') sellerId: number,
    @Body() body: { productIds: number[] }
  ) {
    console.log('Received product deletion request for seller:', sellerId);
    console.log('Product IDs to delete:', body.productIds);
    
    try {
      const result = await this.sellersService.deleteProducts(sellerId, body.productIds);
      console.log('Product deletion successful:', result);
      return result;
    } catch (error) {
      console.error('Product deletion failed:', error);
      throw error;
    }
  }
}