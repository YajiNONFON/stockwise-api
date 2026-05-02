import z from "zod";

export const UpdateUserDto = z.object({
  name: z.string().min(2).max(50).trim().optional(),
  avatar: z.string().url("Invalid URL").optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateUserDto>;
