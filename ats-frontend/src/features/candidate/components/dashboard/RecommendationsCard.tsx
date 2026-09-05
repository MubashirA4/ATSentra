import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";

import Card from "@shared/components/ui/Card";
import type { ResumeContent } from "@types/resume";

interface RecommendationsCardProps {
  resumeContent: ResumeContent | null;
  loading: boolean;
}

const RecommendationsCard = ({
  resumeContent,
  loading,
}: RecommendationsCardProps) => {
  if (loading) {
    return (
      <Card className="p-6 sm:p-7">
        <div className="animate-pulse">
          <div className="flex items-start justify-between">
            <div>
              <div className="h-3 w-28 rounded bg-cream-200" />
              <div className="mt-3 h-5 w-60 rounded bg-cream-200" />
            </div>

            <div className="h-9 w-9 rounded-md bg-cream-200" />
          </div>

          <div className="mt-7 space-y-5">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-3">
                <div className="h-6 w-6 shrink-0 rounded-full bg-cream-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-full rounded bg-cream-200" />
                  <div className="h-3 w-3/4 rounded bg-cream-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!resumeContent) {
    return (
      <Card className="p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-mint-100 text-forest-800">
            <Lightbulb className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
              Recommendations
            </p>

            <h2 className="mt-1 text-lg font-bold text-text-primary">
              Improve your resume
            </h2>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-text-secondary">
          Analyze a resume to receive personalized recommendations
          based on its quality and structure.
        </p>
      </Card>
    );
  }

  const issues = resumeContent.qualityAnalysis.issues ?? [];

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-forest-700/5 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-100 text-forest-800">
                <Lightbulb className="h-4 w-4" />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                Recommendations
              </p>
            </div>

            <h2 className="mt-3 font-display text-lg font-semibold text-text-primary">
              Improve your resume
            </h2>

            <p className="mt-1 text-sm leading-5 text-text-secondary">
              Focus on these areas to improve your resume quality.
            </p>
          </div>
        </div>

        {/* Recommendations */}
        {issues.length > 0 ? (
          <div className="mt-7 divide-y divide-border-subtle">
            {issues.slice(0, 5).map((issue, index) => (
              <div
                key={`${issue}-${index}`}
                className="flex gap-3 py-4 first:pt-0 last:pb-0"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream-100 text-[10px] font-bold text-text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />

                    <p className="text-sm leading-5 text-text-secondary">
                      {issue}
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-text-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-xl border border-border-subtle bg-surface-subtle px-4 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint-100">
                <CheckCircle2 className="h-4 w-4 text-forest-700" />
              </div>

              <div>
                <p className="text-sm font-semibold text-text-primary">
                  No major issues found
                </p>

                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  Your resume is currently performing well across the
                  evaluated quality criteria.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecommendationsCard;
