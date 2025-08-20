import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

export interface ConfirmPaymentDto {
  paymentKey: string;
  orderId: string;
  amount: number;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 토스페이먼츠 결제 승인
  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    const { paymentKey, orderId, amount } = confirmPaymentDto;

    try {
      // 토스페이먼츠 시크릿 키 (테스트용) - 문서의 올바른 테스트 키
      const secretKey = 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6';
      const encodedKey = Buffer.from(`${secretKey}:`).toString('base64');

      // 토스페이먼츠 결제 승인 API 호출
      const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      });

      const responseText = await response.text();
      console.log('토스페이먼츠 응답:', responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText };
        }
        console.error('토스페이먼츠 결제 승인 실패:', errorData);
        
        return {
          success: false,
          message: `토스페이먼츠 결제 승인 실패: ${errorData.message || '알 수 없는 오류'}`,
        };
      }

      const paymentResult = JSON.parse(responseText);
      console.log('토스페이먼츠 결제 승인 성공:', paymentResult);

      return {
        success: true,
        data: {
          paymentKey: paymentResult.paymentKey,
          orderId: paymentResult.orderId,
          amount: paymentResult.totalAmount,
          status: paymentResult.status,
          method: paymentResult.method,
          approvedAt: paymentResult.approvedAt,
          receipt: paymentResult.receipt,
        },
        message: '결제가 성공적으로 완료되었습니다.',
      };

    } catch (error) {
      console.error('결제 승인 처리 오류:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '결제 승인 중 오류가 발생했습니다.',
      };
    }
  }

  // 결제 상태 조회
  async getPaymentStatus(paymentKey: string) {
    try {
      const secretKey = 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6';
      const encodedKey = Buffer.from(`${secretKey}:`).toString('base64');

      const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${encodedKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`결제 상태 조회 실패: ${errorData.message}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('결제 상태 조회 오류:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '결제 상태 조회 중 오류가 발생했습니다.',
      };
    }
  }

  // 결제 취소
  async cancelPayment(paymentKey: string, cancelReason: string, cancelAmount?: number) {
    try {
      const secretKey = 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6';
      const encodedKey = Buffer.from(`${secretKey}:`).toString('base64');

      const requestBody: any = {
        cancelReason,
      };

      if (cancelAmount) {
        requestBody.cancelAmount = cancelAmount;
      }

      const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`결제 취소 실패: ${errorData.message}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: '결제가 성공적으로 취소되었습니다.',
      };
    } catch (error) {
      console.error('결제 취소 오류:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '결제 취소 중 오류가 발생했습니다.',
      };
    }
  }
}
