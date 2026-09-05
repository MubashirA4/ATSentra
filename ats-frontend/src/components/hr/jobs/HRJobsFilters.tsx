import {
  Filter,
  Search,
  X,
} from "lucide-react";

import type { JobStatus } from "../../../types/job";

type SortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "company-asc";

interface HRJobsFiltersProps {
  search: string;
  status: JobStatus | "all";
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: JobStatus | "all") => void;
  onSortChange: (value: SortOption) => void;
  onClear: () => void;
  hasFilters: boolean;
}

const HRJobsFilters = ({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onClear,
  hasFilters,
}: HRJobsFiltersProps) => {
  return (
    <div className="rounded-2xl border border-forest-900/10 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
          />

          <input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search jobs, companies or locations..."
            className="h-11 w-full rounded-xl border border-forest-900/10 bg-white pl-10 pr-4 text-sm text-forest-950 outline-none transition focus:border-mint-400 focus:ring-2 focus:ring-mint-400/15"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Filter
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />

            <select
              value={status}
              onChange={(event) =>
                onStatusChange(
                  event.target.value as JobStatus | "all",
                )
              }
              className="h-11 w-full min-w-[150px] appearance-none rounded-xl border border-forest-900/10 bg-white pl-9 pr-9 text-sm font-medium text-forest-950 outline-none focus:border-mint-400 focus:ring-2 focus:ring-mint-400/15 sm:w-auto"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(event) =>
                onSortChange(
                  event.target.value as SortOption,
                )
              }
              className="h-11 w-full min-w-[170px] appearance-none rounded-xl border border-forest-900/10 bg-white px-4 pr-9 text-sm font-medium text-forest-950 outline-none focus:border-mint-400 focus:ring-2 focus:ring-mint-400/15 sm:w-auto"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title-asc">Title A–Z</option>
              <option value="title-desc">Title Z–A</option>
              <option value="company-asc">
                Company A–Z
              </option>
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-forest-900/10 px-4 text-sm font-semibold text-text-secondary transition hover:bg-forest-950/[0.03] hover:text-forest-950"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRJobsFilters;