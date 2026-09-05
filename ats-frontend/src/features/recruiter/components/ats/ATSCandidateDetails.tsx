import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import type { ATSCandidateResult } from "@types/atsAnalysis";

interface ATSCandidateDetailsProps {
  candidate: ATSCandidateResult;
  onClose: () => void;
}

const ATSCandidateDetails = ({
  candidate,
  onClose,
}: ATSCandidateDetailsProps) => {
  const { matchResult, explanation } = candidate;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Candidate #{candidate.rank}
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {candidate.candidate?.name ??
                `Candidate ${candidate.candidateId.slice(-8)}`}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {candidate.candidateId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <div className="rounded-xl bg-emerald-50 px-4 py-3">
            <p className="text-xs font-medium text-emerald-700">ATS Score</p>

            <p className="mt-1 text-2xl font-bold text-emerald-800">
              {candidate.rankingScore}%
            </p>
          </div>

          <div
            className={`rounded-xl px-4 py-3 ${
              candidate.eligible ? "bg-emerald-50" : "bg-rose-50"
            }`}
          >
            <p
              className={`text-xs font-medium ${
                candidate.eligible ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              Eligibility
            </p>

            <p
              className={`mt-1 font-bold ${
                candidate.eligible ? "text-emerald-800" : "text-rose-800"
              }`}
            >
              {candidate.eligible ? "Eligible" : "Not Eligible"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5">
        <div>
          <h3 className="font-bold text-slate-900">AI Explanation</h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {explanation.summary}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Metric
            icon={BriefcaseBusiness}
            title="Required Skills"
            score={matchResult.skills.requiredMatchPercentage}
            matched={matchResult.skills.matchedRequiredSkills}
            missing={matchResult.skills.missingRequiredSkills}
          />

          <Metric
            icon={Award}
            title="Preferred Skills"
            score={matchResult.skills.preferredMatchPercentage}
            matched={matchResult.skills.matchedPreferredSkills}
            missing={matchResult.skills.missingPreferredSkills}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness size={17} className="text-slate-500" />

              <h3 className="font-semibold text-slate-900">Experience</h3>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              Candidate:{" "}
              <strong>{matchResult.experience.candidateYears} years</strong>
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Required:{" "}
              <strong>{matchResult.experience.requiredYears} years</strong>
            </p>

            <div className="mt-3">
              {matchResult.experience.matched ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={15} />
                  Requirement met
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700">
                  <XCircle size={15} />
                  Requirement not met
                </span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <BookOpen size={17} className="text-slate-500" />

              <h3 className="font-semibold text-slate-900">Education</h3>
            </div>

            <div className="mt-3">
              {matchResult.education.matched ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={15} />
                  Requirement met
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700">
                  <XCircle size={15} />
                  Requirement not met
                </span>
              )}
            </div>

            {matchResult.education.missingRequirements.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-500">Missing</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {matchResult.education.missingRequirements.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ListSection
            title="Strengths"
            items={explanation.strengths}
            positive
          />

          <ListSection
            title="Weaknesses"
            items={explanation.weaknesses}
            positive={false}
          />
        </div>

        {candidate.eligibilityReasons.length > 0 && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <h3 className="font-semibold text-rose-900">Eligibility Reasons</h3>

            <ul className="mt-2 space-y-1">
              {candidate.eligibilityReasons.map((reason) => (
                <li key={reason} className="text-sm text-rose-800">
                  • {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

interface MetricProps {
  icon: typeof BriefcaseBusiness;
  title: string;
  score: number;
  matched: string[];
  missing: string[];
}

const Metric = ({
  icon: Icon,
  title,
  score,
  matched,
  missing,
}: MetricProps) => {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={17} className="text-slate-500" />

          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>

        <span className="font-bold text-emerald-700">{score}%</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {matched.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
          >
            {skill}
          </span>
        ))}

        {missing.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

interface ListSectionProps {
  title: string;
  items: string[];
  positive: boolean;
}

const ListSection = ({ title, items, positive }: ListSectionProps) => {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h3 className="font-semibold text-slate-900">{title}</h3>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">None</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item}
              className={`text-sm ${
                positive ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              • {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ATSCandidateDetails;
