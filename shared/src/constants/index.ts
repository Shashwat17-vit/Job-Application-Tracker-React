import { JobStatus } from "../types/job.types.js";

export const JOB_STATUSES = Object.values(JobStatus);

export const KANBAN_COLUMNS = [
  { id: JobStatus.WISHLIST, title: "Wishlist", color: "#6B7280" },
  { id: JobStatus.APPLIED, title: "Applied", color: "#3B82F6" },
  { id: JobStatus.PHONE_SCREEN, title: "Phone Screen", color: "#8B5CF6" },
  { id: JobStatus.INTERVIEW, title: "Interview", color: "#F59E0B" },
  { id: JobStatus.OFFER, title: "Offer", color: "#10B981" },
  { id: JobStatus.REJECTED, title: "Rejected", color: "#EF4444" },
] as const;
