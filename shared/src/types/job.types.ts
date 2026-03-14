export enum JobStatus {
  WISHLIST = "WISHLIST",
  APPLIED = "APPLIED",
  PHONE_SCREEN = "PHONE_SCREEN",
  INTERVIEW = "INTERVIEW",
  OFFER = "OFFER",
  REJECTED = "REJECTED",
}

export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  role: string;
  url: string | null;
  salary: string | null;
  location: string | null;
  notes: string | null;
  status: JobStatus;
  order: number;
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobDto {
  company: string;
  role: string;
  url?: string;
  salary?: string;
  location?: string;
  notes?: string;
  status?: JobStatus;
}

export interface UpdateJobDto {
  company?: string;
  role?: string;
  url?: string | null;
  salary?: string | null;
  location?: string | null;
  notes?: string | null;
  status?: JobStatus;
  appliedAt?: string | null;
}

export interface ReorderDto {
  items: Array<{
    id: string;
    status: JobStatus;
    order: number;
  }>;
}
