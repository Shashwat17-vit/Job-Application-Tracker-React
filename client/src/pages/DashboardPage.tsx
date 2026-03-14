import { StatsCards } from "@/components/dashboard/StatsCards.js";

export function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your job application pipeline
        </p>
      </div>
      <StatsCards />
    </div>
  );
}
