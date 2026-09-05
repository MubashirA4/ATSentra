import Card from "../../ui/Card";
import HealthMetric from "./HealthMetric";
import type { ResumeContent } from "../../../types/resume";

interface ResumeHealthCardProps {
  resumeContent: ResumeContent | null;
  loading: boolean;
}

const ResumeHealthCard = ({
  resumeContent,
  loading,
}: ResumeHealthCardProps) => {
  if (loading) {
    return (
      <section className="mt-6">
        <Card className="p-6 sm:p-7">
          <div className="animate-pulse">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="h-3 w-24 rounded bg-cream-200" />
                <div className="mt-3 h-5 w-64 rounded bg-cream-200" />
              </div>

              <div className="flex items-center gap-3">
                <div className="h-2 w-32 rounded-full bg-cream-200" />
                <div className="h-4 w-10 rounded bg-cream-200" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 border-t border-cream-300 pt-5 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-12 rounded bg-cream-200" />
              ))}
            </div>
          </div>
        </Card>
      </section>
    );
  }

  if (!resumeContent) {
    return (
      <section className="mt-6">
        <Card className="p-6 sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
            Resume health
          </p>

          <h2 className="mt-2 text-lg font-bold text-text-primary">
            No resume health data yet.
          </h2>

          <p className="mt-1 text-sm leading-5 text-text-secondary">
            Upload and analyze a resume to see its overall health and
            section scores.
          </p>
        </Card>
      </section>
    );
  }

  const { qualityAnalysis } = resumeContent;
  const { breakdown } = qualityAnalysis;

  const getPercentage = (
    score: number,
    maxScore: number
  ): number => {
    if (maxScore <= 0) {
      return 0;
    }

    return Math.min(
      Math.max(Math.round((score / maxScore) * 100), 0),
      100
    );
  };

  const overallScore = qualityAnalysis.percentage;

  const skillsScore = getPercentage(
    breakdown.skills.score,
    breakdown.skills.maxScore
  );

  const experienceScore = getPercentage(
    breakdown.experience.score,
    breakdown.experience.maxScore
  );

  const structureScore = getPercentage(
    breakdown.structure.score,
    breakdown.structure.maxScore
  );

  const getHealthMessage = (score: number) => {
    if (score >= 85) {
      return "Your resume is performing very well.";
    }

    if (score >= 70) {
      return "Your resume is performing well with some room for improvement.";
    }

    if (score >= 50) {
      return "Your resume has several areas that could be improved.";
    }

    return "Your resume needs improvement across several areas.";
  };

  return (
    <section className="mt-6">
      <Card className="relative overflow-hidden p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-forest-700/5 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                Resume health
              </p>

              <h2 className="mt-2 text-lg font-bold text-text-primary">
                {getHealthMessage(overallScore)}
              </h2>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Overall resume quality based on the latest analysis.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-mint-100">
                <div
                  className="h-full rounded-full bg-mint-500 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      Math.max(overallScore, 0),
                      100
                    )}%`,
                  }}
                />
              </div>

              <span className="text-sm font-bold text-text-primary">
                {overallScore}%
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-cream-300 pt-5 sm:grid-cols-3">
            <HealthMetric
              label="Skills"
              value={`${skillsScore}%`}
            />

            <HealthMetric
              label="Experience"
              value={`${experienceScore}%`}
            />

            <HealthMetric
              label="Structure"
              value={`${structureScore}%`}
            />
          </div>
        </div>
      </Card>
    </section>
  );
};

export default ResumeHealthCard;