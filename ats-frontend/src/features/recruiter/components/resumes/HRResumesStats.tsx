import {
  CheckCircle2,
  Clock3,
  FileText,
  XCircle,
} from "lucide-react";

import type {
  RecruiterResume,
} from "@types/recruiterResume";

interface HRResumesStatsProps {
  resumes: RecruiterResume[];
}

const HRResumesStats = ({
  resumes,
}: HRResumesStatsProps) => {
  const stats = {
    total: resumes.length,
    processed: resumes.filter(
      (resume) => resume.status === "processed",
    ).length,
    processing: resumes.filter(
      (resume) => resume.status === "processing",
    ).length,
    failed: resumes.filter(
      (resume) => resume.status === "failed",
    ).length,
  };

  const cards = [
    {
      label: "Total Resumes",
      value: stats.total,
      icon: FileText,
    },
    {
      label: "Processed",
      value: stats.processed,
      icon: CheckCircle2,
    },
    {
      label: "Processing",
      value: stats.processing,
      icon: Clock3,
    },
    {
      label: "Failed",
      value: stats.failed,
      icon: XCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1  gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-cream-50 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {card.label}
                </p>

                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {card.value}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HRResumesStats;
