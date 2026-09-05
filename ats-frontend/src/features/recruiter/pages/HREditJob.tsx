import { useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import HRJobForm from "@features/recruiter/components/jobs/HRJobForm";
import {
  getJobById,
  updateJob,
  type UpdateJobPayload,
} from "@features/recruiter/services/job.service";
import type { ATSJob } from "@types/job";
import toast from "react-hot-toast";
import getErrorMessage from "@utils/getErrorMessage";

const HREditJob = () => {
  const { jobId } = useParams<{
    jobId: string;
  }>();

  const navigate = useNavigate();

  const [job, setJob] = useState<ATSJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) {
      setError("Job ID is missing.");
      setLoading(false);
      return;
    }

    const loadJob = async () => {
      try {
        const response = await getJobById(jobId);

        if (!response.success) {
          throw new Error(response.message || "Failed to load job.");
        }

        setJob(response.data.job);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load job.");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  const handleUpdate = async (data: UpdateJobPayload) => {
    if (!jobId) {
      throw new Error("Job ID is missing.");
    }

    try {
      setSaving(true);
      setError("");

      const response = await updateJob(jobId, data);

      if (!response.success) {
        throw new Error(response.message || "Failed to update job.");
      }

      toast.success("Job updated successfully");
      navigate(`/hr/jobs/${jobId}`);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Unable to update job.",
      );

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-300 px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-forest-950/10" />
          <div className="h-10 w-64 rounded bg-forest-950/10" />
          <div className="h-[600px] rounded-2xl bg-forest-950/5" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-forest-950">
          Unable to load job
        </h2>

        <p className="mt-2 text-sm text-text-secondary">
          {error || "Job not found."}
        </p>

        <Link
          to="/hr/jobs"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-forest-950 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-300 px-4 py-6 sm:px-6 lg:px-8">
      <Link
        to={`/hr/jobs/${job._id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-forest-950"
      >
        <ArrowLeft size={16} />
        Back to Job
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest-950 text-mint-400">
          <BriefcaseBusiness size={22} className="text-white"/>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-forest-950 sm:text-3xl">
            Edit Job
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            Update the details for {job.title}.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6">
        <HRJobForm
          initialJob={job}
          loading={saving}
          submitLabel="Save Changes"
          onSubmit={handleUpdate}
        />
      </div>
    </div>
  );
};

export default HREditJob;
