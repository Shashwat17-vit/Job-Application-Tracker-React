import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, DollarSign } from "lucide-react";
import type { JobApplication } from "@tracker/shared";

interface KanbanCardProps {
  job: JobApplication;
  index: number;
}

export function KanbanCard({ job, index }: KanbanCardProps) {
  const navigate = useNavigate();

  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => navigate(`/jobs/${job.id}`)}
          className={`cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-blue-400" : "border-gray-200"
          }`}
        >
          <div className="flex items-start gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {job.company}
              </p>
              <p className="text-xs text-gray-500 truncate">{job.role}</p>
            </div>
          </div>

          <div className="space-y-1">
            {job.location && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{job.location}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <DollarSign className="h-3 w-3" />
                <span className="truncate">{job.salary}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
