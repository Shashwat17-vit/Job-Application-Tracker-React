import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { fetchDashboardThunk } from "@/store/slices/jobSlice.js";
import { Spinner } from "@/components/ui/Spinner.js";
import { KANBAN_COLUMNS } from "@tracker/shared";
import {
  Briefcase,
  Send,
  Phone,
  Users,
  Trophy,
  XCircle,
  TrendingUp,
} from "lucide-react";

const statusIcons: Record<string, typeof Briefcase> = {
  WISHLIST: Briefcase,
  APPLIED: Send,
  PHONE_SCREEN: Phone,
  INTERVIEW: Users,
  OFFER: Trophy,
  REJECTED: XCircle,
};

export function StatsCards() {
  const dispatch = useAppDispatch();
  const { dashboardStats } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchDashboardThunk());
  }, [dispatch]);

  if (!dashboardStats) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero stat card — focal point, largest element creates visual hierarchy */}
      <div className="gradient-brand rounded-2xl p-5 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-200 mb-1">Total Applications</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {dashboardStats.totalApplications}
            </h2>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <TrendingUp className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Status cards grid — rule of thirds, gestalt similarity */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {KANBAN_COLUMNS.map((col) => {
          const count = dashboardStats.statusCounts[col.id] || 0;
          const Icon = statusIcons[col.id] || Briefcase;

          return (
            <div
              key={col.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: col.color + "18", color: col.color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{count}</p>
              <p className="text-xs font-medium text-slate-400 mt-1">{col.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent activity — F-pattern scan, proximity grouping */}
      {dashboardStats.recentActivity.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {dashboardStats.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 text-sm group"
              >
                <div className="h-2 w-2 rounded-full bg-indigo-400 mt-1.5 shrink-0 ring-4 ring-indigo-50" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 leading-snug">{activity.note}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activity.job.company} — {activity.job.role} · {" "}
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
