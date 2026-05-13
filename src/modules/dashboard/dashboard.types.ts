export interface RevenueStats {
  real: number;
  potential: number;
  conversionRate: number;
}

export interface OrderStats {
  total: number;
  pending: number;
  delivered: number;
  cancelled: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  category: string | null;
  totalQuantity: number;
  totalRevenue: number;
}

export interface CriticalStock {
  productId: string;
  productName: string;
  stockAvailable: number;
  alertThreshold: number;
}

export interface DashboardResponse {
  period: "today" | "week" | "month";
  revenue: RevenueStats;
  orders: OrderStats;
  topProducts: TopProduct[];
  criticalStock: CriticalStock[];
  activeCustomers: number;
}
