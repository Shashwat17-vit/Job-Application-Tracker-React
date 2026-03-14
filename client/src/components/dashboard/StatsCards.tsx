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
    <div>
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {dashboardStats.totalApplications}
        </h2>
        <p className="text-sm text-gray-500">Total Applications</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {KANBAN_COLUMNS.map((col) => {
          const count = dashboardStats.statusCounts[col.id] || 0;
          const Icon = statusIcons[col.id] || Briefcase;

          return (
            <div
              key={col.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: col.color + "20", color: col.color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500">{col.title}</p>
            </div>
          );
        })}
      </div>

      {dashboardStats.recentActivity.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {dashboardStats.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 text-sm"
              >
                <div className="h-2 w-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-gray-800">{activity.note}</p>
                  <p className="text-xs text-gray-400">
                    {activity.job.company} - {activity.job.role} |{" "}
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
