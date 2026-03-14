import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth.js";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute.js";
import { RootLayout } from "@/components/layout/RootLayout.js";
import { LoginPage } from "@/pages/LoginPage.js";
import { RegisterPage } from "@/pages/RegisterPage.js";
import { DashboardPage } from "@/pages/DashboardPage.js";
import { KanbanPage } from "@/pages/KanbanPage.js";
import { JobDetailPage } from "@/pages/JobDetailPage.js";

export function App() {
  useAuth();

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/board" element={<KanbanPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
          </Route>
        </Route>

        {/* Redirect root to board */}
        <Route path="*" element={<Navigate to="/board" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
