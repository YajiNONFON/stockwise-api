export interface ProductResponses {
  id: string;
  userId: string;
  name: string;
  photo: string | null;
  price: number;
  stockTotal: number;
  stockReserved: number;
  alertThreshold: number | null;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ProductListResponse {
  data: ProductResponses[];
  total: number;
}
