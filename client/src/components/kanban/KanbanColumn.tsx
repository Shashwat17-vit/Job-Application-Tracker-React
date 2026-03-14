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
    <div className="flex w-72 min-w-[18rem] flex-col rounded-xl bg-gray-100">
      <div className="flex items-center gap-2 p-3">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gray-200 px-1.5 text-xs font-medium text-gray-600">
          {count}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-2 overflow-y-auto p-2 transition-colors ${
              snapshot.isDraggingOver ? "bg-blue-50" : ""
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
