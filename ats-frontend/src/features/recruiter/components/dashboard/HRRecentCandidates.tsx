import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Mail,
  UserRound,
  XCircle,
} from "lucide-react";

import type { ATSRecentCandidate } from "@types/atsDashboard";

interface HRRecentCandidatesProps {
  candidates: ATSRecentCandidate[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getInitials = (name: string) => {
  if (!name) {
    return "NA";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const HRRecentCandidates = ({
  candidates,
}: HRRecentCandidatesProps) => {
  const visibleCandidates = candidates.slice(0, 8);

  return (
    <section className="rounded-xl border border-cream-300 bg-cream-50 shadow-soft">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-cream-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-100 text-mint-500">
            <Clock3 size={18} />
          </div>

          <div>
            <h2 className="font-display text-xl text-forest-950">
              Recent Candidates
            </h2>

            <p className="text-sm text-text-secondary">
              Latest candidates processed by the ATS.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1 self-start rounded-lg px-3 py-2 text-sm font-semibold text-forest-700 transition hover:bg-mint-100 sm:self-auto"
        >
          View all
          <ArrowUpRight size={15} />
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        {visibleCandidates.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <UserRound
              size={28}
              className="mx-auto mb-3 text-text-muted"
            />

            <p className="font-semibold text-text-primary">
              No recent candidates
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Candidates will appear here after they are analyzed.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-100/60 text-left">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-text-muted">
                  Candidate
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-text-muted">
                  Rank
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-text-muted">
                  Ranking Score
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-text-muted">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-text-muted">
                  Analyzed
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-cream-200">
              {visibleCandidates.map((candidate, index) => {
                const name =
                  candidate.candidate?.name || "Unknown candidate";

                const email =
                  candidate.candidate?.email || "No email";

                return (
                  <motion.tr
                    key={candidate._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.25,
                      delay: index * 0.04,
                    }}
                    className="transition hover:bg-cream-100/70"
                  >
                    {/* Candidate */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint-100 text-xs font-bold text-forest-800">
                          {getInitials(name)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-text-primary">
                            {name}
                          </p>

                          <p className="mt-0.5 flex items-center gap-1 text-xs text-text-secondary">
                            <Mail size={12} />
                            <span className="truncate">
                              {email}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Rank */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-forest-800">
                        #{candidate.rank}
                      </span>
                    </td>

                    {/* Ranking score */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-cream-200">
                          <div
                            className="h-full rounded-full bg-mint-500 transition-all"
                            style={{
                              width: `${Math.min(
                                Math.max(candidate.rankingScore, 0),
                                100,
                              )}%`,
                            }}
                          />
                        </div>

                        <span className="text-sm font-bold text-forest-900">
                          {candidate.rankingScore}%
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {candidate.eligible ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-2.5 py-1 text-xs font-semibold text-success">
                          <CheckCircle2 size={13} />
                          Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-danger">
                          <XCircle size={13} />
                          Not eligible
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-text-secondary">
                        {formatDate(candidate.createdAt)}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-cream-200 md:hidden">
        {visibleCandidates.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <UserRound
              size={28}
              className="mx-auto mb-3 text-text-muted"
            />

            <p className="font-semibold text-text-primary">
              No recent candidates
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Candidates will appear here after they are analyzed.
            </p>
          </div>
        ) : (
          visibleCandidates.map((candidate, index) => {
            const name =
              candidate.candidate?.name || "Unknown candidate";

            const email =
              candidate.candidate?.email || "No email";

            return (
              <motion.div
                key={candidate._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.04,
                }}
                className="space-y-4 px-5 py-4"
              >
                {/* Candidate */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint-100 text-xs font-bold text-forest-800">
                      {getInitials(name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-text-primary">
                        {name}
                      </p>

                      <p className="flex items-center gap-1 truncate text-xs text-text-secondary">
                        <Mail size={12} />
                        {email}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-sm font-bold text-forest-800">
                    #{candidate.rank}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-cream-100 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
                      Ranking score
                    </p>

                    <p className="mt-1 text-lg font-extrabold text-forest-900">
                      {candidate.rankingScore}%
                    </p>
                  </div>

                  <div className="rounded-lg bg-cream-100 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
                      Analyzed
                    </p>

                    <p className="mt-1 text-sm font-semibold text-text-primary">
                      {formatDate(candidate.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                {candidate.eligible ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-2.5 py-1 text-xs font-semibold text-success">
                    <CheckCircle2 size={13} />
                    Eligible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-danger">
                    <XCircle size={13} />
                    Not eligible
                  </span>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default HRRecentCandidates;
