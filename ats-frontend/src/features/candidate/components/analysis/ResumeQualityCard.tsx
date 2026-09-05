import { motion } from "framer-motion";
import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Languages,
  Lightbulb,
  ListChecks,
  Mail,
  Sparkles,
  Wrench,
  XCircle,
} from "lucide-react";

import type {
  ResumeQualityAnalysis,
  QualitySection,
} from "@types/resume";

interface ResumeQualityCardProps {
  quality: ResumeQualityAnalysis;
}

interface QualityMetric {
  key: keyof ResumeQualityAnalysis["breakdown"];
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}

const QUALITY_METRICS: QualityMetric[] = [
  {
    key: "contact",
    label: "Contact",
    icon: Mail,
  },
  {
    key: "summary",
    label: "Summary",
    icon: FileCheck2,
  },
  {
    key: "skills",
    label: "Skills",
    icon: Wrench,
  },
  {
    key: "experience",
    label: "Experience",
    icon: BriefcaseBusiness,
  },
  {
    key: "education",
    label: "Education",
    icon: GraduationCap,
  },
  {
    key: "projects",
    label: "Projects",
    icon: ListChecks,
  },
  {
    key: "certifications",
    label: "Certifications",
    icon: Award,
  },
  {
    key: "languages",
    label: "Languages",
    icon: Languages,
  },
  {
    key: "achievements",
    label: "Achievements",
    icon: Sparkles,
  },
  {
    key: "structure",
    label: "Structure",
    icon: FileCheck2,
  },
];

const getPercentage = (
  section: QualitySection,
) => {
  if (section.maxScore <= 0) {
    return 0;
  }

  return Math.round(
    (section.score / section.maxScore) * 100,
  );
};

const ResumeQualityCard = ({
  quality,
}: ResumeQualityCardProps) => {
  return (
    <div className="rounded-xl border border-cream-300 bg-white p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-500">
            Resume quality
          </p>

          <h2 className="mt-2 font-display text-2xl text-text-primary">
            Overall resume health
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
            A breakdown of how complete, structured, and
            ATS-friendly your resume currently is.
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-display text-3xl text-text-primary">
            {quality.percentage}%
          </p>

          <p className="mt-1 text-xs font-medium text-text-secondary">
            {quality.rating}
          </p>
        </div>
      </div>

      {/* Overall progress */}
      <div className="mt-6">
        <div className="h-2 overflow-hidden rounded-full bg-cream-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${quality.percentage}%`,
            }}
            transition={{
              duration: 0.8,
            }}
            className="h-full rounded-full bg-mint-500"
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Resume quality score
          </span>

          <span className="text-xs font-semibold text-text-secondary">
            {quality.score} / {quality.maxScore}
          </span>
        </div>
      </div>

      {/* Quality breakdown */}
      <div className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">
            Quality breakdown
          </h3>

          <span className="text-xs text-text-muted">
            {QUALITY_METRICS.length} categories
          </span>
        </div>

        <div className="space-y-4">
          {QUALITY_METRICS.map(
            (metric, index) => {
              const section =
                quality.breakdown[metric.key];

              const percentage =
                getPercentage(section);

              const Icon = metric.icon;

              return (
                <motion.div
                  key={metric.key}
                  initial={{
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.04,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cream-100">
                      <Icon className="h-4 w-4 text-text-secondary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-text-primary">
                          {metric.label}
                        </span>

                        <span className="text-xs font-semibold text-text-secondary">
                          {section.score} /{" "}
                          {section.maxScore}
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-200">
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${percentage}%`,
                          }}
                          transition={{
                            duration: 0.6,
                            delay:
                              index * 0.04 +
                              0.1,
                          }}
                          className="h-full rounded-full bg-mint-500"
                        />
                      </div>
                    </div>

                    <span className="w-10 text-right text-xs font-semibold text-text-secondary">
                      {percentage}%
                    </span>
                  </div>
                </motion.div>
              );
            },
          )}
        </div>
      </div>

      {/* Strengths */}
      {quality.strengths.length > 0 && (
        <div className="mt-7 border-t border-cream-200 pt-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />

            <h3 className="text-sm font-semibold text-text-primary">
              Strengths
            </h3>
          </div>

          <div className="mt-3 space-y-2">
            {quality.strengths.map(
              (strength, index) => (
                <div
                  key={`${strength}-${index}`}
                  className="flex items-start gap-2"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />

                  <p className="text-sm leading-5 text-text-secondary">
                    {strength}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Issues */}
      {quality.issues.length > 0 && (
        <div className="mt-6 border-t border-cream-200 pt-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-warning" />

            <h3 className="text-sm font-semibold text-text-primary">
              Areas to improve
            </h3>
          </div>

          <div className="mt-3 space-y-2">
            {quality.issues.map(
              (issue, index) => (
                <div
                  key={`${issue}-${index}`}
                  className="flex items-start gap-2"
                >
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />

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
  );
};

export default ResumeQualityCard;
