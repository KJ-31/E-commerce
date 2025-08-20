import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';

// 토스페이먼츠 테스트 키 (문서용 - 실제 테스트 가능)
const TOSS_CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

export interface PaymentRequest {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  customerMobilePhone?: string;
}

export interface PaymentResult {
  paymentKey: string;
  orderId: string;
  amount: number;
}

class TossPaymentService {
  private tossPayments: any = null;
  private payment: any = null;

  // 토스페이먼츠 초기화 (결제창 방식)
  async initialize(customerKey?: string) {
    try {
      this.tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      
      // 비회원 결제 또는 회원 결제 설정
      const key = customerKey || ANONYMOUS;
      this.payment = this.tossPayments.payment({ customerKey: key });
      
      console.log('토스페이먼츠 초기화 완료 (결제창 방식)');
      return this.payment;
    } catch (error) {
      console.error('토스페이먼츠 초기화 오류:', error);
      throw error;
    }
  }

  // 결제 요청 (결제창 방식)
  async requestPayment(paymentData: PaymentRequest) {
    if (!this.payment) {
      throw new Error('토스페이먼츠가 초기화되지 않았습니다.');
    }

    try {
      const baseUrl = window.location.origin;
      
      await this.payment.requestPayment({
        method: "CARD", // 카드 결제
        amount: {
          currency: "KRW",
          value: paymentData.amount,
        },
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        customerName: paymentData.customerName || '고객',
        customerEmail: paymentData.customerEmail || '',
        customerMobilePhone: paymentData.customerMobilePhone || '',
        successUrl: `${baseUrl}/payment-success`,
        failUrl: `${baseUrl}/payment-fail`,
        // 카드 결제에 필요한 정보
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (error) {
      console.error('결제 요청 오류:', error);
      throw error;
    }
  }

  // 결제 승인
  async confirmPayment(paymentKey: string, orderId: string, amount: number) {
    try {
      const response = await fetch('http://localhost:3001/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '결제 승인에 실패했습니다.');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('결제 승인 오류:', error);
      throw error;
    }
  }
}

export const tossPaymentService = new TossPaymentService();
