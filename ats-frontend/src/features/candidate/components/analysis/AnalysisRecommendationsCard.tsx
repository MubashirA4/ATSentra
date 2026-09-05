import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";

interface AnalysisRecommendationsCardProps {
  issues: string[];
  strengths: string[];
}

const AnalysisRecommendationsCard = ({
  issues,
  strengths,
}: AnalysisRecommendationsCardProps) => {
  const hasIssues = issues.length > 0;
  const hasStrengths = strengths.length > 0;

  return (
    <div className="rounded-xl border border-cream-300 bg-white p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mint-100">
          <Lightbulb className="h-4 w-4 text-mint-500" />
        </div>

        <div>
          <h2 className="font-display text-lg text-text-primary">
            Recommendations
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Practical improvements based on your resume analysis
          </p>
        </div>
      </div>

      {/* Issues */}
      {hasIssues && (
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />

            <h3 className="text-sm font-semibold text-text-primary">
              Areas to improve
            </h3>
          </div>

          <div className="mt-3 space-y-3">
            {issues.map((issue, index) => (
              <div
                key={`issue-${index}`}
                className="rounded-lg border border-cream-300 bg-surface-muted p-4"
              >
                <div className="flex gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warning/10 text-xs font-semibold text-warning">
                    {index + 1}
                  </span>

                  <p className="text-sm leading-6 text-text-secondary">
                    {issue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths */}
      {hasStrengths && (
        <div className={`${hasIssues ? "mt-7" : "mt-6"}`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-mint-500" />

            <h3 className="text-sm font-semibold text-text-primary">
              What you're doing well
            </h3>
          </div>

          <div className="mt-3 space-y-3">
            {strengths.map((strength, index) => (
              <div
                key={`strength-${index}`}
                className="flex gap-3 rounded-lg border border-cream-300 bg-surface-muted p-4"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint-500" />

                <p className="text-sm leading-6 text-text-secondary">
                  {strength}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasIssues && !hasStrengths && (
        <div className="mt-6 rounded-lg border border-dashed border-cream-300 bg-surface-muted px-4 py-8 text-center">
          <Lightbulb className="mx-auto h-5 w-5 text-text-muted" />

          <p className="mt-2 text-sm text-text-muted">
            No specific recommendations were generated.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisRecommendationsCard;
