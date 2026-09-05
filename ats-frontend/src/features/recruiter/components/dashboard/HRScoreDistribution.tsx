import type { ATSScoreDistribution } from "@types/atsDashboard";

interface HRScoreDistributionProps {
  distribution: ATSScoreDistribution[];
}

const HRScoreDistribution = ({
  distribution,
}: HRScoreDistributionProps) => {
  const maxCount = Math.max(
    ...distribution.map((item) => item.count),
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
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-mint-500">
          ATS Performance
        </p>

        <h2 className="mt-1 font-display text-xl text-forest-950">
          Candidate score distribution
        </h2>

        <p className="mt-1 text-xs text-text-secondary">
          How candidates are distributed across ATS scores.
        </p>
      </div>

      {distribution.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-text-muted">
          No score distribution available.
        </div>
      ) : (
        <div className="mt-8 flex h-48 items-end gap-2 sm:gap-3">
          {distribution.map((item) => {
            const height =
              (item.count / maxCount) * 100;

            return (
              <div
                key={String(item._id)}
                className="group flex h-full flex-1 flex-col justify-end"
              >
                <div className="relative flex h-full items-end">
                  <div
                    className="
                      w-full
                      rounded-t-lg
                      bg-mint-300
                      transition
                      group-hover:bg-mint-500
                    "
                    style={{
                      height: `${Math.max(
                        height,
                        4,
                      )}%`,
                    }}
                  />

                  <span
                    className="
                      absolute
                      bottom-full
                      left-1/2
                      mb-2
                      hidden
                      -translate-x-1/2
                      rounded-md
                      bg-forest-950
                      px-2
                      py-1
                      text-[10px]
                      font-semibold
                      text-white
                      group-hover:block
                    "
                  >
                    {item.count}
                  </span>
                </div>

                <p className="mt-2 text-center text-[10px] font-semibold text-text-muted">
                  {item._id}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HRScoreDistribution;
