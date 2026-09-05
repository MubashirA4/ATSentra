import {
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  XCircle,
} from "lucide-react";

import type { JobsStats } from "@types/job";

interface HRJobsStatsProps {
  stats: JobsStats;
}

const HRJobsStats = ({ stats }: HRJobsStatsProps) => {
  const statsItems = [
    {
      label: "All Jobs",
      value: stats.all,
      icon: BriefcaseBusiness,
    },
    {
      label: "Open",
      value: stats.open,
      icon: CheckCircle2,
    },
    {
      label: "Draft",
      value: stats.draft,
      icon: FileText,
    },
    {
      label: "Closed",
      value: stats.closed,
      icon: XCircle,
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statsItems.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-forest-900/10 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-forest-950">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-500/10 text-mint-500">
                <Icon size={19} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HRJobsStats;
