import { z } from "zod";

export const parseDescriptionSchema = z.object({
  description: z.string().min(10, "Job description must be at least 10 characters").max(10000),
});
