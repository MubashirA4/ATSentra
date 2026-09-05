import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  FileText,
  Loader2,
  UserRound,
  Award,
  ChevronRight,
  BarChart3,
  Clock3,
  XCircle,
} from "lucide-react";

import { getCandidateById } from "../../services/candidates/candidateService";
import { getCandidateATSHistory } from "../../services/ats/atsCandidateHistory";

import type {
  Candidate,
  CandidateStatus,
} from "../../types/candidate";

import type {
  CandidateATSHistoryItem,
} from "../../types/atsAnalysis";

const statusConfig: Record<
  CandidateStatus,
  {
    label: string;
    className: string;
  }
> = {
  active: {
    label: "Active",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },

  inactive: {
    label: "Inactive",
    className:
      "bg-amber-50 text-amber-700 ring-amber-600/20",
  },

  archived: {
    label: "Archived",
    className:
      "bg-slate-100 text-slate-600 ring-slate-500/20",
  },
};

const formatDate = (date: string | null) => {
  if (!date) return "Present";

  return date;
};

const formatCreatedDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const formatAnalysisDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const getScoreClass = (score: number) => {
  if (score >= 80) {
    return "text-emerald-700 bg-emerald-50";
  }

  if (score >= 60) {
    return "text-amber-700 bg-amber-50";
  }

  return "text-red-700 bg-red-50";
};

