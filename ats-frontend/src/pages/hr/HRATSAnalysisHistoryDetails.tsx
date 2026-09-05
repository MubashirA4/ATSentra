import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getATSAnalysisHistoryDetails } from "../../services/ats/atsHistory";

import ATSOverview from "../../components/hr/ats/ATSOverview";
import ATSCandidateTable from "../../components/hr/ats/ATSCandidateTable";
import ATSCandidateDetails from "../../components/hr/ats/ATSCandidateDetails";

import type {
  ATSAnalysisRun,
  ATSCandidateResult,
} from "../../types/atsAnalysis";
import type { ATSJob } from "../../types/job";

const HRATSAnalysisHistoryDetails = () => {
  const { runId } = useParams<{
    runId: string;
  }>();

  const [run, setRun] = useState<ATSAnalysisRun | null>(null);

  const [job, setJob] = useState<ATSJob | null>(null);

  const [candidates, setCandidates] = useState<ATSCandidateResult[]>([]);

  const [selectedCandidate, setSelectedCandidate] =
    useState<ATSCandidateResult | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!runId) return;

    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getATSAnalysisHistoryDetails(runId);

        setRun(response.data.analysisRun);

        setJob(response.data.job);

        setCandidates(response.data.candidates);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load saved analysis.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadAnalysis();
  }, [runId]);

  if (loading) {
    return (
      <div className="flex  items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={28} />
      </div>
    );
  }

  if (error || !run || !job) {
    return (
      <div className="space-y-4">
        <Link
          to="/hr/analysis/history"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to History
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error ?? "Analysis could not be found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4">
        <Link
          to="/hr/analysis/history"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to History
        </Link>

        <div>
          <p className="text-sm font-medium text-emerald-600">
            Saved ATS Analysis
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {job.title}
          </h1>

          <p className="mt-1 text-sm text-slate-500">{job.company}</p>
        </div>
      </div>

      <ATSOverview candidates={candidates} />

      {selectedCandidate ? (
        <ATSCandidateDetails
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      ) : (
        <ATSCandidateTable
          candidates={candidates}
          onSelect={setSelectedCandidate}
        />
      )}
    </div>
  );
};

export default HRATSAnalysisHistoryDetails;
