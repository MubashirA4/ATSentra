import { Search, X } from "lucide-react";

import type {
  ResumeStatus,
} from "@types/recruiterResume";

interface HRResumesFiltersProps {
  search: string;
  status: ResumeStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: ResumeStatus | "all",
  ) => void;
  onClear: () => void;
}

const HRResumesFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: HRResumesFiltersProps) => {
  const hasFilters =
    search.trim().length > 0 ||
    status !== "all";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search candidate or resume..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(
            event.target.value as ResumeStatus | "all",
          )
        }
        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="all">All statuses</option>
        <option value="uploaded">Uploaded</option>
        <option value="processing">Processing</option>
        <option value="processed">Processed</option>
        <option value="failed">Failed</option>
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <X size={16} />
          Clear
        </button>
      )}
    </div>
  );
};

export default HRResumesFilters;
