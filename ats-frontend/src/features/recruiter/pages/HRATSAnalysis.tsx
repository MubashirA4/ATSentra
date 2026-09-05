import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Play } from "lucide-react";

import ATSHeader from "@features/recruiter/components/ats/ATSHeader";
import ATSJobSelector from "@features/recruiter/components/ats/ATSJobSelector";
import ATSCandidateSelection from "@features/recruiter/components/ats/ATSCandidateSelection";
import ATSOverview from "@features/recruiter/components/ats/ATSOverview";
import ATSCandidateTable from "@features/recruiter/components/ats/ATSCandidateTable";
import ATSCandidateDetails from "@features/recruiter/components/ats/ATSCandidateDetails";

import { getJobs } from "@features/recruiter/services/job.service";
import { getRecruiterResumes } from "@features/recruiter/services/recruiterResume.service";
import { useATSAnalysis } from "@features/recruiter/hooks/useATSAnalysis";

import type { ATSJob } from "@types/job";
import type { RecruiterResume } from "@types/recruiterResume";
import type { ATSCandidateResult } from "@types/atsAnalysis";

const HRATSAnalysis = () => {
  const [jobs, setJobs] = useState<ATSJob[]>([]);
  const [resumes, setResumes] =
    useState<RecruiterResume[]>([]);

  const [selectedJobId, setSelectedJobId] =
    useState("");

  const [
    selectedCandidateIds,
    setSelectedCandidateIds,
  ] = useState<string[]>([]);

  const [
    selectedCandidate,
    setSelectedCandidate,
  ] = useState<ATSCandidateResult | null>(null);

  const [loadingJobs, setLoadingJobs] =
    useState(true);

  const [loadingResumes, setLoadingResumes] =
    useState(true);

  const [pageError, setPageError] =
    useState<string | null>(null);

  const {
    result,
    loading: analysisLoading,
    error: analysisError,
    execute,
    reset,
  } = useATSAnalysis();

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageError(null);

        const [jobsResponse, recruiterResumes] =
          await Promise.all([
            getJobs({
              status: "open",
              limit: 100,
            }),
            getRecruiterResumes(),
          ]);

        const availableJobs =
          jobsResponse.data.jobs;

        setJobs(availableJobs);
        setResumes(recruiterResumes);

        if (availableJobs.length > 0) {
          setSelectedJobId(
            availableJobs[0]._id,
          );
        }
      } catch (error) {
        setPageError(
          error instanceof Error
            ? error.message
            : "Failed to load ATS data.",
        );
      } finally {
        setLoadingJobs(false);
        setLoadingResumes(false);
      }
    };

    void loadData();
  }, []);

  const selectedJob = useMemo(
    () =>
      jobs.find(
        (job) => job._id === selectedJobId,
      ) ?? null,
    [jobs, selectedJobId],
  );

  const toggleCandidate = (
    candidateId: string,
  ) => {
    setSelectedCandidateIds((current) =>
      current.includes(candidateId)
        ? current.filter(
            (id) => id !== candidateId,
          )
        : [...current, candidateId],
    );
  };

  const selectAllCandidates = () => {
    const ids = resumes
      .filter(
        (resume) =>
          resume.status === "processed" &&
          Boolean(resume.candidateId),
      )
      .map(
        (resume) => resume.candidateId!,
      );

    setSelectedCandidateIds(ids);
  };

  const clearCandidates = () => {
    setSelectedCandidateIds([]);
  };

  const handleExecute = async () => {
    if (
      !selectedJobId ||
      selectedCandidateIds.length === 0
    ) {
      return;
    }

    setSelectedCandidate(null);

    await execute({
      jobId: selectedJobId,
      candidateIds: selectedCandidateIds,
    });
  };

  const handleReset = () => {
    reset();
    setSelectedCandidate(null);
    setSelectedCandidateIds([]);
  };

  const results = result?.data.candidates ?? [];

  return (
    <div className="space-y-6 pb-10">
      <ATSHeader
        hasResults={Boolean(result)}
        onReset={handleReset}
      />

      {pageError && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{pageError}</span>
        </div>
      )}

      {!result ? (
        <>
          <ATSJobSelector
            jobs={jobs}
            selectedJobId={selectedJobId}
            onChange={(jobId) => {
              setSelectedJobId(jobId);
              setSelectedCandidateIds([]);
            }}
            loading={loadingJobs}
          />

          <ATSCandidateSelection
            resumes={resumes}
            selectedCandidateIds={
              selectedCandidateIds
            }
            onToggle={toggleCandidate}
            onSelectAll={selectAllCandidates}
            onClear={clearCandidates}
            loading={loadingResumes}
          />

          {analysisError && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{analysisError}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              disabled={
                analysisLoading ||
                !selectedJobId ||
                selectedCandidateIds.length === 0
              }
              onClick={() => {
                void handleExecute();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play size={17} />

              {analysisLoading
                ? "Analyzing Candidates..."
                : `Run ATS Analysis (${selectedCandidateIds.length})`}
            </button>
          </div>
        </>
      ) : (
        <>
          {selectedJob && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Analysis for
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                {selectedJob.title}
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                {selectedJob.company}
              </p>
            </div>
          )}

          <ATSOverview candidates={results} />

          {selectedCandidate ? (
            <ATSCandidateDetails
              candidate={selectedCandidate}
              onClose={() =>
                setSelectedCandidate(null)
              }
            />
          ) : (
            <ATSCandidateTable
              candidates={results}
              onSelect={setSelectedCandidate}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HRATSAnalysis;
