import { ChevronRight, CircleAlert, CircleCheck, Trophy } from "lucide-react";

import type { ATSCandidateResult } from "@types/atsAnalysis";

interface ATSCandidateTableProps {
  candidates: ATSCandidateResult[];
  onSelect: (candidate: ATSCandidateResult) => void;
}

const ATSCandidateTable = ({
  candidates,
  onSelect,
}: ATSCandidateTableProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-base font-bold text-slate-900">
          Candidate Ranking
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Candidates ranked according to the ATS matching engine.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Rank
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Candidate
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                ATS Score
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Eligibility
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Skills
              </th>

              <th />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {candidates.map((candidate) => {
              const skillPercentage =
                candidate.matchResult.skills.requiredMatchPercentage;

              return (
                <tr
                  key={candidate.candidateId}
                  className="group transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {candidate.rank === 1 && (
                        <Trophy size={16} className="text-amber-500" />
                      )}

                      <span className="font-bold text-slate-900">
                        #{candidate.rank}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {candidate.candidate?.name ??
                          `Candidate ${candidate.candidateId.slice(-8)}`}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        ID: {candidate.candidateId}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${Math.min(candidate.rankingScore, 100)}%`,
                          }}
                        />
                      </div>

                      <span className="font-bold text-slate-900">
                        {candidate.rankingScore}%
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {candidate.eligible ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CircleCheck size={13} />
                        Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                        <CircleAlert size={13} />
                        Not eligible
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-700">
                      {skillPercentage}%
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(candidate)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      Details
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ATSCandidateTable;
