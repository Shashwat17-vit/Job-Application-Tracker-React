import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import jobReducer from "./slices/jobSlice.js";
import activityReducer from "./slices/activitySlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    activities: activityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
