import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { ATSDashboardPagination } from "@types/atsDashboard";

interface HRDashboardPaginationProps {
  pagination: ATSDashboardPagination;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const HRDashboardPagination = ({
  pagination,
  onPageChange,
  loading = false,
}: HRDashboardPaginationProps) => {
  const {
    page,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = pagination;

  if (total === 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-cream-300 bg-cream-50 px-5 py-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      {/* Result information */}
      <div>
        <p className="text-sm text-text-secondary">
          Showing page{" "}
          <span className="font-semibold text-text-primary">
            {page}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-text-primary">
            {totalPages}
          </span>
        </p>

        <p className="mt-0.5 text-xs text-text-muted">
          {total} candidate{total === 1 ? "" : "s"} found
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!hasPreviousPage || loading}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm font-semibold text-text-primary transition hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-forest-950 px-3 text-sm font-bold text-white">
          {page}
        </div>

        <button
          type="button"
          disabled={!hasNextPage || loading}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm font-semibold text-text-primary transition hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default HRDashboardPagination;
