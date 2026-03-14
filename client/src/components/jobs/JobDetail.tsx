import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { fetchJobThunk, deleteJobThunk, clearCurrentJob } from "@/store/slices/jobSlice.js";
import { fetchActivitiesThunk, clearActivities } from "@/store/slices/activitySlice.js";
import { ActivityTimeline } from "./ActivityTimeline.js";
import { Badge } from "@/components/ui/Badge.js";
import { Button } from "@/components/ui/Button.js";
import { Spinner } from "@/components/ui/Spinner.js";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  ExternalLink,
  Calendar,
  Trash2,
} from "lucide-react";
import type { JobStatus } from "@tracker/shared";
import toast from "react-hot-toast";

export function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentJob } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobThunk(id));
      dispatch(fetchActivitiesThunk(id));
    }
    return () => {
      dispatch(clearCurrentJob());
      dispatch(clearActivities());
    };
  }, [id, dispatch]);

  async function handleDelete() {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      await dispatch(deleteJobThunk(id)).unwrap();
      toast.success("Application deleted");
      navigate("/board");
    } catch {
      toast.error("Failed to delete");
    }
  }

  if (!currentJob) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate("/board")}
        className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Board
      </button>

      {/* Main detail card — focal point with visual hierarchy */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 mb-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {currentJob.company}
              </h1>
              <p className="text-slate-500 mt-0.5">{currentJob.role}</p>
            </div>
          </div>
          <Badge status={currentJob.status as JobStatus} />
        </div>

        {/* Metadata grid — gestalt proximity grouping */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentJob.location && (
            <div className="flex items-center gap-2.5 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-slate-400" />
              {currentJob.location}
            </div>
          )}
          {currentJob.salary && (
            <div className="flex items-center gap-2.5 text-sm text-slate-600">
              <DollarSign className="h-4 w-4 text-slate-400" />
              {currentJob.salary}
            </div>
          )}
          {currentJob.appliedAt && (
            <div className="flex items-center gap-2.5 text-sm text-slate-600">
              <Calendar className="h-4 w-4 text-slate-400" />
              Applied {new Date(currentJob.appliedAt).toLocaleDateString()}
            </div>
          )}
          {currentJob.url && (
            <a
              href={currentJob.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Job Listing
            </a>
          )}
        </div>

        {currentJob.notes && (
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-1.5">Notes</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
              {currentJob.notes}
            </p>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="danger" size="sm" onClick={handleDelete} className="mt-4">
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Activity timeline card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <ActivityTimeline jobId={currentJob.id} />
      </div>
    </div>
  );
}
