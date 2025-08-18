export interface SalesStatsDto {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: number;
    productName: string;
    sales: number;
    quantity: number;
  }>;
}