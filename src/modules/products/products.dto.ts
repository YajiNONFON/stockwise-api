import z from "zod";

export const CreateProductDto = z.object({
  name: z.string().min(2).max(50).trim(),
  photo: z.string().url("Invalid Photo URL").optional(),
  price: z.number().min(0, "Price must be positive"),
  stockTotal: z.number().int().min(0, "Stock must be positive"),
  alertThreshold: z.number().int().min(0).optional(),
  category: z.string().max(50).optional(),
});

export const UpdateProductDto = CreateProductDto.partial();

export type CreateProductInput = z.infer<typeof CreateProductDto>;
export type UpdateProductInput = z.infer<typeof UpdateProductDto>;
