import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type JobStatus } from "@tracker/shared";

const statusColors: Record<JobStatus, string> = {
  WISHLIST: "bg-slate-100 text-slate-600",
  APPLIED: "bg-indigo-100 text-indigo-700",
  PHONE_SCREEN: "bg-violet-100 text-violet-700",
  INTERVIEW: "bg-amber-100 text-amber-700",
  OFFER: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

const statusLabels: Record<JobStatus, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  PHONE_SCREEN: "Phone Screen",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

interface BadgeProps {
  status: JobStatus;
  className?: string;
}

export function Badge({ status, className }: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold",
          statusColors[status],
          className
        )
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
