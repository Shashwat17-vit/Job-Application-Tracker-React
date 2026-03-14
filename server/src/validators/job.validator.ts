import { z } from "zod";

const jobStatusEnum = z.enum([
  "WISHLIST",
  "APPLIED",
  "PHONE_SCREEN",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
]);

export const createJobSchema = z.object({
  company: z.string().min(1, "Company is required").max(200),
  role: z.string().min(1, "Role is required").max(200),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  salary: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  status: jobStatusEnum.optional(),
});

export const updateJobSchema = z.object({
  company: z.string().min(1).max(200).optional(),
  role: z.string().min(1).max(200).optional(),
  url: z.string().url().nullable().optional(),
  salary: z.string().max(100).nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  status: jobStatusEnum.optional(),
  appliedAt: z.string().datetime().nullable().optional(),
});

export const updateStatusSchema = z.object({
  status: jobStatusEnum,
});

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      status: jobStatusEnum,
      order: z.number().int().min(0),
    })
  ),
});
