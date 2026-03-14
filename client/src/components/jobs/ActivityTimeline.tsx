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
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Activity Log</h3>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Add a note..."
        />
        <div className="flex items-center gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ActivityType)}
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <p className="text-sm text-gray-500">Loading...</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-gray-400">No activity yet</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = typeIcons[activity.type] || MessageSquare;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg border border-gray-200 p-3"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{activity.note}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                      {new Date(activity.createdAt).toLocaleDateString()} at{" "}
                      {new Date(activity.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-xs text-gray-300">|</span>
                    <span className="text-xs text-gray-400">{typeLabels[activity.type]}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
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
