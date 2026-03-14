import { useEffect, useCallback } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { fetchJobsThunk, optimisticReorder, reorderThunk } from "@/store/slices/jobSlice.js";
import { KanbanColumn } from "./KanbanColumn.js";
import { Spinner } from "@/components/ui/Spinner.js";
import { KANBAN_COLUMNS, type JobStatus } from "@tracker/shared";

export function KanbanBoard() {
  const dispatch = useAppDispatch();
  const { jobs, loading } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobsThunk());
  }, [dispatch]);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const destStatus = destination.droppableId as JobStatus;
      const sourceStatus = source.droppableId as JobStatus;

      // Get jobs in source and destination columns
      const sourceJobs = jobs
        .filter((j) => j.status === sourceStatus)
        .sort((a, b) => a.order - b.order);
      const destJobs =
        sourceStatus === destStatus
          ? sourceJobs
          : jobs
              .filter((j) => j.status === destStatus)
              .sort((a, b) => a.order - b.order);

      // Remove from source
      const [movedJob] = sourceJobs.splice(source.index, 1);
      if (!movedJob) return;

      // Insert into destination
      if (sourceStatus === destStatus) {
        sourceJobs.splice(destination.index, 0, movedJob);
      } else {
        destJobs.splice(destination.index, 0, movedJob);
      }

      // Build reorder items
      const items = [];

      if (sourceStatus === destStatus) {
        for (let i = 0; i < sourceJobs.length; i++) {
          items.push({ id: sourceJobs[i].id, status: sourceStatus, order: i });
        }
      } else {
        for (let i = 0; i < sourceJobs.length; i++) {
          items.push({ id: sourceJobs[i].id, status: sourceStatus, order: i });
        }
        for (let i = 0; i < destJobs.length; i++) {
          const id = destJobs[i].id === draggableId ? movedJob.id : destJobs[i].id;
          items.push({ id, status: destStatus, order: i });
        }
      }

      // Optimistic update then persist
      dispatch(optimisticReorder({ items }));
      dispatch(reorderThunk({ items }));
    },
    [dispatch, jobs]
  );

  if (loading && jobs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {KANBAN_COLUMNS.map((column) => {
          const columnJobs = jobs
            .filter((j) => j.status === column.id)
            .sort((a, b) => a.order - b.order);

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              jobs={columnJobs}
              count={columnJobs.length}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
}
