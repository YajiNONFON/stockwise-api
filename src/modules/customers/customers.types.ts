export interface CustomerResponse {
  id: string;
  userId: string;
  name: string | null;
  whatsapp: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CustomerListResponse {
  data: CustomerResponse[];
  total: number;
}
