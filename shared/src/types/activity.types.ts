export enum ActivityType {
  NOTE = "NOTE",
  STATUS_CHANGE = "STATUS_CHANGE",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  FOLLOW_UP = "FOLLOW_UP",
}

export interface ActivityLog {
  id: string;
  jobId: string;
  note: string;
  type: ActivityType;
  createdAt: string;
}

export interface CreateActivityDto {
  note: string;
  type?: ActivityType;
}
