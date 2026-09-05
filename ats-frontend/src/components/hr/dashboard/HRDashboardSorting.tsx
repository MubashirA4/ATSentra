import { ArrowDownUp } from "lucide-react";

interface HRDashboardSortingProps {
  sortBy: "rankingScore" | "rank" | "createdAt";
  sortOrder: "asc" | "desc";
  onSortByChange: (
    value: "rankingScore" | "rank" | "createdAt",
  ) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
}

const HRDashboardSorting = ({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: HRDashboardSortingProps) => {
  return (
    <section className="rounded-xl border border-cream-300 bg-cream-50 p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Label */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-100 text-mint-500">
            <ArrowDownUp size={17} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-text-primary">
              Sort candidates
            </h2>

            <p className="text-xs text-text-secondary">
              Choose how candidates are ordered.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={sortBy}
            onChange={(event) =>
              onSortByChange(
                event.target.value as
                  | "rankingScore"
                  | "rank"
                  | "createdAt",
              )
            }
            className="rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm font-medium text-text-primary outline-none transition focus:border-mint-400 focus:ring-2 focus:ring-mint-100"
          >
            <option value="rankingScore">
              Ranking Score
            </option>

            <option value="rank">
              Rank
            </option>

            <option value="createdAt">
              Recently Analyzed
            </option>
          </select>

          <select
  value={sortOrder}
  onChange={(event) =>
    onSortOrderChange(
      event.target.value as "asc" | "desc",
    )
  }
  className="rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm font-medium text-text-primary outline-none transition focus:border-mint-400 focus:ring-2 focus:ring-mint-100"
>
  <option value="desc">
    {sortBy === "createdAt"
      ? "Newest first"
      : sortBy === "rank"
        ? "Best rank first"
        : "Highest first"}
  </option>

  <option value="asc">
    {sortBy === "createdAt"
      ? "Oldest first"
      : sortBy === "rank"
        ? "Worst rank first"
        : "Lowest first"}
  </option>
</select>
        </div>
      </div>
    </section>
  );
};

export default HRDashboardSorting;