import Card from "../../ui/Card";
import type { ResumeContent } from "../../../types/resume";

interface ATSBreakdownCardProps {
  resumeContent: ResumeContent | null;
  loading: boolean;
}

const ATSBreakdownCard = ({
  resumeContent,
  loading,
}: ATSBreakdownCardProps) => {
  if (loading) {
    return (
      <Card className="p-6 sm:p-7">
        <div className="animate-pulse">
          <div className="h-3 w-28 rounded bg-cream-200" />
          <div className="mt-3 h-5 w-52 rounded bg-cream-200" />
          <div className="mt-2 h-4 w-full rounded bg-cream-200" />

          <div className="mt-7 space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <div className="mb-2 flex justify-between">
                  <div className="h-3 w-24 rounded bg-cream-200" />
                  <div className="h-3 w-10 rounded bg-cream-200" />
                </div>

                <div className="h-2 rounded-full bg-cream-200" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!resumeContent) {
    return (
      <Card className="flex min-h-[260px] items-center justify-center p-6 text-center">
        <div>
          <p className="text-sm font-medium text-text-secondary">
            ATS breakdown unavailable
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Analyze a resume to see your ATS performance.
          </p>
        </div>
      </Card>
    );
  }

  const breakdown = resumeContent.qualityAnalysis.breakdown;

  const metrics = [
    {
      label: "Skills Match",
      section: breakdown.skills,
    },
    {
      label: "Experience",
      section: breakdown.experience,
    },
    {
      label: "Education",
      section: breakdown.education,
    },
    {
      label: "Resume Structure",
      section: breakdown.structure,
    },
  ];

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-forest-700/5 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
            ATS breakdown
          </p>

          <h2 className="mt-2 font-display text-lg font-semibold text-text-primary">
            What is driving your score?
          </h2>

          <p className="mt-1 text-sm leading-5 text-text-secondary">
            Your resume quality is evaluated across several important
            dimensions.
          </p>
        </div>

        {/* Overall score */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-border-subtle bg-surface-subtle px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
              Overall quality
            </p>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-text-primary">
                {resumeContent.qualityAnalysis.percentage}%
              </span>

              <span className="text-xs font-medium text-text-secondary">
                {resumeContent.qualityAnalysis.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-7 space-y-5">
          {metrics.map((metric) => {
            const percentage =
              metric.section.maxScore > 0
                ? Math.round(
                    (metric.section.score /
                      metric.section.maxScore) *
                      100
                  )
                : 0;

            return (
              <div key={metric.label}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-secondary">
                    {metric.label}
                  </span>

                  <span className="text-xs font-bold text-text-primary">
                    {percentage}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-mint-100">
                  <div
                    className="h-full rounded-full bg-mint-500 transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(
                        Math.max(percentage, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-border-subtle pt-5">
          <p className="text-xs leading-5 text-text-muted">
            Stronger scores indicate better resume quality across
            ATS-relevant criteria.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ATSBreakdownCard;