import { type FormEvent, useState } from "react";
import { useAppDispatch } from "@/store/hooks.js";
import { createJobThunk, updateJobThunk } from "@/store/slices/jobSlice.js";
import { Modal } from "@/components/ui/Modal.js";
import { Button } from "@/components/ui/Button.js";
import { Input } from "@/components/ui/Input.js";
import { JobStatus, type JobApplication } from "@tracker/shared";
import { Sparkles, FileText, ArrowLeft } from "lucide-react";
import api from "@/lib/axios.js";
import toast from "react-hot-toast";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: JobApplication | null;
}

export function JobModal({ isOpen, onClose, job }: JobModalProps) {
  const dispatch = useAppDispatch();
  const isEditing = !!job;

  const [mode, setMode] = useState<"form" | "paste">("form");
  const [jobDescription, setJobDescription] = useState("");
  const [parsing, setParsing] = useState(false);

  const [form, setForm] = useState({
    company: job?.company || "",
    role: job?.role || "",
    url: job?.url || "",
    salary: job?.salary || "",
    location: job?.location || "",
    notes: job?.notes || "",
    status: job?.status || JobStatus.WISHLIST,
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleParse() {
    if (!jobDescription.trim()) return;

    setParsing(true);
    try {
      const { data } = await api.post("/ai/parse-job", {
        description: jobDescription,
      });

      const parsed = data.data;
      setForm((prev) => ({
        ...prev,
        company: parsed.company || prev.company,
        role: parsed.role || prev.role,
        salary: parsed.salary || prev.salary,
        location: parsed.location || prev.location,
        notes: parsed.techStack ? `Tech Stack:\n${parsed.techStack}` : prev.notes,
      }));
      setMode("form");
      toast.success("Job description parsed! Review and edit the fields.");
    } catch {
      toast.error("Failed to parse job description");
    } finally {
      setParsing(false);
    }
  }

  const fieldLimits = { company: 200, role: 200, salary: 100, location: 200, notes: 2000 } as const;

  const overLimitFields = (Object.keys(fieldLimits) as (keyof typeof fieldLimits)[]).filter(
    (key) => form[key].length > fieldLimits[key]
  );
  const hasErrors = overLimitFields.length > 0;

  function fieldError(field: keyof typeof fieldLimits) {
    return form[field].length > fieldLimits[field]
      ? `Max ${fieldLimits[field]} characters (${form[field].length}/${fieldLimits[field]})`
      : undefined;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (hasErrors) return;

    try {
      if (isEditing) {
        await dispatch(updateJobThunk({ id: job.id, ...form })).unwrap();
        toast.success("Job updated");
      } else {
        await dispatch(createJobThunk(form)).unwrap();
        toast.success("Job added");
        setForm({ company: "", role: "", url: "", salary: "", location: "", notes: "", status: JobStatus.WISHLIST });
        setJobDescription("");
        setMode("form");
      }
      onClose();
    } catch {
      toast.error(isEditing ? "Failed to update job" : "Failed to add job");
    }
  }

  function handleClose() {
    setMode("form");
    setJobDescription("");
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Application" : "Add Application"}
    >
      {/* Paste JD mode */}
      {mode === "paste" && (
        <div className="space-y-4">
          <button
            onClick={() => setMode("form")}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to form
          </button>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Paste the full job description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-400 transition-all resize-none"
              placeholder="Paste the complete job listing here — including company name, role, salary, location, requirements, etc."
              autoFocus
            />
          </div>

          <Button
            onClick={handleParse}
            disabled={parsing || jobDescription.trim().length < 10}
            className="w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {parsing ? "Parsing with AI..." : "Parse with AI"}
          </Button>

          <p className="text-xs text-slate-400 text-center">
            AI will extract company, role, salary, and location automatically
          </p>
        </div>
      )}

      {/* Normal form mode */}
      {mode === "form" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Paste JD button — only show when creating */}
          {!isEditing && (
            <button
              type="button"
              onClick={() => setMode("paste")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
            >
              <FileText className="h-4 w-4" />
              Paste Job Description to auto-fill
            </button>
          )}

          <Input
            label="Company"
            value={form.company}
            onChange={(e) => updateField("company", e.target.value)}
            placeholder="e.g. Google"
            maxLength={200}
            error={fieldError("company")}
            required
          />

          <Input
            label="Role"
            value={form.role}
            onChange={(e) => updateField("role", e.target.value)}
            placeholder="e.g. Software Engineer"
            maxLength={200}
            error={fieldError("role")}
            required
          />

          <Input
            label="Job URL"
            value={form.url}
            onChange={(e) => updateField("url", e.target.value)}
            placeholder="https://..."
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Salary"
              value={form.salary}
              onChange={(e) => updateField("salary", e.target.value)}
              placeholder="e.g. $120k-$150k"
              maxLength={100}
              error={fieldError("salary")}
            />
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="e.g. San Francisco, CA"
              maxLength={200}
              error={fieldError("location")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-400 transition-all"
            >
              {Object.values(JobStatus).map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
              maxLength={2000}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
                fieldError("notes")
                  ? "border-red-300 focus:ring-red-500"
                  : "border-slate-300 focus:ring-indigo-500 hover:border-slate-400"
              }`}
              placeholder="Any notes about this application..."
            />
            {fieldError("notes") && (
              <p className="mt-1 text-sm text-red-600">{fieldError("notes")}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={hasErrors}>
              {isEditing ? "Save Changes" : "Add Application"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
