import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type JobStatus } from "@tracker/shared";

const statusColors: Record<JobStatus, string> = {
  WISHLIST: "bg-gray-100 text-gray-700",
  APPLIED: "bg-blue-100 text-blue-700",
  PHONE_SCREEN: "bg-purple-100 text-purple-700",
  INTERVIEW: "bg-amber-100 text-amber-700",
  OFFER: "bg-green-100 text-green-700",
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
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          statusColors[status],
          className
        )
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
