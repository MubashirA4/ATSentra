import { Check, Search, X } from "lucide-react";

import Badge from "@shared/components/ui/Badge";
import Card from "@shared/components/ui/Card";
import type { ResumeContent } from "@types/resume";

interface KeywordCoverageCardProps {
  resumeContent: ResumeContent | null;
  loading: boolean;
}

const KeywordCoverageCard = ({
  resumeContent,
  loading,
}: KeywordCoverageCardProps) => {
  if (loading) {
    return (
      <Card className="p-6 sm:p-7">
        <div className="animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="h-3 w-28 rounded bg-cream-200" />
              <div className="mt-3 h-5 w-72 rounded bg-cream-200" />
              <div className="mt-2 h-3 w-full max-w-xl rounded bg-cream-200" />
              <div className="mt-2 h-3 w-3/4 max-w-xl rounded bg-cream-200" />
            </div>

            <div className="h-7 w-24 rounded-full bg-cream-200" />
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="h-32 rounded-lg bg-cream-200" />
            <div className="h-32 rounded-lg bg-cream-200" />
          </div>

          <div className="mt-6">
            <div className="mb-2 h-3 w-32 rounded bg-cream-200" />
            <div className="h-2 rounded-full bg-cream-200" />
          </div>

          <div className="mt-6 border-t border-cream-300 pt-5">
            <div className="h-3 w-full rounded bg-cream-200" />
            <div className="mt-2 h-3 w-4/5 rounded bg-cream-200" />
          </div>
        </div>
      </Card>
    );
  }

  if (!resumeContent) {
    return (
      <Card className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
              Skills coverage
            </p>

            <h2 className="mt-2 text-lg font-bold text-text-primary">
              How well your resume presents your skills
            </h2>

            <p className="mt-1 max-w-xl text-xs leading-5 text-text-secondary">
              Analyze a resume to see your detected skills and skills
              quality score.
            </p>
          </div>
        </div>

        <div className="mt-7 rounded-lg border border-border-subtle bg-surface-subtle p-5">
          <p className="text-sm font-medium text-text-primary">
            No resume analysis available
          </p>

          <p className="mt-1 text-xs leading-5 text-text-secondary">
            Upload and analyze a resume to see your skills coverage.
          </p>
        </div>
      </Card>
    );
  }

  const skillsSection = resumeContent.qualityAnalysis.breakdown.skills;

  const score =
    skillsSection.maxScore > 0
      ? Math.round(
          (skillsSection.score / skillsSection.maxScore) * 100
        )
      : 0;

  const skills = resumeContent.parsedResume.skills ?? [];

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-forest-700/5 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
              Skills coverage
            </p>

            <h2 className="mt-2 text-lg font-bold text-text-primary">
              How well your resume presents your skills
            </h2>

            <p className="mt-1 max-w-xl text-xs leading-5 text-text-secondary">
              Your skills section is evaluated based on the information
              detected from your resume.
            </p>
          </div>

          <Badge variant="mint">
            {score}% quality
          </Badge>
        </div>

        {/* Score summary */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {/* Detected skills */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-green-700">
                <Check className="h-4 w-4" />
              </div>

              <span className="text-xs font-semibold text-green-800">
                Detected skills
              </span>
            </div>

            <p className="mt-3 font-display text-3xl text-green-800">
              {skills.length}
            </p>

            <p className="mt-1 text-[11px] text-green-700">
              Skills identified in your resume
            </p>
          </div>

          {/* Skills issues */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-amber-700">
                <X className="h-4 w-4" />
              </div>

              <span className="text-xs font-semibold text-amber-800">
                Skills issues
              </span>
            </div>

            <p className="mt-3 font-display text-3xl text-amber-800">
              {skillsSection.issues.length}
            </p>

            <p className="mt-1 text-[11px] text-amber-700">
              Areas that may need improvement
            </p>
          </div>
        </div>

        {/* Coverage bar */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">
              Skills quality
            </span>

            <span className="text-xs font-bold text-text-primary">
              {score}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-cream-200">
            <div
              className="h-full rounded-full bg-mint-500 transition-all duration-700"
              style={{
                width: `${Math.min(Math.max(score, 0), 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Detected skills */}
        {skills.length > 0 && (
          <div className="mt-6 border-t border-cream-300 pt-5">
            <div className="flex items-start gap-3">
              <Search className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" />

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-text-primary">
                  Detected skills
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-border-subtle bg-surface-subtle px-2.5 py-1 text-[11px] font-medium text-text-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="mt-6 flex gap-3 border-t border-cream-300 pt-5">
          <Search className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" />

          <p className="text-xs leading-5 text-text-secondary">
            This score reflects the quality of the skills information
            detected from your resume. True keyword coverage requires
            comparing your resume against a specific job description.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default KeywordCoverageCard;
