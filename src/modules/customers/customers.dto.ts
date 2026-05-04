import z from "zod";

export const CustomerBase = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .trim()
    .optional(),

  whatsapp: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,20}$/, "Invalid phone number format")
    .optional(),

  notes: z
    .string()
    .max(500, "Notes must not exceed 500 characters")
    .trim()
    .optional(),
});

export const CreateCustomerDto = CustomerBase.refine(
  (data) => data.name || data.whatsapp,
  { message: "Customer must have at least a name or a WhatsApp number" },
);

export const UpdateCustomerDto = CustomerBase.partial();

export type CreateCustomerInput = z.infer<typeof CreateCustomerDto>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerDto>;
