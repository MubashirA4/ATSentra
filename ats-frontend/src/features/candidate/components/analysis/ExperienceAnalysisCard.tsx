import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  Trophy,
} from "lucide-react";

import type {
  ParsedExperience,
  QualitySection,
} from "@types/resume";

interface ExperienceAnalysisCardProps {
  experience: ParsedExperience[];
  quality: QualitySection;
}

const ExperienceAnalysisCard = ({
  experience,
  quality,
}: ExperienceAnalysisCardProps) => {
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
            Experience analysis
          </p>

          <h2 className="mt-2 font-display text-2xl text-text-primary">
            Professional experience
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            A structured view of your professional experience,
            responsibilities, and measurable achievements.
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

      {/* Experience count */}
      <div className="mt-6 flex items-center gap-3 rounded-lg border border-cream-200 bg-surface-muted p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mint-100">
          <BriefcaseBusiness className="h-4 w-4 text-mint-500" />
        </div>

        <div>
          <p className="text-sm font-semibold text-text-primary">
            {experience.length}{" "}
            {experience.length === 1
              ? "experience"
              : "experiences"}{" "}
            detected
          </p>

          <p className="mt-0.5 text-xs text-text-muted">
            Professional experience extracted from your resume.
          </p>
        </div>
      </div>

      {/* Experience timeline */}
      <div className="mt-7">
        <h3 className="text-sm font-semibold text-text-primary">
          Experience history
        </h3>

        {experience.length > 0 ? (
          <div className="mt-5 space-y-6">
            {experience.map((item, index) => (
              <motion.article
                key={`${item.company}-${item.jobTitle}-${index}`}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.08,
                }}
                className="relative border-l-2 border-cream-200 pl-5"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-surface bg-mint-500" />

                {/* Job title */}
                <h4 className="text-base font-semibold text-text-primary">
                  {item.jobTitle}
                </h4>

                {/* Company */}
                <p className="mt-1 text-sm font-medium text-mint-600">
                  {item.company}
                </p>

                {/* Metadata */}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                  {(item.startDate || item.endDate) && (
                    <span>
                      {item.startDate || "Unknown"}{" "}
                      –{" "}
                      {item.endDate || "Present"}
                    </span>
                  )}

                  {item.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </span>
                  )}
                </div>

                {/* Responsibilities */}
                {item.responsibilities.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness className="h-4 w-4 text-text-secondary" />

                      <h5 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        Responsibilities
                      </h5>
                    </div>

                    <ul className="mt-3 space-y-2">
                      {item.responsibilities.map(
                        (responsibility, responsibilityIndex) => (
                          <li
                            key={`${responsibility}-${responsibilityIndex}`}
                            className="flex items-start gap-2"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cream-300" />

                            <p className="text-sm leading-5 text-text-secondary">
                              {responsibility}
                            </p>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {/* Achievements */}
                {item.achievements.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-mint-500" />

                      <h5 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        Achievements
                      </h5>
                    </div>

                    <ul className="mt-3 space-y-2">
                      {item.achievements.map(
                        (achievement, achievementIndex) => (
                          <li
                            key={`${achievement}-${achievementIndex}`}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />

                            <p className="text-sm leading-5 text-text-secondary">
                              {achievement}
                            </p>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {/* Empty experience content */}
                {item.responsibilities.length === 0 &&
                  item.achievements.length === 0 && (
                    <div className="mt-4 rounded-lg border border-dashed border-cream-300 p-4">
                      <p className="text-xs text-text-muted">
                        No responsibilities or achievements
                        were detected for this position.
                      </p>
                    </div>
                  )}
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-cream-300 p-6 text-center">
            <p className="text-sm text-text-secondary">
              No professional experience was detected in this resume.
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
                Experience strengths
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
                Experience improvements
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

export default ExperienceAnalysisCard;
