import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from "../../ui/Card";
import ScoreRing from "../../ui/ScoreRing";

import type {
  Resume,
  ResumeContent,
} from "../../../types/resume";

interface LatestAnalysisCardProps {
  resume: Resume | null;
  resumeContent: ResumeContent | null;
  loading: boolean;
}

const LatestAnalysisCard = ({
  resume,
  resumeContent,
  loading,
}: LatestAnalysisCardProps) => {
  const navigate = useNavigate();

  /* --------------------------------
   * Loading State
   * -------------------------------- */
  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="animate-pulse">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-3.5 w-32 rounded bg-cream-200" />
              <div className="h-5 w-52 rounded bg-cream-200" />
            </div>

            <div className="h-8 w-24 rounded-lg bg-cream-200" />
          </div>

          <div className="mt-8 flex items-center gap-6">
            <div className="h-28 w-28 rounded-full bg-cream-200" />

            <div className="flex-1 space-y-3">
              <div className="h-3.5 w-28 rounded bg-cream-200" />
              <div className="h-7 w-20 rounded bg-cream-200" />
              <div className="h-3.5 w-32 rounded bg-cream-200" />
            </div>
          </div>

          <div className="mt-8 h-px bg-cream-200" />

          <div className="mt-5 flex gap-3">
            <div className="h-9 flex-1 rounded-lg bg-cream-200" />
            <div className="h-9 w-28 rounded-lg bg-cream-200" />
          </div>
        </div>
      </Card>
    );
  }

  /* --------------------------------
   * Empty State
   * -------------------------------- */
  if (!resume || !resumeContent) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-forest-700/5 blur-3xl" />

        <div className="relative flex min-h-[300px] flex-col items-center justify-center px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-700/10">
            <FileText className="h-6 w-6 text-forest-700" />
          </div>

          <h3 className="mt-5 font-display text-xl font-semibold text-text-primary">
            Start your resume analysis
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
            Upload your resume to get an ATS score, resume quality
            insights, keyword coverage, and actionable recommendations.
          </p>

          <button
            type="button"
            onClick={() => navigate("/resume/upload")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-forest-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-forest-800 hover:shadow-md active:scale-[0.98]"
          >
            Analyze Resume
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </Card>
    );
  }

  const quality = resumeContent.qualityAnalysis;

  return (
    <Card className="relative overflow-hidden p-6">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-forest-700/5 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-700/10">
                <FileText className="h-4 w-4 text-forest-700" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                Latest analysis
              </p>
            </div>

            <h3
              className="mt-3 truncate font-display text-lg font-semibold text-text-primary"
              title={resume.originalName}
            >
              {resume.originalName}
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              Resume quality overview
            </p>
          </div>

         
        </div>

        {/* Score section */}
        <div className="mt-8 flex flex-col gap-7 sm:flex-row sm:items-center">
          {/* Score ring */}
          <div className="flex shrink-0 justify-center sm:justify-start">
            <ScoreRing score={quality.percentage} />
          </div>

          {/* Score information */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text-secondary">
                Resume Quality
              </p>

              <span className="inline-flex items-center gap-1 rounded-full bg-forest-700/10 px-2 py-0.5 text-[11px] font-semibold text-forest-700">
                <CheckCircle2 className="h-3 w-3" />
                Analyzed
              </span>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold tracking-tight text-text-primary">
                {quality.percentage}%
              </span>

              <span className="text-sm text-text-muted">
                overall quality
              </span>
            </div>

            <p className="mt-2 text-sm font-medium text-text-secondary">
              {quality.rating}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
              <Sparkles className="h-3.5 w-3.5 text-forest-700" />
              <span>
                Based on resume structure, content and quality signals
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-border-subtle pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Analysis status
              </p>

              <p className="mt-1 text-sm font-medium text-text-primary">
                Your resume has been successfully analyzed
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(`/resume-analysis/${resume._id}`)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition-all duration-200 hover:border-forest-700/30 hover:bg-forest-700/5 hover:text-forest-700"
            >
              Open full analysis
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LatestAnalysisCard;