import { OrderStatus } from "../../../generated/prisma/enums";

export interface OrderItemResponse {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponse {
  id: string;
  userId: string;
  customerId: string;
  orderNumber: string;
  status: OrderStatus;
  note: string | null;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  orderItems: OrderItemResponse[];
  customer: {
    id: string;
    name: string;
  };
}

export interface OrderListResponse {
  data: OrderResponse[];
  total: number;
}
