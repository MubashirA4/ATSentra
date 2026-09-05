import {
  AlertCircle,
  BriefcaseBusiness,
  RefreshCcw,
  SearchX,
} from "lucide-react";

interface ErrorProps {
  message: string;
  onRetry: () => void;
}

export const HRJobsError = ({
  message,
  onRetry,
}: ErrorProps) => {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center px-4">
      <div className="w-full rounded-2xl border border-red-500/20 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-600">
          <AlertCircle size={22} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-forest-950">
          Unable to load jobs
        </h2>

        <p className="mt-2 text-sm text-text-secondary">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-forest-950 px-4 text-sm font-semibold text-white transition hover:bg-forest-900"
        >
          <RefreshCcw size={16} />
          Try again
        </button>
      </div>
    </div>
  );
};

interface EmptyProps {
  hasFilters: boolean;
  onClear: () => void;
}

export const HRJobsEmpty = ({
  hasFilters,
  onClear,
}: EmptyProps) => {
  if (hasFilters) {
    return (
      <div className="rounded-2xl border border-dashed border-forest-900/15 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-950/[0.05] text-text-secondary">
          <SearchX size={22} />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-forest-950">
          No matching jobs
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
          Try changing your search or status filter to
          find the job you&apos;re looking for.
        </p>

        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-xl bg-forest-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-900"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-forest-900/15 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint-500/10 text-mint-600">
        <BriefcaseBusiness size={22} className="text-white"/>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-forest-950">
        No jobs yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
        Create your first recruitment position to start
        managing candidates through ATSentra.
      </p>
    </div>
  );
};