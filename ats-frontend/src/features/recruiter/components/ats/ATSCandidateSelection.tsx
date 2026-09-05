import {
  Check,
  FileText,
  Users,
  XCircle,
} from "lucide-react";

import type { RecruiterResume } from "@types/recruiterResume";

interface ATSCandidateSelectionProps {
  resumes: RecruiterResume[];
  selectedCandidateIds: string[];
  onToggle: (candidateId: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
  loading?: boolean;
}

const ATSCandidateSelection = ({
  resumes,
  selectedCandidateIds,
  onToggle,
  onSelectAll,
  onClear,
  loading = false,
}: ATSCandidateSelectionProps) => {
  const selectableResumes = resumes.filter(
    (resume) =>
      resume.status === "processed" &&
      Boolean(resume.candidateId),
  );

  const allSelected =
    selectableResumes.length > 0 &&
    selectableResumes.every((resume) =>
      resume.candidateId
        ? selectedCandidateIds.includes(resume.candidateId)
        : false,
    );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Users size={18} />
              Select Candidates
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select processed resumes to include in the ATS ranking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelectAll}
              disabled={
                loading ||
                selectableResumes.length === 0 ||
                allSelected
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Select all
            </button>

            <button
              type="button"
              onClick={onClear}
              disabled={loading || selectedCandidateIds.length === 0}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
          <Users size={14} />

          {selectedCandidateIds.length} selected
          <span className="text-slate-400">•</span>
          {selectableResumes.length} available
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-16 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="p-10 text-center">
          <FileText
            className="mx-auto mb-3 text-slate-400"
            size={30}
          />

          <p className="font-semibold text-slate-700">
            No recruiter resumes found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Upload candidate resumes before running ATS analysis.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {resumes.map((resume) => {
            const candidateId = resume.candidateId;

            const selectable =
              resume.status === "processed" &&
              Boolean(candidateId);

            const selected =
              candidateId !== null &&
              selectedCandidateIds.includes(candidateId);

            return (
              <div
                key={resume._id}
                className={`flex items-center gap-4 px-5 py-4 transition ${
                  selected
                    ? "bg-emerald-50/50"
                    : "hover:bg-slate-50"
                }`}
              >
                <button
                  type="button"
                  disabled={!selectable || loading}
                  onClick={() => {
                    if (candidateId) {
                      onToggle(candidateId);
                    }
                  }}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    selected
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300 bg-white"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                  aria-label={
                    selected
                      ? "Deselect candidate"
                      : "Select candidate"
                  }
                >
                  {selected && <Check size={13} />}
                </button>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <FileText size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {resume.originalName}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Candidate ID:{" "}
                    {candidateId
                      ? candidateId.slice(-8)
                      : "Not linked"}
                  </p>
                </div>

                <div className="shrink-0">
                  {resume.status === "processed" &&
                  candidateId ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <Check size={12} />
                      Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                      <XCircle size={12} />
                      Not ready
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ATSCandidateSelection;
