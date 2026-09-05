const HRJobsSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-8 w-32 rounded-lg bg-forest-950/10" />

        <div className="mt-3 h-4 w-80 rounded bg-forest-950/10" />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-2xl border border-forest-900/10 bg-white"
            />
          ))}
        </div>

        <div className="mt-6 h-20 rounded-2xl border border-forest-900/10 bg-white" />

        <div className="mt-5 h-[480px] rounded-2xl border border-forest-900/10 bg-white" />
      </div>
    </div>
  );
};

export default HRJobsSkeleton;