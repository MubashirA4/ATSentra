import type { ATSJob } from "@types/job";

interface HRJobContextCardProps {
  job: ATSJob;
}

const HRJobContextCard = ({
  job,
}: HRJobContextCardProps) => {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-cream-300
        bg-cream-50
        p-5
        shadow-soft
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-20
          h-48
          w-48
          rounded-full
          bg-mint-100/70
          blur-3xl
        "
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            Active Position
          </p>

          <h2 className="mt-1 text-lg font-bold text-forest-950">
            {job.title}
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            {job.company}
            {job.location
              ? ` · ${job.location}`
              : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {job.employmentType && (
            <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-semibold text-forest-800">
              {job.employmentType}
            </span>
          )}

          <span className="rounded-full bg-forest-900 px-3 py-1 text-xs font-semibold text-mint-100">
            {job.status}
          </span>
        </div>
      </div>
    </section>
  );
};

export default HRJobContextCard;
