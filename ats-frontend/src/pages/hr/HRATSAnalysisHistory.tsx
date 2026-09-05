import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Loader2,
  Users,
} from "lucide-react";

import { getATSAnalysisHistory } from "../../services/ats/atsHistory";
import type { ATSAnalysisHistoryRun } from "../../types/atsAnalysis";

const HRATSAnalysisHistory = () => {
  const [runs, setRuns] = useState<ATSAnalysisHistoryRun[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const history = await getATSAnalysisHistory();

        setRuns(history);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load analysis history.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="text-sm font-medium text-emerald-600">
          Recruitment Intelligence
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Analysis History
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View previously executed ATS analyses.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && runs.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <ClipboardList size={40} className="mx-auto text-slate-400" />

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No ATS analyses yet
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Run an ATS analysis and your saved results will appear here.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {runs.map((run) => {
          const job = typeof run.jobId === "object" ? run.jobId : null;

          return (
            <div
              key={run._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <ClipboardList size={19} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        {job?.title ?? "ATS Analysis"}
                      </h2>

                      <p className="text-sm text-slate-500">
                        {job?.company ?? "Job"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    {run.candidateCount} candidates
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />

                    {new Date(run.createdAt).toLocaleDateString()}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      run.status === "completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : run.status === "failed"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {run.status}
                  </span>

                  <a
                    href={`/hr/analysis/history/${run._id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-4 py-2 font-medium transition hover:bg-emerald-900"
                  >
                    <span className="text-white">View Results</span>
                    <ChevronRight size={16} className="text-white"/>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HRATSAnalysisHistory;
