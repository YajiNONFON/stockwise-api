import z from "zod";

export const ReportFilterDto = z.object({
  period: z.enum(["today", "week", "month"]).optional(),
  status: z.enum(["PENDING", "DELIVERED", "CANCELLED"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type ReportFilterInput = z.infer<typeof ReportFilterDto>;
