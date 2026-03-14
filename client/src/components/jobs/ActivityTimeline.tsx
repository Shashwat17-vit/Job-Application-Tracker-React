import { type FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import {
  createActivityThunk,
  deleteActivityThunk,
} from "@/store/slices/activitySlice.js";
import { Button } from "@/components/ui/Button.js";
import { Trash2, MessageSquare, ArrowRightLeft, Calendar, MailCheck } from "lucide-react";
import { ActivityType } from "@tracker/shared";
import toast from "react-hot-toast";

const typeIcons: Record<string, typeof MessageSquare> = {
  NOTE: MessageSquare,
  STATUS_CHANGE: ArrowRightLeft,
  INTERVIEW_SCHEDULED: Calendar,
  FOLLOW_UP: MailCheck,
};

const typeLabels: Record<string, string> = {
  NOTE: "Note",
  STATUS_CHANGE: "Status Change",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  FOLLOW_UP: "Follow Up",
};

interface ActivityTimelineProps {
  jobId: string;
}

export function ActivityTimeline({ jobId }: ActivityTimelineProps) {
  const dispatch = useAppDispatch();
  const { activities, loading } = useAppSelector((state) => state.activities);
  const [note, setNote] = useState("");
  const [type, setType] = useState<ActivityType>(ActivityType.NOTE);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;

    try {
      await dispatch(createActivityThunk({ jobId, note, type })).unwrap();
      setNote("");
      toast.success("Activity added");
    } catch {
      toast.error("Failed to add activity");
    }
  }

  async function handleDelete(id: string) {
    try {
      await dispatch(deleteActivityThunk(id)).unwrap();
      toast.success("Activity deleted");
    } catch {
      toast.error("Failed to delete activity");
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Activity Log</h3>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-400 transition-all resize-none"
          placeholder="Add a note..."
        />
        <div className="flex items-center gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ActivityType)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-400 transition-all"
          >
            {Object.values(ActivityType).map((t) => (
              <option key={t} value={t}>
                {typeLabels[t]}
              </option>
            ))}
          </select>
          <Button type="submit" size="sm" disabled={!note.trim()}>
            Add
          </Button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-slate-400">No activity yet</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = typeIcons[activity.type] || MessageSquare;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug">{activity.note}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-slate-400">
                      {new Date(activity.createdAt).toLocaleDateString()} at{" "}
                      {new Date(activity.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{typeLabels[activity.type]}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
