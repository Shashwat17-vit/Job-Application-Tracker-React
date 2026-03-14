import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { getMeThunk } from "@/store/slices/authSlice.js";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getMeThunk());
    }
  }, [isAuthenticated, user, dispatch]);

  return { user, isAuthenticated, loading };
}
