import {
  Award,
  CheckCircle2,
  Target,
  Users,
} from "lucide-react";

import type { ATSCandidateResult } from "@types/atsAnalysis";

interface ATSOverviewProps {
  candidates: ATSCandidateResult[];
}

const ATSOverview = ({
  candidates,
}: ATSOverviewProps) => {
  const eligible = candidates.filter(
    (candidate) => candidate.eligible,
  ).length;

  const averageScore =
    candidates.length > 0
      ? Math.round(
          candidates.reduce(
            (total, candidate) =>
              total + candidate.rankingScore,
            0,
          ) / candidates.length,
        )
      : 0;

  const topScore =
    candidates.length > 0
      ? Math.max(
          ...candidates.map(
            (candidate) => candidate.rankingScore,
          ),
        )
      : 0;

  const stats = [
    {
      label: "Candidates",
      value: candidates.length,
      icon: Users,
    },
    {
      label: "Eligible",
      value: eligible,
      icon: CheckCircle2,
    },
    {
      label: "Average Score",
      value: `${averageScore}%`,
      icon: Target,
    },
    {
      label: "Top Score",
      value: `${topScore}%`,
      icon: Award,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon size={19} />
              </div>

              <span className="text-2xl font-bold text-slate-900">
                {stat.value}
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ATSOverview;
