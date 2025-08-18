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
import { InquiryService } from '../services/inquiry.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('seller/inquiries')
@UseGuards(JwtAuthGuard)
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Get()
  findAll(@Request() req) {
    return this.inquiryService.findAllBySeller(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.inquiryService.findOne(id, req.user.id);
  }

  @Patch(':id/answer')
  answer(
    @Param('id', ParseIntPipe) id: number,
    @Body('answer') answer: string,
    @Request() req,
  ) {
    return this.inquiryService.answer(id, answer, req.user.id);
  }
}
