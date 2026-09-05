import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Award,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  MapPin,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getCandidateJobMatchDetail,
  type JobMatchHistoryItem,
} from "@features/candidate/services/jobMatchHistory.service";

import toast from "react-hot-toast";
import getErrorMessage from "@utils/getErrorMessage";

const getScoreLabel = (score: number) => {
  if (score >= 80) return "Strong Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Needs Improvement";
  return "Low Match";
};

const getScoreClasses = (score: number) => {
  if (score >= 80) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (score >= 60) {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }

  if (score >= 40) {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  return "bg-red-50 text-red-700 ring-red-200";
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const JobMatchHistoryDetail = () => {
  const { matchId } = useParams<{
    matchId: string;
  }>();

  const navigate = useNavigate();

  const [analysis, setAnalysis] =
    useState<JobMatchHistoryItem | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!matchId) {
      toast.error("Invalid job match");
      navigate("/candidate/jobs/history");
      return;
    }

    const loadAnalysis = async () => {
      try {
        setLoading(true);

        const response =
          await getCandidateJobMatchDetail(matchId);

        setAnalysis(response.data);
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            "Failed to load job match analysis",
          ),
        );

        navigate("/candidate/jobs/history");
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [matchId, navigate]);

  if (loading) {
    return (
      <div className="min-h-full bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-48 rounded bg-slate-200" />
            <div className="h-40 rounded-2xl bg-white" />
            <div className="h-64 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const {
    job,
    match,
    recommendations,
  } = analysis;

  /*
   * Certification matching was added after older analyses
   * may already exist in the database.
   *
   * These fallbacks prevent old analyses from breaking
   * this page if certification data is not present.
   */
  const certifications = match.certifications ?? {
    required: 0,
    exactMatches: [],
    partialMatches: [],
    missing: [],
    score: 100,
    matchPercentage: 100,
    details: [],
  };

  const certificationBreakdown =
    match.breakdown.certifications ?? {
      score: certifications.score,
      weight: 5,
    };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/candidate/jobs/history"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Match History
        </Link>

        {/* Header */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <BriefcaseBusiness size={27} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                    Job Match Analysis
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {job.title || "Untitled Position"}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                    {job.company && (
                      <span className="font-medium text-slate-700">
                        {job.company}
                      </span>
                    )}

                    {job.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} />
                        {job.location}
                      </span>
                    )}

                    {job.employmentType && (
                      <span>{job.employmentType}</span>
                    )}
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <CalendarDays size={14} />
                    Analyzed on{" "}
                    {formatDate(analysis.createdAt)}
                  </div>
                </div>
              </div>

              {/* Main Score */}
              <div className="shrink-0 rounded-2xl border border-slate-100 bg-slate-50 px-8 py-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Overall Match
                </p>

                <p className="mt-1 text-4xl font-bold text-slate-900">
                  {match.score}%
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getScoreClasses(
                    match.score,
                  )}`}
                >
                  {getScoreLabel(match.score)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Score Breakdown */}
        <section className="mt-5">
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            Score Breakdown
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <ScoreCard
              label="Required Skills"
              score={
                match.skills.requiredMatchPercentage
              }
              weight={
                match.breakdown.requiredSkills.weight
              }
            />

            <ScoreCard
              label="Preferred Skills"
              score={
                match.skills.preferredMatchPercentage
              }
              weight={
                match.breakdown.preferredSkills.weight
              }
            />

            <ScoreCard
              label="Experience"
              score={match.experience.score}
              weight={
                match.breakdown.experience.weight
              }
            />

            <ScoreCard
              label="Education"
              score={match.education.score}
              weight={
                match.breakdown.education.weight
              }
            />

            <ScoreCard
              label="Certifications"
              score={
                certifications.matchPercentage
              }
              weight={certificationBreakdown.weight}
            />
          </div>
        </section>

        {/* Skills */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Award size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Skills Analysis
              </h2>

              <p className="text-sm text-slate-500">
                Skills detected against this job
                description.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SkillGroup
              title="Matched Required Skills"
              skills={
                match.skills
                  .matchedRequiredSkills
              }
              matched
            />

            <SkillGroup
              title="Missing Required Skills"
              skills={
                match.skills
                  .missingRequiredSkills
              }
            />

            <SkillGroup
              title="Matched Preferred Skills"
              skills={
                match.skills
                  .matchedPreferredSkills
              }
              matched
            />

            <SkillGroup
              title="Missing Preferred Skills"
              skills={
                match.skills
                  .missingPreferredSkills
              }
            />
          </div>
        </section>

        {/* Experience + Education */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Experience */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <UserRound size={20} />
              </div>

              <h2 className="font-bold text-slate-900">
                Experience
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <InfoBox
                label="Your Experience"
                value={`${match.experience.candidateYears} years`}
              />

              <InfoBox
                label="Required"
                value={
                  match.experience.requiredYears !==
                  null
                    ? `${match.experience.requiredYears}+ years`
                    : "Not specified"
                }
              />
            </div>

            <div
              className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                match.experience.matched
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {match.experience.matched ? (
                <CheckCircle2 size={17} />
              ) : (
                <XCircle size={17} />
              )}

              {match.experience.matched
                ? "Experience requirement satisfied"
                : "Experience requirement not satisfied"}
            </div>
          </section>

          {/* Education */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <GraduationCap size={20} />
              </div>

              <h2 className="font-bold text-slate-900">
                Education
              </h2>
            </div>

            <div
              className={`mt-5 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                match.education.matched
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {match.education.matched ? (
                <CheckCircle2 size={17} />
              ) : (
                <XCircle size={17} />
              )}

              {match.education.matched
                ? "Education requirement satisfied"
                : "Education requirement not satisfied"}
            </div>

            {match.education.matchedRequirements
              .length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Matched Requirements
                </p>

                <div className="space-y-2">
                  {match.education.matchedRequirements.map(
                    (requirement) => (
                      <div
                        key={requirement}
                        className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                      >
                        {requirement}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Certifications */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Award size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Certifications
                </h2>

                <p className="text-sm text-slate-500">
                  Certifications detected against this
                  job description.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-amber-700">
                {certifications.matchPercentage}%
              </p>

              <p className="text-xs font-medium text-amber-600">
                Match
              </p>
            </div>
          </div>

          {certifications.required === 0 ? (
            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-400">
              No certification requirement specified
              for this job.
            </div>
          ) : (
            <>
              {/* Required Certifications */}
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Required Certifications
                </p>

                <p className="mt-1 text-lg font-bold text-slate-800">
                  {certifications.required}
                </p>
              </div>

              {/* Exact Matches */}
              {certifications.exactMatches.length >
                0 && (
                <div className="mt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-600"
                    />

                    <h3 className="text-sm font-semibold text-emerald-700">
                      Exact Matches
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {certifications.exactMatches.map(
                      (certification, index) => (
                        <div
                          key={`${certification.required}-${certification.candidate}-${index}`}
                          className="rounded-xl bg-emerald-50 p-4"
                        >
                          <p className="text-sm font-semibold text-emerald-800">
                            {certification.candidate}
                          </p>

                          <p className="mt-1 text-xs text-emerald-700">
                            Matches required:{" "}
                            {certification.required}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-emerald-800">
                            Match:{" "}
                            {certification.score}%
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Partial Matches */}
              {certifications.partialMatches.length >
                0 && (
                <div className="mt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Award
                      size={16}
                      className="text-amber-600"
                    />

                    <h3 className="text-sm font-semibold text-amber-700">
                      Partial Matches
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {certifications.partialMatches.map(
                      (certification, index) => (
                        <div
                          key={`${certification.required}-${certification.candidate}-${index}`}
                          className="rounded-xl bg-amber-50 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-amber-800">
                                {
                                  certification.candidate
                                }
                              </p>

                              <p className="mt-1 text-xs text-amber-700">
                                Required:{" "}
                                {
                                  certification.required
                                }
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                              {certification.score}%
                            </span>
                          </div>

                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-amber-100">
                            <div
                              className="h-full rounded-full bg-amber-500"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    certification.score,
                                    0,
                                  ),
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Missing Certifications */}
              {certifications.missing.length >
                0 && (
                <div className="mt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <XCircle
                      size={16}
                      className="text-red-600"
                    />

                    <h3 className="text-sm font-semibold text-red-700">
                      Missing Certifications
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {certifications.missing.map(
                      (certification) => (
                        <span
                          key={certification}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700"
                        >
                          <XCircle size={13} />
                          {certification}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* No Certification Match */}
              {certifications.exactMatches.length ===
                0 &&
                certifications.partialMatches.length ===
                  0 &&
                certifications.missing.length ===
                  0 && (
                  <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-400">
                    No certification matches detected.
                  </div>
                )}
            </>
          )}
        </section>

        {/* Recommendations */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">
            Recommendations
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Suggestions generated from the stored
            analysis.
          </p>

          {recommendations.length === 0 ? (
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={17} />
              No improvement recommendations were
              generated.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {recommendations.map(
                (recommendation, index) => (
                  <div
                    key={`${recommendation.type}-${index}`}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {recommendation.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {recommendation.message}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-500 ring-1 ring-slate-200">
                        {recommendation.priority}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

interface ScoreCardProps {
  label: string;
  score: number;
  weight: number;
}

const ScoreCard = ({
  label,
  score,
  weight,
}: ScoreCardProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-slate-500">
      {label}
    </p>

    <div className="mt-2 flex items-end justify-between gap-3">
      <p className="text-2xl font-bold text-slate-900">
        {score}%
      </p>

      <span className="text-xs text-slate-400">
        Weight {weight}%
      </span>
    </div>

    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-emerald-600 transition-all"
        style={{
          width: `${Math.min(
            Math.max(score, 0),
            100,
          )}%`,
        }}
      />
    </div>
  </div>
);

interface SkillGroupProps {
  title: string;
  skills: string[];
  matched?: boolean;
}

const SkillGroup = ({
  title,
  skills,
  matched = false,
}: SkillGroupProps) => (
  <div>
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-sm font-semibold text-slate-800">
        {title}
      </h3>

      <span className="text-xs text-slate-400">
        {skills.length}
      </span>
    </div>

    {skills.length === 0 ? (
      <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-400">
        None detected
      </p>
    ) : (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              matched
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {skill}
          </span>
        ))}
      </div>
    )}
  </div>
);

interface InfoBoxProps {
  label: string;
  value: string;
}

const InfoBox = ({
  label,
  value,
}: InfoBoxProps) => (
  <div className="rounded-xl bg-slate-50 p-4">
    <p className="text-xs text-slate-400">
      {label}
    </p>

    <p className="mt-1 font-bold text-slate-800">
      {value}
    </p>
  </div>
);

export default JobMatchHistoryDetail;
