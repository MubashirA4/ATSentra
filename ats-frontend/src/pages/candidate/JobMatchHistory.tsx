import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  getCandidateJobMatchHistory,
  type JobMatchHistoryItem,
} from "../../services/jobMatch/jobMatchHistoryService";

import toast from "react-hot-toast";
import getErrorMessage from "../../utils/getErrorMessage";

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
  return new Date(date).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );
};

const JobMatchHistory = () => {
  const navigate = useNavigate();

  const [matches, setMatches] = useState<
    JobMatchHistoryItem[]
  >([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const loadHistory = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response =
          await getCandidateJobMatchHistory({
            page,
            limit: 10,
          });

        setMatches(
          response.data.matches,
        );

        setTotalPages(
          response.data.pagination.totalPages,
        );

        setTotal(
          response.data.pagination.total,
        );
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            "Failed to load job match history",
          ),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page],
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handlePrevious = () => {
    if (page > 1) {
      setPage((current) => current - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((current) => current + 1);
    }
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Job Match
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Sparkles size={20} />
                </div>

                <span className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Candidate ATS
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Job Match History
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Review your previous CV matches and
                compare how well your resume aligned
                with each job description.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadHistory(true)}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>

              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <Search size={16} />
                New Match
              </Link>
            </div>
          </div>
        </div>

        {/* Summary */}
        {!loading && total > 0 && (
          <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
            <FileText size={16} />
            <span>
              {total} saved{" "}
              {total === 1
                ? "job match"
                : "job matches"}
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="h-5 w-2/5 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/4 rounded bg-slate-200" />
                <div className="mt-6 h-20 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && matches.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <BriefcaseBusiness size={26} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No job matches yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Run your first CV-to-job match to see
              your analysis history here.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <Search size={16} />
              Create Job Match
            </Link>
          </div>
        )}

        {/* History */}
        {!loading && matches.length > 0 && (
          <div className="space-y-4">
            {matches.map((item) => {
              const score =
                item.match.score;

              return (
                <article
                  key={item._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* Job information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-4">
                          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 sm:flex">
                            <BriefcaseBusiness
                              size={21}
                            />
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate text-lg font-bold text-slate-900">
                              {item.job.title ||
                                "Untitled Position"}
                            </h2>

                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                              {item.job.company && (
                                <span className="font-medium text-slate-700">
                                  {item.job.company}
                                </span>
                              )}

                              {item.job.location && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin
                                    size={14}
                                  />
                                  {item.job.location}
                                </span>
                              )}

                              {item.job.employmentType && (
                                <span>
                                  {
                                    item.job
                                      .employmentType
                                  }
                                </span>
                              )}
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                              <CalendarDays
                                size={14}
                              />
                              Matched on{" "}
                              {formatDate(
                                item.createdAt,
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-4 lg:justify-end">
                        <div className="text-right">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Match Score
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-3xl font-bold text-slate-900">
                              {score}%
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getScoreClasses(
                                score,
                              )}`}
                            >
                              {getScoreLabel(
                                score,
                              )}
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/jobs/history/${item._id}`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                          title="View analysis"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-4">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">
                          Required Skills
                        </p>
                        <p className="mt-1 text-base font-bold text-slate-800">
                          {
                            item.match.skills
                              .requiredMatchPercentage
                          }
                          %
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">
                          Preferred Skills
                        </p>
                        <p className="mt-1 text-base font-bold text-slate-800">
                          {
                            item.match.skills
                              .preferredMatchPercentage
                          }
                          %
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">
                          Experience
                        </p>
                        <p className="mt-1 text-base font-bold text-slate-800">
                          {item.match.experience.score}
                          %
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">
                          Education
                        </p>
                        <p className="mt-1 text-base font-bold text-slate-800">
                          {item.match.education.score}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 0 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-800">
                {page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatchHistory;