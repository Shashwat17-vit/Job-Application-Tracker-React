export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface DashboardStats {
  totalApplications: number;
  statusCounts: Record<string, number>;
  recentActivity: Array<{
    id: string;
    note: string;
    type: string;
    createdAt: string;
    job: {
      id: string;
      company: string;
      role: string;
    };
  }>;
}
