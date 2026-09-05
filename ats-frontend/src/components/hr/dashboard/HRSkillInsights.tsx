import type { ATSSkillGap } from "../../../types/atsDashboard";

import HRSkillGapCard from "./HRSkillGapCard";

interface HRSkillInsightsProps {
  skillGaps: ATSSkillGap[];
  requiredSkillGaps: ATSSkillGap[];
}

const HRSkillInsights = ({
  skillGaps,
  requiredSkillGaps,
}: HRSkillInsightsProps) => {
  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <HRSkillGapCard
        title="Required skill gaps"
        description="Skills most frequently missing against job requirements."
        skills={requiredSkillGaps}
      />

      <HRSkillGapCard
        title="Candidate skill gaps"
        description="Common skill deficiencies across analyzed candidates."
        skills={skillGaps}
      />
    </section>
  );
};

export default HRSkillInsights;