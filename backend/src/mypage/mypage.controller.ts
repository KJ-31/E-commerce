import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MyPageService } from './mypage.service';

// 임시 가드 (실제로는 JWT 가드 사용)
@Controller('mypage')
export class MyPageController {
  constructor(private readonly myPageService: MyPageService) {}

  // 사용자 정보 조회
  @Get('user-info')
  async getUserInfo(@Request() req) {
    // 실제로는 JWT 토큰에서 userId를 추출
    const userId = req.user?.userId || 1; // 임시로 user_id = 1 사용
    return await this.myPageService.getUserInfo(userId);
  }

  // 주문 통계 조회
  @Get('order-stats')
  async getOrderStats(@Request() req) {
    const userId = req.user?.userId || 1;
    return await this.myPageService.getOrderStats(userId);
  }

  // 최근 주문 내역 조회
  @Get('recent-orders')
  async getRecentOrders(@Request() req, @Query('limit') limit?: number) {
    const userId = req.user?.userId || 1;
    return await this.myPageService.getRecentOrders(userId, limit);
  }

  // 주문 상세 정보 조회
  @Get('orders/:orderId')
  async getOrderDetail(@Request() req, @Param('orderId') orderId: number) {
    const userId = req.user?.userId || 1;
    return await this.myPageService.getOrderDetail(userId, orderId);
  }

  // 주문 상태별 주문 목록 조회
  @Get('orders')
  async getOrdersByStatus(@Request() req, @Query('status') status: string) {
    const userId = req.user?.userId || 1;
    return await this.myPageService.getOrdersByStatus(userId, status);
  }

  // 사용자 혜택 정보 조회
  @Get('benefits')
  async getUserBenefits(@Request() req) {
    const userId = req.user?.userId || 1;
    return await this.myPageService.getUserBenefits(userId);
  }

  // 찜한 상품 목록 조회
  @Get('wishlist')
  async getWishlist(@Request() req) {
    const userId = req.user?.userId || 1;
    return await this.myPageService.getWishlist(userId);
  }

  // 최근 본 상품 목록 조회
  @Get('recently-viewed')
  async getRecentlyViewed(@Request() req) {
    const userId = req.user?.userId || 1;
    return await this.myPageService.getRecentlyViewed(userId);
  }

  // 마이페이지 전체 정보 조회 (한 번에 모든 정보)
  @Get('dashboard')
  async getDashboard(@Request() req, @Query('userId') userId?: number) {
    const targetUserId = userId || req.user?.userId || 1;
    
    const [userInfo, orderStats, recentOrders, benefits] = await Promise.all([
      this.myPageService.getUserInfo(targetUserId),
      this.myPageService.getOrderStats(targetUserId),
      this.myPageService.getRecentOrders(targetUserId, 3),
      this.myPageService.getUserBenefits(targetUserId)
    ]);

    return {
      userInfo,
      orderStats,
      recentOrders,
      benefits,
      timestamp: new Date().toISOString()
    };
  }
}
