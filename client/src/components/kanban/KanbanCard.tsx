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
          className={`cursor-pointer rounded-xl border bg-white p-3.5 transition-all hover:shadow-md ${
            snapshot.isDragging
              ? "shadow-xl ring-2 ring-indigo-400 border-indigo-200 rotate-[2deg]"
              : "border-slate-200/80 shadow-sm"
          }`}
        >
          {/* Card header — gestalt proximity */}
          <div className="flex items-start gap-2.5 mb-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate leading-tight">
                {job.company}
              </p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{job.role}</p>
            </div>
          </div>

          {/* Card metadata — visual hierarchy through size/color contrast */}
          <div className="space-y-1.5 pl-[2.875rem]">
            {job.location && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <DollarSign className="h-3 w-3 shrink-0" />
                <span className="truncate">{job.salary}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
