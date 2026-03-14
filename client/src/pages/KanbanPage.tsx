import { useState } from "react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard.js";
import { JobModal } from "@/components/jobs/JobModal.js";
import { Button } from "@/components/ui/Button.js";
import { Plus } from "lucide-react";

export function KanbanPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Application Board</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-1" />
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
