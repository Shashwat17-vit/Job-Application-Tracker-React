import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks.js";
import { Spinner } from "@/components/ui/Spinner.js";

export function ProtectedRoute() {
  const { isAuthenticated, initialLoading } = useAppSelector((state) => state.auth);

  // Still checking if the user has a valid session cookie
  if (initialLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
