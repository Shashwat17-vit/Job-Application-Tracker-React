import { Droppable } from "@hello-pangea/dnd";
import { KanbanCard } from "./KanbanCard.js";
import type { JobApplication } from "@tracker/shared";

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  jobs: JobApplication[];
  count: number;
}

export function KanbanColumn({ id, title, color, jobs, count }: KanbanColumnProps) {
  return (
    <div className="flex w-60 min-w-[15rem] sm:w-72 sm:min-w-[18rem] flex-col rounded-2xl bg-slate-100/80">
      {/* Column header — gestalt grouping with color dot */}
      <div className="flex items-center gap-2.5 p-3.5">
        <div
          className="h-3 w-3 rounded-full ring-4"
          style={{ backgroundColor: color, boxShadow: `0 0 0 4px ${color}18` }}
        />
        <h3 className="text-sm font-semibold text-slate-700 tracking-tight">{title}</h3>
        <span className="ml-auto flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-slate-200/80 px-2 text-xs font-semibold text-slate-500">
          {count}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-2.5 overflow-y-auto p-2.5 transition-colors rounded-b-2xl ${
              snapshot.isDraggingOver ? "bg-indigo-50/60" : ""
            }`}
            style={{ minHeight: "4rem" }}
          >
            {jobs.map((job, index) => (
              <KanbanCard key={job.id} job={job} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