export default function HRCandidateDetails() {
  const { candidateId } =
    useParams<{ candidateId: string }>();

  const navigate = useNavigate();

  const [candidate, setCandidate] =
    useState<Candidate | null>(null);

  const [atsAnalyses, setATSAnalyses] =
    useState<CandidateATSHistoryItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [atsLoading, setATSLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [atsError, setATSError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!candidateId) {
      setError("Candidate ID is missing.");
      setLoading(false);
      return;
    }

    const loadCandidate = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getCandidateById(candidateId);

        setCandidate(data);
      } catch (err) {
        console.error(
          "Failed to load candidate:",
          err,
        );

        setError(
          "Unable to load this candidate. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCandidate();
  }, [candidateId]);

  useEffect(() => {
    if (!candidateId) {
      return;
    }

    const loadATSHistory = async () => {
      try {
        setATSLoading(true);
        setATSError(null);

        const analyses =
          await getCandidateATSHistory(candidateId);

        setATSAnalyses(analyses);
      } catch (err) {
        console.error(
          "Failed to load candidate ATS history:",
          err,
        );

        setATSError(
          "Unable to load ATS analysis history.",
        );
      } finally {
        setATSLoading(false);
      }
    };

    loadATSHistory();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading candidate...
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <button
          type="button"
          onClick={() =>
            navigate("/hr/candidates")
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Candidates
        </button>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-sm font-medium text-red-700">
            {error || "Candidate not found."}
          </p>
        </div>
      </div>
    );
  }

  const status =
    statusConfig[candidate.status];

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Back */}
      <button
        type="button"
        onClick={() =>
          navigate("/hr/candidates")
        }
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Candidates
      </button>

      {/* Profile Header */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500" />

        <div className="p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-lg font-bold text-emerald-700">
                {getInitials(candidate.name)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {candidate.name}
                  </h1>

                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                  {candidate.email && (
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {candidate.email}
                    </span>
                  )}

                  {candidate.phone && (
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {candidate.phone}
                    </span>
                  )}

                  {candidate.location && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {candidate.location}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Candidate since{" "}
                  {formatCreatedDate(
                    candidate.createdAt,
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {candidate.resume && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                  Resume
                </button>
              )}

              <Link
                to="/hr/analysis"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-emerald-800"
              >
                <Award className="h-4 w-4 text-white" />
                <span className="text-white">ATS Analysis</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Skills */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Award className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Skills
                </h2>

                <p className="text-xs text-slate-500">
                  Skills extracted from the candidate's resume
                </p>
              </div>
            </div>

            {candidate.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No skills available.
              </p>
            )}
          </section>

          {/* Experience */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Experience
                </h2>

                <p className="text-xs text-slate-500">
                  Professional experience
                </p>
              </div>
            </div>

            {candidate.experience.length > 0 ? (
              <div className="space-y-8">
                {candidate.experience.map(
                  (experience, index) => (
                    <div
                      key={`${experience.company}-${experience.jobTitle}-${index}`}
                      className="relative pl-8"
                    >
                      {index !==
                        candidate.experience.length - 1 && (
                        <div className="absolute left-[7px] top-5 h-[calc(100%+2rem)] w-px bg-slate-200" />
                      )}

                      <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-4 border-emerald-100 bg-emerald-600" />

                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {experience.jobTitle}
                          </h3>

                          <p className="mt-1 text-sm font-medium text-emerald-700">
                            {experience.company}
                          </p>

                          {experience.location && (
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                              <MapPin className="h-3.5 w-3.5" />
                              {experience.location}
                            </p>
                          )}
                        </div>

                        <span className="text-xs font-medium text-slate-400">
                          {formatDate(
                            experience.startDate,
                          )}{" "}
                          —{" "}
                          {formatDate(
                            experience.endDate,
                          )}
                        </span>
                      </div>

                      {experience.responsibilities.length >
                        0 && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Responsibilities
                          </p>

                          <ul className="space-y-2">
                            {experience.responsibilities.map(
                              (item, itemIndex) => (
                                <li
                                  key={itemIndex}
                                  className="flex gap-2 text-sm leading-6 text-slate-600"
                                >
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                  {item}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      {experience.achievements.length >
                        0 && (
                        <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            Achievements
                          </p>

                          <ul className="space-y-2">
                            {experience.achievements.map(
                              (
                                achievement,
                                achievementIndex,
                              ) => (
                                <li
                                  key={
                                    achievementIndex
                                  }
                                  className="flex gap-2 text-sm leading-6 text-slate-700"
                                >
                                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                                  {achievement}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No experience information available.
              </p>
            )}
          </section>

          {/* ATS Analysis History */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <BarChart3 className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      ATS Analysis History
                    </h2>

                    <p className="text-xs text-slate-500">
                      Job-specific ATS evaluations for this candidate
                    </p>
                  </div>
                </div>

                {atsAnalyses.length > 0 && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {atsAnalyses.length}{" "}
                    {atsAnalyses.length === 1
                      ? "analysis"
                      : "analyses"}
                  </span>
                )}
              </div>
            </div>

            {atsLoading ? (
              <div className="flex items-center justify-center gap-3 p-10 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading ATS history...
              </div>
            ) : atsError ? (
              <div className="p-6">
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                  {atsError}
                </div>
              </div>
            ) : atsAnalyses.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <BarChart3 className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  No ATS analyses yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  This candidate has not been evaluated against a job yet.
                </p>

                <Link
                  to="/hr/analysis"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Run ATS Analysis
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {atsAnalyses.map((analysis) => (
                  <ATSHistoryRow
                    key={analysis._id}
                    analysis={analysis}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Candidate Overview */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Candidate Overview
                </h2>

                <p className="text-xs text-slate-500">
                  Basic candidate information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={
                  candidate.email ||
                  "Not provided"
                }
              />

              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={
                  candidate.phone ||
                  "Not provided"
                }
              />

              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={
                  candidate.location ||
                  "Not provided"
                }
              />

              <InfoRow
                icon={<FileText className="h-4 w-4" />}
                label="Resume"
                value={
                  candidate.resume
                    ? "Available"
                    : "Not available"
                }
              />
            </div>
          </section>

          {/* Education */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Education
                </h2>

                <p className="text-xs text-slate-500">
                  Academic background
                </p>
              </div>
            </div>

            {candidate.education.length > 0 ? (
              <div className="space-y-5">
                {candidate.education.map(
                  (education, index) => (
                    <div
                      key={`${education.institution}-${education.degree}-${index}`}
                      className="border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                    >
                      <h3 className="text-sm font-semibold text-slate-900">
                        {education.degree}
                      </h3>

                      <p className="mt-1 text-sm text-emerald-700">
                        {education.institution}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(
                          education.startDate,
                        )}{" "}
                        —{" "}
                        {formatDate(
                          education.endDate,
                        )}
                      </p>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No education information available.
              </p>
            )}
          </section>

          {/* ATS CTA */}
          <section className="overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Award className="h-5 w-5 text-emerald-300" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              Evaluate this candidate
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Run a new ATS evaluation against your available job requirements.
            </p>

            <Link
              to="/hr/analysis"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Open ATS Analysis
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function ATSHistoryRow({
  analysis,
}: {
  analysis: CandidateATSHistoryItem;
}) {
  const score = Math.round(
    analysis.rankingScore ?? 0,
  );

  const scoreClass = getScoreClass(score);

  const requiredMatch =
  analysis.matchResult?.skills?.requiredMatchPercentage ?? null;

const preferredMatch =
  analysis.matchResult?.skills?.preferredMatchPercentage ?? null;

  return (
    <div className="p-5 transition hover:bg-slate-50/70 lg:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {analysis.job?.title ||
                  "Unknown Job"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {analysis.job?.company ||
                  "Unknown Company"}
              </p>

              {analysis.job?.location && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {analysis.job.location}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${scoreClass}`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              {score}% ATS Score
            </span>

            {analysis.rank !== null && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                Rank #{analysis.rank}
              </span>
            )}

            {analysis.eligible ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Eligible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700">
                <XCircle className="h-3.5 w-3.5" />
                Not Eligible
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            {requiredMatch !== null && (
              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                Required: {requiredMatch}%
              </span>
            )}

            {preferredMatch !== null && (
              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                Preferred: {preferredMatch}%
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />
            {formatAnalysisDate(
              analysis.createdAt,
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({
  icon,
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}