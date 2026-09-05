import {
  AlertCircle,
  BarChart3,
  BriefcaseBusiness,
} from "lucide-react";

export const HRDashboardError = ({
  title,
  message,
  compact = false,
}: {
  title: string;
  message: string;
  compact?: boolean;
}) => {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-red-100
        bg-cream-50
        ${compact ? "p-4" : "p-8"}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-red-50 p-2 text-danger">
          <AlertCircle className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold text-forest-950">
            {title}
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export const HRNoJobs = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-100 text-forest-800">
          <BriefcaseBusiness className="h-7 w-7" />
        </div>

        <h1 className="mt-5 font-display text-2xl text-forest-950">
          No open jobs yet
        </h1>

        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Create and publish a job position before
          analyzing candidates.
        </p>
      </div>
    </div>
  );
};

export const HRDashboardEmpty = () => {
  return (
    <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-12 text-center">
      <BarChart3 className="mx-auto h-8 w-8 text-text-muted" />

      <h2 className="mt-4 font-display text-xl text-forest-950">
        No ATS analytics yet
      </h2>

      <p className="mt-2 text-sm text-text-secondary">
        Candidate analysis results will appear here once
        candidates are evaluated.
      </p>
    </div>
  );
};