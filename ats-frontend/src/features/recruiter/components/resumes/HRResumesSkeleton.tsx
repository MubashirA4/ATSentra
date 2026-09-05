const HRResumesSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-4 p-5">
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="flex items-center gap-4"
            >
              <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-slate-100" />
              </div>

              <div className="hidden h-6 w-24 animate-pulse rounded-full bg-slate-100 sm:block" />

              <div className="hidden h-4 w-24 animate-pulse rounded bg-slate-100 md:block" />
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default HRResumesSkeleton;
