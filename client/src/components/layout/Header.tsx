import { useAppSelector } from "@/store/hooks.js";
import { User } from "lucide-react";

export function Header() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <User className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium text-gray-700">
          {user?.name || "User"}
        </span>
      </div>
    </header>
  );
}
