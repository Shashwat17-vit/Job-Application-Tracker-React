import { useAppSelector } from "@/store/hooks.js";
import { User, Menu } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
      {/* Left: hamburger on mobile */}
      <button
        onClick={onMenuToggle}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors md:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden md:block" />

      {/* Right: user info */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 ring-2 ring-indigo-50">
          <User className="h-4 w-4" />
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-semibold text-slate-800">
            {user?.name || "User"}
          </span>
          <span className="text-[11px] text-slate-400">{user?.email || ""}</span>
        </div>
      </div>
    </header>
  );
}
