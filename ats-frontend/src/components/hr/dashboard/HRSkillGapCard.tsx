import type { ATSSkillGap } from "../../../types/atsDashboard";

interface HRSkillGapCardProps {
  title: string;
  description: string;
  skills: ATSSkillGap[];
}

const HRSkillGapCard = ({
  title,
  description,
  skills,
}: HRSkillGapCardProps) => {
  const topSkills = skills.slice(0, 6);

  const maxCount = Math.max(
    ...topSkills.map((item) => item.count),
    1,
  );

  return (
    <div
      className="
        rounded-2xl
        border
        border-cream-300
        bg-cream-50
        p-5
        shadow-soft
      "
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-mint-500">
        Skill Intelligence
      </p>

      <h2 className="mt-1 font-display text-xl text-forest-950">
        {title}
      </h2>

      <p className="mt-1 text-xs text-text-secondary">
        {description}
      </p>

      <div className="mt-6 space-y-4">
        {topSkills.length === 0 ? (
          <div className="py-8 text-center text-sm text-text-muted">
            No skill gaps detected.
          </div>
        ) : (
          topSkills.map((item) => (
            <div key={item.skill}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-semibold text-forest-900">
                  {item.skill}
                </span>

                <span className="text-xs font-bold text-text-muted">
                  {item.count}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-cream-200">
                <div
                  className="h-full rounded-full bg-mint-400"
                  style={{
                    width: `${
                      (item.count / maxCount) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HRSkillGapCard;