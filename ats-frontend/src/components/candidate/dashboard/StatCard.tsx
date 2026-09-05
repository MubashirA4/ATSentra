import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description: string;
  loading?: boolean;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
  loading = false,
}: StatCardProps) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-cream-200 bg-surface p-5 shadow-sm">
        <div className="animate-pulse">
          <div className="flex items-start justify-between">
            <div className="h-3 w-20 rounded bg-cream-200" />
            <div className="h-9 w-9 rounded-lg bg-cream-200" />
          </div>

          <div className="mt-6 h-8 w-20 rounded bg-cream-200" />

          <div className="mt-3 h-3 w-32 rounded bg-cream-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-xl border border-cream-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cream-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
          {label}
        </p>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cream-200 bg-surface-muted transition-colors duration-200 group-hover:border-mint-300 group-hover:bg-mint-100">
          <Icon className="h-4 w-4 text-text-muted transition-colors duration-200 group-hover:text-forest-700" />
        </div>
      </div>

      {/* Value */}
      <div className="mt-5">
        <p className="font-display text-3xl leading-none text-text-primary">
          {value}
        </p>
      </div>

      {/* Description */}
      <p className="mt-3 truncate text-xs leading-5 text-text-secondary">
        {description}
      </p>
    </div>
  );
};

export default StatCard;