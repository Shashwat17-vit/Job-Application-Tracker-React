import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks.js";
import { LoginForm } from "@/components/auth/LoginForm.js";
import { Briefcase, TrendingUp, BarChart3, CheckCircle2 } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/board", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel — ~38% width (golden ratio) */}
      <div className="hidden lg:flex lg:w-[38%] gradient-brand relative overflow-hidden">
        {/* Decorative circles for depth */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Top: Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">ApplyFlow</span>
          </div>

          {/* Center: Value proposition (focal point — rule of thirds) */}
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              Track every
              <br />
              application.
              <br />
              <span className="text-indigo-200">Land your dream job.</span>
            </h1>
            <p className="text-lg text-indigo-200 max-w-sm leading-relaxed">
              Organize your job search with a visual pipeline that keeps you focused and moving forward.
            </p>
          </div>

          {/* Bottom: Social proof / features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-200">
              <TrendingUp className="h-5 w-5 text-indigo-300 shrink-0" />
              <span className="text-sm">Visual Kanban board for your pipeline</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-200">
              <BarChart3 className="h-5 w-5 text-indigo-300 shrink-0" />
              <span className="text-sm">Dashboard analytics at a glance</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-200">
              <CheckCircle2 className="h-5 w-5 text-indigo-300 shrink-0" />
              <span className="text-sm">Track status, notes, and activity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel — ~62% width */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile-only brand (hidden on desktop) */}
          <div className="mb-8 text-center lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-gradient">ApplyFlow</span>
            </div>
          </div>

          {/* Form header — clear visual hierarchy */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-slate-500">
              Sign in to continue tracking your applications
            </p>
          </div>

          {/* Form card with subtle elevation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <LoginForm />
          </div>

          {/* Footer — negative space below form */}
          <p className="mt-8 text-center text-xs text-slate-400">
            Secure login with encrypted credentials
          </p>
        </div>
      </div>
    </div>
  );
}
