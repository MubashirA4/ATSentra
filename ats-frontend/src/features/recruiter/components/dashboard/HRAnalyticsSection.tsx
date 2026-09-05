import type {
  ATSDistributions,
  ATSExperienceStats,
  ATSEducationStats,
} from "@types/atsDashboard";

import HRScoreDistribution from "./HRScoreDistribution";
import HRHiringInsights from "./HRHiringInsights";

interface HRAnalyticsSectionProps {
  distributions: ATSDistributions;
  experience: ATSExperienceStats;
  education: ATSEducationStats;
}

const HRAnalyticsSection = ({
  distributions,
  experience,
  education,
}: HRAnalyticsSectionProps) => {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <HRScoreDistribution
        distribution={distributions.score}
      />

      <HRHiringInsights
        experience={experience}
        education={education}
      />
    </section>
  );
};

export default HRAnalyticsSection;
