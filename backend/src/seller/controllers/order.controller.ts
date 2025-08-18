import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { UpdateOrderStatusDto } from '../dto/order-status.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('seller/orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(@Request() req) {
    return this.orderService.findAllBySeller(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.orderService.findOne(id, req.user.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Request() req,
  ) {
    return this.orderService.updateStatus(id, updateOrderStatusDto, req.user.id);
  }
}