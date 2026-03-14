import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios.js";
import type {
  JobApplication,
  JobStatus,
  CreateJobDto,
  UpdateJobDto,
  ReorderDto,
  DashboardStats,
} from "@tracker/shared";

export interface JobState {
  jobs: JobApplication[];
  currentJob: (JobApplication & { activities?: unknown[] }) | null;
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  currentJob: null,
  dashboardStats: null,
  loading: false,
  error: null,
};

export const fetchJobsThunk = createAsyncThunk(
  "jobs/fetchAll",
  async (status?: string) => {
    const params = status ? { status } : {};
    const { data } = await api.get("/jobs", { params });
    return data.data;
  }
);

export const fetchJobThunk = createAsyncThunk(
  "jobs/fetchOne",
  async (id: string) => {
    const { data } = await api.get(`/jobs/${id}`);
    return data.data;
  }
);

export const createJobThunk = createAsyncThunk(
  "jobs/create",
  async (payload: CreateJobDto) => {
    const { data } = await api.post("/jobs", payload);
    return data.data;
  }
);

export const updateJobThunk = createAsyncThunk(
  "jobs/update",
  async ({ id, ...payload }: UpdateJobDto & { id: string }) => {
    const { data } = await api.put(`/jobs/${id}`, payload);
    return data.data;
  }
);

export const deleteJobThunk = createAsyncThunk(
  "jobs/delete",
  async (id: string) => {
    await api.delete(`/jobs/${id}`);
    return id;
  }
);

export const updateStatusThunk = createAsyncThunk(
  "jobs/updateStatus",
  async ({ id, status }: { id: string; status: JobStatus }) => {
    const { data } = await api.patch(`/jobs/${id}/status`, { status });
    return data.data;
  }
);

export const reorderThunk = createAsyncThunk(
  "jobs/reorder",
  async (payload: ReorderDto) => {
    await api.patch("/jobs/reorder", payload);
    return payload;
  }
);

export const fetchDashboardThunk = createAsyncThunk(
  "jobs/dashboard",
  async () => {
    const { data } = await api.get("/dashboard/stats");
    return data.data;
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearCurrentJob(state) {
      state.currentJob = null;
    },
    optimisticReorder(state, action) {
      const { items } = action.payload as ReorderDto;
      for (const item of items) {
        const job = state.jobs.find((j) => j.id === item.id);
        if (job) {
          job.status = item.status;
          job.order = item.order;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch jobs";
      })
      .addCase(fetchJobThunk.fulfilled, (state, action) => {
        state.currentJob = action.payload;
      })
      .addCase(createJobThunk.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(updateJobThunk.fulfilled, (state, action) => {
        const index = state.jobs.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(deleteJobThunk.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((j) => j.id !== action.payload);
      })
      .addCase(updateStatusThunk.fulfilled, (state, action) => {
        const index = state.jobs.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(fetchDashboardThunk.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
      });
  },
});

export const { clearCurrentJob, optimisticReorder } = jobSlice.actions;
export default jobSlice.reducer;
