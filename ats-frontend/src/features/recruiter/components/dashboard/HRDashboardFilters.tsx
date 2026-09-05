import { Search, SlidersHorizontal, X } from "lucide-react";

interface HRDashboardFiltersProps {
  search: string;
  skill: string;
  eligible: boolean | undefined;
  minScore: number | undefined;
  maxScore: number | undefined;

  onSearchChange: (value: string) => void;
  onSkillChange: (value: string) => void;
  onEligibleChange: (value: boolean | undefined) => void;
  onMinScoreChange: (value: number | undefined) => void;
  onMaxScoreChange: (value: number | undefined) => void;

  onClear: () => void;
}

const HRDashboardFilters = ({
  search,
  skill,
  eligible,
  minScore,
  maxScore,
  onSearchChange,
  onSkillChange,
  onEligibleChange,
  onMinScoreChange,
  onMaxScoreChange,
  onClear,
}: HRDashboardFiltersProps) => {
  const hasFilters =
    search.trim() !== "" ||
    skill.trim() !== "" ||
    eligible !== undefined ||
    minScore !== undefined ||
    maxScore !== undefined;

  return (
    <section className="rounded-xl border border-cream-300 bg-cream-50 p-5 shadow-soft">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-100 text-mint-500">
            <SlidersHorizontal size={17} />
          </div>

          <div>
            <h2 className="font-semibold text-text-primary">
              Candidate Filters
            </h2>

            <p className="text-xs text-text-secondary">
              Narrow candidates using ATS criteria.
            </p>
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 self-start rounded-lg px-3 py-2 text-xs font-semibold text-danger transition hover:bg-red-50 sm:self-auto"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
        {/* Search */}
        <div className="xl:col-span-2">
          <label
            htmlFor="candidate-search"
            className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted"
          >
            Search candidate
          </label>

          <div className="relative">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />

            <input
              id="candidate-search"
              type="text"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Name or email..."
              className="w-full rounded-lg border border-cream-300 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-mint-400 focus:ring-2 focus:ring-mint-100"
            />
          </div>
        </div>

        {/* Skill */}
        <div>
          <label
            htmlFor="candidate-skill"
            className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted"
          >
            Skill
          </label>

          <input
            id="candidate-skill"
            type="text"
            value={skill}
            onChange={(event) =>
              onSkillChange(event.target.value)
            }
            placeholder="e.g. React"
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-mint-400 focus:ring-2 focus:ring-mint-100"
          />
        </div>

        {/* Eligibility */}
        <div>
          <label
            htmlFor="candidate-eligibility"
            className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted"
          >
            Eligibility
          </label>

          <select
            id="candidate-eligibility"
            value={
              eligible === undefined
                ? "all"
                : eligible
                  ? "eligible"
                  : "ineligible"
            }
            onChange={(event) => {
              const value = event.target.value;

              if (value === "all") {
                onEligibleChange(undefined);
              } else {
                onEligibleChange(value === "eligible");
              }
            }}
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-mint-400 focus:ring-2 focus:ring-mint-100"
          >
            <option value="all">All candidates</option>
            <option value="eligible">Eligible</option>
            <option value="ineligible">Not eligible</option>
          </select>
        </div>

        {/* Score range */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">
            Score range
          </label>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              max={100}
              value={minScore ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                onMinScoreChange(
                  value === "" ? undefined : Number(value),
                );
              }}
              placeholder="Min"
              className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-mint-400 focus:ring-2 focus:ring-mint-100"
            />

            <input
              type="number"
              min={0}
              max={100}
              value={maxScore ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                onMaxScoreChange(
                  value === "" ? undefined : Number(value),
                );
              }}
              placeholder="Max"
              className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-mint-400 focus:ring-2 focus:ring-mint-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HRDashboardFilters;
