import { useState } from "react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard.js";
import { JobModal } from "@/components/jobs/JobModal.js";
import { Button } from "@/components/ui/Button.js";
import { Plus, Search, X } from "lucide-react";

export function KanbanPage() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Application Board</h1>
          <p className="mt-1 text-sm text-slate-500 hidden sm:block">
            Drag and drop to update your application status
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full sm:w-64 rounded-xl border border-slate-300 bg-white pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-slate-400 transition-all placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={() => setShowModal(true)} size="md">
            <Plus className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <KanbanBoard searchQuery={search} />
      </div>

      <JobModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
