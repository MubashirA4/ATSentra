import {
  ChevronDown,
  RefreshCw,
} from "lucide-react";

import type { ATSJob } from "@types/job";

interface HRDashboardHeaderProps {
  jobs: ATSJob[];
  selectedJobId: string;
  onJobChange: (jobId: string) => void;
  loading: boolean;
  onRefresh: () => Promise<void>;
}

const HRDashboardHeader = ({
  jobs,
  selectedJobId,
  onJobChange,
  loading,
  onRefresh,
}: HRDashboardHeaderProps) => {
  return (
    <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.16em]
            text-mint-500
          "
        >
          Recruitment Overview
        </p>

        <h1
          className="
            mt-1
            font-display
            text-3xl
            text-forest-950
            sm:text-4xl
          "
        >
          Hiring at a glance
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-text-secondary">
          Monitor candidate quality, ATS performance, and
          hiring eligibility for your active position.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={selectedJobId}
            onChange={(event) =>
              onJobChange(event.target.value)
            }
            className="
              appearance-none
              rounded-xl
              border
              border-cream-300
              bg-cream-50
              py-2.5
              pl-4
              pr-10
              text-sm
              font-semibold
              text-forest-900
              shadow-soft
              outline-none
              transition
              focus:border-mint-400
              focus:ring-2
              focus:ring-mint-100
            "
          >
            {jobs.map((job) => (
              <option
                key={job._id}
                value={job._id}
              >
                {job.title}
              </option>
            ))}
          </select>

          <ChevronDown
            className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-text-muted
            "
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="
            flex
            items-center
            justify-center
            rounded-xl
            border
            border-cream-300
            bg-cream-50
            p-2.5
            text-text-secondary
            shadow-soft
            transition
            hover:border-mint-300
            hover:bg-mint-100
            hover:text-forest-900
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          aria-label="Refresh dashboard"
        >
          <RefreshCw
            className={`h-[18px] w-[18px] ${
              loading ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>
    </section>
  );
};

export default HRDashboardHeader;
