import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  Trophy,
  XCircle,
} from "lucide-react";

import type { ATSTopCandidate } from "@types/atsDashboard";

interface HROutstandingCandidatesProps {
  candidates: ATSTopCandidate[];
}

const HROutstandingCandidates = ({
  candidates,
}: HROutstandingCandidatesProps) => {
  const visibleCandidates = candidates.slice(0, 5);

  return (
    <section className="rounded-xl border border-cream-300 bg-cream-50 shadow-soft">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-cream-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-100 text-mint-500">
              <Trophy size={18} />
            </div>

            <div>
              <h2 className="font-display text-xl text-forest-950">
                Outstanding Candidates
              </h2>

              <p className="text-sm text-text-secondary">
                Top candidates ranked by ATS performance.
              </p>
            </div>
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

      {/* Candidates */}
      <div className="divide-y divide-cream-200">
        {visibleCandidates.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Trophy
              size={28}
              className="mx-auto mb-3 text-text-muted"
            />

            <p className="font-semibold text-text-primary">
              No outstanding candidates yet
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Candidate rankings will appear here after ATS analysis.
            </p>
          </div>
        ) : (
          visibleCandidates.map((candidate, index) => {
            const candidateName =
              candidate.candidate?.name || "Unknown candidate";

            const candidateEmail =
              candidate.candidate?.email || "No email available";

            const candidateLocation =
              candidate.candidate?.location || "Location unavailable";

            const skills = candidate.candidate?.skills ?? [];

            return (
              <motion.div
                key={candidate.analysisId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                className="flex flex-col gap-4 px-5 py-5 transition hover:bg-cream-100/70 lg:flex-row lg:items-center lg:justify-between"
              >
                {/* Candidate information */}
                <div className="flex min-w-0 items-start gap-4">
                  {/* Rank */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-950 text-sm font-bold text-white">
                    #{candidate.rank}
                  </div>

                  {/* Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint-100 text-sm font-bold text-forest-800">
                    {candidateName
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-text-primary">
                      {candidateName}
                    </h3>

                    <div className="mt-1 flex flex-col gap-1 text-xs text-text-secondary sm:flex-row sm:items-center sm:gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Mail size={13} />
                        <span className="truncate">
                          {candidateEmail}
                        </span>
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} />
                        <span>{candidateLocation}</span>
                      </span>
                    </div>

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-cream-200 px-2 py-1 text-[11px] font-medium text-text-secondary"
                          >
                            {skill}
                          </span>
                        ))}

                        {skills.length > 4 && (
                          <span className="rounded-md bg-cream-200 px-2 py-1 text-[11px] font-medium text-text-muted">
                            +{skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Score + eligibility */}
                <div className="flex items-center justify-between gap-6 lg:justify-end">
                  {/* Eligibility */}
                  <div>
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
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className="text-2xl font-extrabold tracking-tight text-forest-900">
                      {candidate.rankingScore}%
                    </p>

                    <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
                      Ranking score
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default HROutstandingCandidates;
