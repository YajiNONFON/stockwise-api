import z from "zod";

export const OrderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),

  quantity: z.number().positive("Quantity must be positive"),
});

export const CreateOrderDto = z.object({
  customerId: z.string().min(1, "Customer ID is required"),

  note: z
    .string()
    .max(500, "Note must not exceed 500 characters")
    .trim()
    .optional(),

  orderItems: z
    .array(OrderItemSchema)
    .min(1, "At least one line item is required"),
});

export const UpdateOrderDto = CreateOrderDto.partial();

export const UpdateOrderStatusDto = z.object({
  status: z.enum(["PENDING", "DELIVERED", "CANCELLED"]),
});

export type CreateOrderInput = z.infer<typeof CreateOrderDto>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderDto>;
export type OrderItemInput = z.infer<typeof OrderItemSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusDto>;
