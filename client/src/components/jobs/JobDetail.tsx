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
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {currentJob.company}
              </h1>
              <p className="text-gray-600">{currentJob.role}</p>
            </div>
          </div>
          <Badge status={currentJob.status as JobStatus} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {currentJob.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400" />
              {currentJob.location}
            </div>
          )}
          {currentJob.salary && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4 text-gray-400" />
              {currentJob.salary}
            </div>
          )}
          {currentJob.appliedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              Applied {new Date(currentJob.appliedAt).toLocaleDateString()}
            </div>
          )}
          {currentJob.url && (
            <a
              href={currentJob.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Job Listing
            </a>
          )}
        </div>

        {currentJob.notes && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Notes</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {currentJob.notes}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <ActivityTimeline jobId={currentJob.id} />
      </div>
    </div>
  );
}
