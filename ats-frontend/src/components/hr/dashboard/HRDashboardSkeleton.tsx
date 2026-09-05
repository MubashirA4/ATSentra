interface HRDashboardSkeletonProps {
  contentOnly?: boolean;
}

const HRDashboardSkeleton = ({
  contentOnly = false,
}: HRDashboardSkeletonProps) => {
  if (contentOnly) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-cream-200"
            />
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          <div className="h-72 rounded-2xl bg-cream-200" />
          <div className="h-72 rounded-2xl bg-cream-200" />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-72 rounded-2xl bg-cream-200" />
          <div className="h-72 rounded-2xl bg-cream-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-20 rounded-2xl bg-cream-200" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 rounded-2xl bg-cream-200"
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="h-72 rounded-2xl bg-cream-200" />
        <div className="h-72 rounded-2xl bg-cream-200" />
      </div>
    </div>
  );
};

export default HRDashboardSkeleton;