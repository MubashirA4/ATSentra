import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface HRJobsPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const HRJobsPagination = ({
  page,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: HRJobsPaginationProps) => {
  const start =
    totalItems === 0
      ? 0
      : (page - 1) * itemsPerPage + 1;

  const end = Math.min(
    page * itemsPerPage,
    totalItems,
  );

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-forest-900/10 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-text-secondary">
        Showing{" "}
        <span className="font-semibold text-forest-950">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-forest-950">
          {totalItems}
        </span>{" "}
        jobs
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-forest-900/10 text-forest-950 transition hover:bg-forest-950/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={17} />
        </button>

        <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-forest-950 px-3 text-sm font-semibold text-white">
          {page}
        </div>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-forest-900/10 text-forest-950 transition hover:bg-forest-950/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
};

export default HRJobsPagination;
