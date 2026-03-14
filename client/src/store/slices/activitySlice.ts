import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios.js";
import type { ActivityLog, CreateActivityDto } from "@tracker/shared";

export interface ActivityState {
  activities: ActivityLog[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activities: [],
  loading: false,
  error: null,
};

export const fetchActivitiesThunk = createAsyncThunk(
  "activities/fetchAll",
  async (jobId: string) => {
    const { data } = await api.get(`/jobs/${jobId}/activities`);
    return data.data;
  }
);

export const createActivityThunk = createAsyncThunk(
  "activities/create",
  async ({ jobId, ...payload }: CreateActivityDto & { jobId: string }) => {
    const { data } = await api.post(`/jobs/${jobId}/activities`, payload);
    return data.data;
  }
);

export const deleteActivityThunk = createAsyncThunk(
  "activities/delete",
  async (id: string) => {
    await api.delete(`/activities/${id}`);
    return id;
  }
);

const activitySlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    clearActivities(state) {
      state.activities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivitiesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivitiesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivitiesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch activities";
      })
      .addCase(createActivityThunk.fulfilled, (state, action) => {
        state.activities.unshift(action.payload);
      })
      .addCase(deleteActivityThunk.fulfilled, (state, action) => {
        state.activities = state.activities.filter((a) => a.id !== action.payload);
      });
  },
});

export const { clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
