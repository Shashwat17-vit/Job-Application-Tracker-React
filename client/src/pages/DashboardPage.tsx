import { StatsCards } from "@/components/dashboard/StatsCards.js";

export function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <StatsCards />
    </div>
  );
}
