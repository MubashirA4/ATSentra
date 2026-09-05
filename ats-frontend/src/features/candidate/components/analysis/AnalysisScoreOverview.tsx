import { motion } from "framer-motion";
import { Award, BriefcaseBusiness, GraduationCap, Layers3 } from "lucide-react";

import type { ResumeQualityAnalysis } from "@types/resume";

interface AnalysisScoreOverviewProps {
  quality: ResumeQualityAnalysis;
}

const AnalysisScoreOverview = ({
  quality,
}: AnalysisScoreOverviewProps) => {
  const metrics = [
    {
      label: "Skills",
      score: quality.breakdown.skills.score,
      maxScore: quality.breakdown.skills.maxScore,
      icon: Award,
    },
    {
      label: "Experience",
      score: quality.breakdown.experience.score,
      maxScore: quality.breakdown.experience.maxScore,
      icon: BriefcaseBusiness,
    },
    {
      label: "Education",
      score: quality.breakdown.education.score,
      maxScore: quality.breakdown.education.maxScore,
      icon: GraduationCap,
    },
    {
      label: "Structure",
      score: quality.breakdown.structure.score,
      maxScore: quality.breakdown.structure.maxScore,
      icon: Layers3,
    },
  ];

  return (
    <section className="mt-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          const percentage =
            metric.maxScore > 0
              ? Math.round(
                  (metric.score / metric.maxScore) * 100,
                )
              : 0;

          return (
            <motion.div
              key={metric.label}
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
                delay: index * 0.06,
              }}
              className="rounded-xl border border-cream-300 bg-white p-5 shadow-soft"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">
                    {metric.label}
                  </p>

                  <p className="mt-2 font-display text-2xl text-text-primary">
                    {metric.score}
                    <span className="text-sm font-normal text-text-muted">
                      {" "}
                      / {metric.maxScore}
                    </span>
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-100">
                  <Icon className="h-4 w-4 text-mint-500" />
                </div>
              </div>

              <div className="mt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-cream-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${percentage}%`,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.06 + 0.15,
                    }}
                    className="h-full rounded-full bg-mint-500"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    Quality contribution
                  </span>

                  <span className="text-xs font-semibold text-text-secondary">
                    {percentage}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default AnalysisScoreOverview;
