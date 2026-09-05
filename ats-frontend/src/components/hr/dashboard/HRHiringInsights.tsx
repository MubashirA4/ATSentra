import {
  CheckCircle2,
  Clock3,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

import type {
  ATSExperienceStats,
  ATSEducationStats,
} from "../../../types/atsDashboard";

interface HRHiringInsightsProps {
  experience: ATSExperienceStats;
  education: ATSEducationStats;
}

const HRHiringInsights = ({
  experience,
  education,
}: HRHiringInsightsProps) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-cream-300
        bg-cream-50
        p-5
        shadow-soft
      "
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-mint-500">
        Candidate Fit
      </p>

      <h2 className="mt-1 font-display text-xl text-forest-950">
        Hiring insights
      </h2>

      <p className="mt-1 text-xs text-text-secondary">
        Experience and education alignment.
      </p>

      <div className="mt-6 space-y-5">
        <InsightRow
          icon={Clock3}
          label="Average experience"
          value={`${experience.averageCandidateYears.toFixed(
            1,
          )} yrs`}
          secondary={`Required ${experience.averageRequiredYears.toFixed(
            1,
          )} yrs`}
        />

        <InsightRow
          icon={CheckCircle2}
          label="Experience matched"
          value={experience.experienceMatched}
          secondary={`${experience.experienceNotMatched} not matched`}
        />

        <InsightRow
          icon={GraduationCap}
          label="Education matched"
          value={education.educationMatched}
          secondary={`${education.educationNotMatched} not matched`}
        />

        <InsightRow
          icon={TrendingUp}
          label="Education score"
          value={`${Math.round(
            education.averageEducationScore,
          )}%`}
          secondary="Average"
        />
      </div>
    </div>
  );
};

interface InsightRowProps {
  icon: typeof Clock3;
  label: string;
  value: string | number;
  secondary: string;
}

const InsightRow = ({
  icon: Icon,
  label,
  value,
  secondary,
}: InsightRowProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-100 text-forest-800">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-forest-900">
          {label}
        </p>

        <p className="text-xs text-text-muted">
          {secondary}
        </p>
      </div>

      <p className="text-lg font-extrabold text-forest-950">
        {value}
      </p>
    </div>
  );
};

export default HRHiringInsights;