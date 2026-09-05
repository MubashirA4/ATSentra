import { motion } from "framer-motion";
import { CheckCircle2, Code2 } from "lucide-react";

import type {
  ParsedResume,
  ResumeQualityAnalysis,
} from "../../../types/resume";

interface SkillsAnalysisCardProps {
  skills: ParsedResume["skills"];
  quality: ResumeQualityAnalysis["breakdown"]["skills"];
}

const SkillsAnalysisCard = ({
  skills,
  quality,
}: SkillsAnalysisCardProps) => {
  const percentage =
    quality.maxScore > 0
      ? Math.round(
          (quality.score / quality.maxScore) * 100,
        )
      : 0;

  return (
    <div className="rounded-xl border border-cream-300 bg-white p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-500">
            Skills analysis
          </p>

          <h2 className="mt-2 font-display text-2xl text-text-primary">
            Technical skills
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            Skills detected from your resume and evaluated for
            completeness and relevance.
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-display text-2xl text-text-primary">
            {quality.score}
            <span className="text-sm font-normal text-text-muted">
              {" "}
              / {quality.maxScore}
            </span>
          </p>

          <p className="mt-1 text-xs font-medium text-text-secondary">
            {percentage}% quality
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="h-2 overflow-hidden rounded-full bg-cream-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${percentage}%`,
            }}
            transition={{
              duration: 0.7,
            }}
            className="h-full rounded-full bg-mint-500"
          />
        </div>
      </div>

      {/* Skills count */}
      <div className="mt-6 flex items-center gap-3 rounded-lg border border-cream-200 bg-surface-muted p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mint-100">
          <Code2 className="h-4 w-4 text-mint-500" />
        </div>

        <div>
          <p className="text-sm font-semibold text-text-primary">
            {skills.length} skills detected
          </p>

          <p className="mt-0.5 text-xs text-text-muted">
            Skills extracted from your resume content.
          </p>
        </div>
      </div>

      {/* Skills list */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">
            Detected skills
          </h3>

          <span className="text-xs text-text-muted">
            {skills.length} total
          </span>
        </div>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <motion.div
                key={`${skill}-${index}`}
                initial={{ 
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.025,
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-cream-300 bg-surface-muted px-3 py-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-mint-500" />

                <span className="text-sm font-medium text-text-primary">
                  {skill}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-cream-300 p-6 text-center">
            <p className="text-sm text-text-secondary">
              No skills were detected in this resume.
            </p>
          </div>
        )}
      </div>

      {/* Quality feedback */}
      {(quality.strengths.length > 0 ||
        quality.issues.length > 0) && (
        <div className="mt-7 border-t border-cream-200 pt-6">
          {quality.strengths.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Skills strengths
              </h3>

              <div className="mt-3 space-y-2">
                {quality.strengths.map(
                  (strength, index) => (
                    <div
                      key={`${strength}-${index}`}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />

                      <p className="text-sm leading-5 text-text-secondary">
                        {strength}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {quality.issues.length > 0 && (
            <div
              className={
                quality.strengths.length > 0
                  ? "mt-5"
                  : undefined
              }
            >
              <h3 className="text-sm font-semibold text-text-primary">
                Skills improvements
              </h3>

              <div className="mt-3 space-y-2">
                {quality.issues.map(
                  (issue, index) => (
                    <div
                      key={`${issue}-${index}`}
                      className="flex items-start gap-2"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />

                      <p className="text-sm leading-5 text-text-secondary">
                        {issue}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsAnalysisCard;