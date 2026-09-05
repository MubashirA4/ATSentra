import {
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
} from "lucide-react";

import type { ATSJob } from "@types/job";

interface ATSJobSelectorProps {
  jobs: ATSJob[];
  selectedJobId: string;
  onChange: (jobId: string) => void;
  loading?: boolean;
}

const ATSJobSelector = ({
  jobs,
  selectedJobId,
  onChange,
  loading = false,
}: ATSJobSelectorProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-900">
          Select Job
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose the position against which candidates will be evaluated.
        </p>
      </div>

      {loading ? (
        <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
          <BriefcaseBusiness
            className="mx-auto mb-2 text-slate-400"
            size={24}
          />

          <p className="text-sm font-medium text-slate-700">
            No jobs available
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Create an open job before running ATS analysis.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {jobs.map((job) => {
            const selected = job._id === selectedJobId;

            return (
              <button
                key={job._id}
                type="button"
                onClick={() => onChange(job._id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness
                        size={17}
                        className={
                          selected
                            ? "text-emerald-700"
                            : "text-slate-500"
                        }
                      />

                      <h3 className="truncate font-semibold text-slate-900">
                        {job.title}
                      </h3>
                    </div>

                    <p className="mt-1 text-sm text-slate-600">
                      {job.company}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      {job.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} />
                          {job.location}
                        </span>
                      )}

                      {job.employmentType && (
                        <span>{job.employmentType}</span>
                      )}

                      <span>
                        {job.requiredSkills.length} required skills
                      </span>
                    </div>
                  </div>

                  {selected && (
                    <CheckCircle2
                      size={21}
                      className="shrink-0 text-emerald-600"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ATSJobSelector;
