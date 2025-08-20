import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { ConfirmPaymentDto } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // 결제 승인
  @Post('confirm')
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    try {
      console.log('결제 승인 요청:', confirmPaymentDto);
      const result = await this.paymentsService.confirmPayment(confirmPaymentDto);
      console.log('결제 승인 응답:', result);
      return result;
    } catch (error) {
      console.error('결제 승인 컨트롤러 오류:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '결제 승인 중 오류가 발생했습니다.',
      };
    }
  }

  // 결제 상태 조회
  @Get('status/:paymentKey')
  async getPaymentStatus(@Param('paymentKey') paymentKey: string) {
    try {
      const result = await this.paymentsService.getPaymentStatus(paymentKey);
      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '결제 상태 조회 중 오류가 발생했습니다.',
      };
    }
  }

  // 결제 취소
  @Post('cancel/:paymentKey')
  async cancelPayment(
    @Param('paymentKey') paymentKey: string,
    @Body() body: { cancelReason: string; cancelAmount?: number }
  ) {
    try {
      const result = await this.paymentsService.cancelPayment(
        paymentKey,
        body.cancelReason,
        body.cancelAmount
      );
      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '결제 취소 중 오류가 발생했습니다.',
      };
    }
  }
}
