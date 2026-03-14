import { type FormEvent, useState } from "react";
import { useAppDispatch } from "@/store/hooks.js";
import { createJobThunk, updateJobThunk } from "@/store/slices/jobSlice.js";
import { Modal } from "@/components/ui/Modal.js";
import { Button } from "@/components/ui/Button.js";
import { Input } from "@/components/ui/Input.js";
import { JobStatus, type JobApplication } from "@tracker/shared";
import toast from "react-hot-toast";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: JobApplication | null;
}

export function JobModal({ isOpen, onClose, job }: JobModalProps) {
  const dispatch = useAppDispatch();
  const isEditing = !!job;

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      if (isEditing) {
        await dispatch(updateJobThunk({ id: job.id, ...form })).unwrap();
        toast.success("Job updated");
      } else {
        await dispatch(createJobThunk(form)).unwrap();
        toast.success("Job added");
      }
      onClose();
    } catch {
      toast.error(isEditing ? "Failed to update job" : "Failed to add job");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Application" : "Add Application"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Company"
          value={form.company}
          onChange={(e) => updateField("company", e.target.value)}
          placeholder="e.g. Google"
          required
        />

        <Input
          label="Role"
          value={form.role}
          onChange={(e) => updateField("role", e.target.value)}
          placeholder="e.g. Software Engineer"
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
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="e.g. San Francisco, CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(JobStatus).map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Any notes about this application..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Save Changes" : "Add Application"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
