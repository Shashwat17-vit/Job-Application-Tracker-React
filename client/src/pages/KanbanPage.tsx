import { useState } from "react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard.js";
import { JobModal } from "@/components/jobs/JobModal.js";
import { Button } from "@/components/ui/Button.js";
import { Plus } from "lucide-react";

export function KanbanPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Application Board</h1>
          <p className="mt-1 text-sm text-slate-500">
            Drag and drop to update your application status
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} size="md">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Application
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>

      <JobModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
