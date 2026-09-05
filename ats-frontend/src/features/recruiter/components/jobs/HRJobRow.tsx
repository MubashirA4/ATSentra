import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { ATSJob } from "@types/job";

interface HRJobRowProps {
  job: ATSJob;
}

const statusStyles: Record<
  ATSJob["status"],
  string
> = {
  draft:
    "bg-amber-500/10 text-amber-700 border-amber-500/20",
  open:
    "bg-mint-500/10 text-mint-700 border-mint-500/20",
  closed:
    "bg-red-500/10 text-red-700 border-red-500/20",
  archived:
    "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const formatExperience = (job: ATSJob) => {
  if (!job.experienceRequirement) {
    return "Not specified";
  }

  const { minYears, maxYears } =
    job.experienceRequirement;

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
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const HRJobRow = ({ job }: HRJobRowProps) => {
  return (
    <tr className="group transition-colors hover:bg-forest-950/[0.02]">
      <td className="px-5 py-5">
        <div className="flex min-w-[260px] items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-950 text-mint-400">
            <BriefcaseBusiness size={18} className="text-white" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-forest-950">
              {job.title}
            </p>

            <p className="mt-1 truncate text-sm text-text-secondary">
              {job.company}
            </p>

            {job.location && (
              <div className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
                <MapPin size={12} />
                <span>{job.location}</span>
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-5">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[job.status]}`}
        >
          {job.status}
        </span>
      </td>

      <td className="px-5 py-5 text-sm text-text-secondary">
        {formatExperience(job)}
      </td>

      <td className="px-5 py-5">
        <span className="text-sm text-forest-950">
          {job.employmentType || "Not specified"}
        </span>
      </td>

      <td className="px-5 py-5 text-sm text-text-secondary">
        {formatDate(job.createdAt)}
      </td>

      <td className="px-5 py-5 text-right">
        <Link
          to={`/hr/jobs/${job._id}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-forest-950 transition hover:bg-mint-500/10 hover:text-mint-700"
        >
          View
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </td>
    </tr>
  );
};

export default HRJobRow;
