import { z } from "zod";

const activityTypeEnum = z.enum([
  "NOTE",
  "STATUS_CHANGE",
  "INTERVIEW_SCHEDULED",
  "FOLLOW_UP",
]);

export const createActivitySchema = z.object({
  note: z.string().min(1, "Note is required").max(2000),
  type: activityTypeEnum.optional(),
});
