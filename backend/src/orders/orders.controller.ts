import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import type { CreateOrderDto } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.ordersService.createOrder(createOrderDto);
      return {
        success: true,
        data: order,
        message: '주문이 성공적으로 완료되었습니다.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '주문 처리 중 오류가 발생했습니다.',
      };
    }
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string) {
    try {
      const order = await this.ordersService.getOrderById(parseInt(orderId));
      return {
        success: true,
        data: order,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '주문 정보를 찾을 수 없습니다.',
      };
    }
  }

  @Get('user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    try {
      const orders = await this.ordersService.getUserOrders(parseInt(userId));
      return {
        success: true,
        data: orders,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '주문 내역을 조회할 수 없습니다.',
      };
    }
  }
}
