import { useState } from "react";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import HRJobForm from "@features/recruiter/components/jobs/HRJobForm";
import {
  createJob,
  type CreateJobPayload,
} from "@features/recruiter/services/job.service";
import toast from "react-hot-toast";
import getErrorMessage from "@utils/getErrorMessage";

const HRCreateJob = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (
    data: CreateJobPayload | Partial<CreateJobPayload>,
  ) => {
    try {
      setLoading(true);
      setError("");

      const jobData = data as CreateJobPayload;
      const response = await createJob(jobData);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to create job.",
        );
      }

      toast.success("Job created successfully");

      navigate(`/hr/jobs/${response.data.job._id}`);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Unable to create job.",
      );

      setError(message);
      toast.error(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-300 px-4 py-6 sm:px-6 lg:px-8">
      <Link
        to="/hr/jobs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-forest-950"
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest-950 text-mint-400">
          <BriefcaseBusiness size={22} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-forest-950 sm:text-3xl">
            Create Job
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            Create a new recruitment position for your organization.
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
          loading={loading}
          submitLabel="Create Job"
          onSubmit={handleCreate}
        />
      </div>
    </div>
  );
};

export default HRCreateJob;
