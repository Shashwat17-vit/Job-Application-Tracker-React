import { useAppSelector } from "@/store/hooks.js";
import { User } from "lucide-react";

export function Header() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm px-8">
      {/* Left: negative space — keeps the header clean */}
      <div />

      {/* Right: user info — visual scan endpoint (F-pattern) */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 ring-2 ring-indigo-50">
          <User className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800">
            {user?.name || "User"}
          </span>
          <span className="text-[11px] text-slate-400">{user?.email || ""}</span>
        </div>
      </div>
    </header>
  );
}
