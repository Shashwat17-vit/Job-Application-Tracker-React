import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks.js";
import { RegisterForm } from "@/components/auth/RegisterForm.js";
import { Briefcase, Zap, Shield, Sparkles } from "lucide-react";

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/board", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel — ~38% width (golden ratio) */}
      <div className="hidden lg:flex lg:w-[38%] gradient-brand relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">ApplyFlow</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              Your job search,
              <br />
              <span className="text-indigo-200">finally organized.</span>
            </h1>
            <p className="text-lg text-indigo-200 max-w-sm leading-relaxed">
              Join and take control of your application pipeline with a beautiful, intuitive tracker.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-200">
              <Zap className="h-5 w-5 text-indigo-300 shrink-0" />
              <span className="text-sm">Get started in under a minute</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-200">
              <Shield className="h-5 w-5 text-indigo-300 shrink-0" />
              <span className="text-sm">Your data stays private and secure</span>
            </div>
            <div className="flex items-center gap-3 text-indigo-200">
              <Sparkles className="h-5 w-5 text-indigo-300 shrink-0" />
              <span className="text-sm">Clean, distraction-free interface</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel — ~62% width */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-gradient">ApplyFlow</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
            <p className="mt-2 text-slate-500">
              Start organizing your job applications today
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <RegisterForm />
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Free to use, no credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
