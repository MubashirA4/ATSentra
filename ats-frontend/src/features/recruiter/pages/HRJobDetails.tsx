import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  MapPin,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  changeJobStatus,
  deleteJob,
  getJobById,
} from "@features/recruiter/services/job.service";
import type { ATSJob } from "@types/job";
import HRConfirmDialog from "@features/recruiter/components/candidates/HRConfirmDialog";
import toast from "react-hot-toast";
import getErrorMessage from "@utils/getErrorMessage";

const statusStyles: Record<ATSJob["status"], string> = {
  draft: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  open: "bg-mint-500/10 text-mint-700 border-mint-500/20",
  closed: "bg-red-500/10 text-red-700 border-red-500/20",
  archived: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const formatExperience = (
  requirement: ATSJob["experienceRequirement"],
) => {
  if (!requirement) return "Not specified";

  const { minYears, maxYears } = requirement;

  if (minYears !== null && maxYears !== null) {
    return `${minYears}–${maxYears} years`;
  }

  if (minYears !== null) {
    return `${minYears}+ years`;
  }

  if (maxYears !== null) {
    return `Up to ${maxYears} years`;
  }

  return "Not specified";
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const HRJobDetails = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<ATSJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] =
    useState(false);
  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  useEffect(() => {
    if (!jobId) {
      setError("Job ID is missing.");
      setLoading(false);
      return;
    }

    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getJobById(jobId);

        if (!response.success) {
          throw new Error(
            response.message || "Failed to load job.",
          );
        }

        setJob(response.data.job);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load job.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  /*
   * Change job status directly from Job Details.
   */
  const handleStatusChange = async (
    nextStatus: ATSJob["status"],
  ) => {
    if (!job || !jobId || updatingStatus) {
      return;
    }

    if (nextStatus === job.status) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");

      const response = await changeJobStatus(
        jobId,
        nextStatus,
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to update job status.",
        );
      }

      setJob(response.data.job);

      toast.success(
        `Job status changed to ${nextStatus}.`,
      );
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Unable to update job status.",
      );

      setError(message);
      toast.error(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!jobId || !job || deleting) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await deleteJob(jobId);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to delete job.",
        );
      }

      toast.success("Job deleted successfully");

      navigate("/hr/jobs");
    } catch (error) {
      console.error(
        "Failed to delete job:",
        error,
      );

      const message = getErrorMessage(
        error,
        "Failed to delete job.",
      );

      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-300 px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-5 w-28 rounded bg-forest-950/10" />
          <div className="mt-8 h-10 w-96 rounded bg-forest-950/10" />
          <div className="mt-3 h-5 w-64 rounded bg-forest-950/10" />
          <div className="mt-8 h-64 rounded-2xl bg-forest-950/5" />
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="mx-auto w-full max-w-300 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <h2 className="text-lg font-bold text-red-700">
            Unable to load job
          </h2>

          <p className="mt-2 text-sm text-red-600/80">
            {error || "The requested job could not be found."}
          </p>

          <Link
            to="/hr/jobs"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-forest-950 px-4 text-sm font-semibold text-white transition hover:bg-forest-900"
          >
            <ArrowLeft size={16} />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-300 px-4 py-6 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        to="/hr/jobs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-forest-950"
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </Link>

      {/* Header */}
      <div className="mt-6 rounded-3xl border border-forest-900/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Job identity */}
          <div className="flex min-w-0 gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-forest-950 text-mint-400">
              <BriefcaseBusiness
                size={24}
                className="text-white"
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-forest-950 sm:text-3xl">
                  {job.title}
                </h1>

                {/* Quick Status Control */}
                <div className="relative">
                  <select
                    value={job.status}
                    onChange={(event) =>
                      handleStatusChange(
                        event.target.value as ATSJob["status"],
                      )
                    }
                    disabled={updatingStatus}
                    aria-label="Job status"
                    className={`h-9 cursor-pointer appearance-none rounded-full border px-4 pr-8 text-xs font-semibold capitalize outline-none transition focus:ring-2 focus:ring-mint-400/20 disabled:cursor-not-allowed disabled:opacity-60 ${statusStyles[job.status]}`}
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="open">
                      Open
                    </option>

                    <option value="closed">
                      Closed
                    </option>

                    <option value="archived">
                      Archived
                    </option>
                  </select>

                  {/* Dropdown arrow */}
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-current">
                    ▾
                  </span>
                </div>
              </div>

              <p className="mt-2 text-base font-medium text-text-secondary">
                {job.company}
              </p>

              {job.location && (
                <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin size={15} />
                  <span>{job.location}</span>
                </div>
              )}

              {updatingStatus && (
                <p className="mt-2 text-xs font-medium text-text-secondary">
                  Updating status...
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              to={`/hr/jobs/${job._id}/edit`}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-forest-900/10 px-4 text-sm font-semibold text-forest-950 transition hover:bg-forest-950/[0.04]"
            >
              <Pencil size={16} />
              Edit
            </Link>

            <button
              type="button"
              onClick={() =>
                setShowDeleteDialog(true)
              }
              disabled={deleting}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-500/20 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={16} />

              {deleting
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Metadata */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<BriefcaseBusiness size={17} />}
            label="Employment"
            value={
              job.employmentType ||
              "Not specified"
            }
          />

          <InfoCard
            icon={<Sparkles size={17} />}
            label="Experience"
            value={formatExperience(
              job.experienceRequirement,
            )}
          />

          <InfoCard
            icon={<GraduationCap size={17} />}
            label="Education"
            value={
              job.educationRequirements.length
                ? job.educationRequirements.join(", ")
                : "Not specified"
            }
          />

          <InfoCard
            icon={<CalendarDays size={17} />}
            label="Created"
            value={formatDate(job.createdAt)}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Description */}
        <section className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-forest-950">
            Job Description
          </h2>

          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-text-secondary">
            {job.description ||
              "No description provided."}
          </p>
        </section>

        {/* Skills */}
        <section className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-forest-950">
            Required Skills
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.requiredSkills.length ? (
              job.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-forest-950/[0.05] px-3 py-1.5 text-xs font-medium text-forest-950"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-text-secondary">
                No required skills specified.
              </p>
            )}
          </div>

          <h2 className="mt-8 text-lg font-bold text-forest-950">
            Preferred Skills
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.preferredSkills.length ? (
              job.preferredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-mint-500/10 px-3 py-1.5 text-xs font-medium text-mint-700"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-text-secondary">
                No preferred skills specified.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Responsibilities */}
      <section className="mt-6 rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-forest-950">
          Responsibilities
        </h2>

        {job.responsibilities.length ? (
          <ul className="mt-4 space-y-3">
            {job.responsibilities.map(
              (responsibility, index) => (
                <li
                  key={`${responsibility}-${index}`}
                  className="flex gap-3 text-sm leading-6 text-text-secondary"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />
                  <span>{responsibility}</span>
                </li>
              ),
            )}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-text-secondary">
            No responsibilities specified.
          </p>
        )}
      </section>

      {/* Delete Confirmation */}
      <HRConfirmDialog
        open={showDeleteDialog}
        title="Delete job?"
        description={
          job
            ? `Are you sure you want to delete "${job.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this job? This action cannot be undone."
        }
        confirmText="Delete Job"
        cancelText="Cancel"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) {
            setShowDeleteDialog(false);
          }
        }}
      />
    </div>
  );
};

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoCard = ({
  icon,
  label,
  value,
}: InfoCardProps) => {
  return (
    <div className="rounded-xl border border-forest-900/10 bg-forest-950/[0.02] p-4">
      <div className="flex items-center gap-2 text-mint-600">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-forest-950">
        {value}
      </p>
    </div>
  );
};

export default HRJobDetails;
