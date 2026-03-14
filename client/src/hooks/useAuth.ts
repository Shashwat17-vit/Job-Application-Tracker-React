import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { getMeThunk } from "@/store/slices/authSlice.js";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, initialLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // On app startup, check if we have a valid session cookie
    if (!user) {
      dispatch(getMeThunk());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { user, isAuthenticated, initialLoading };
}
