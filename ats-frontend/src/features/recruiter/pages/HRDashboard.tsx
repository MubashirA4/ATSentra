import { useEffect, useState } from "react";

import { getJobs } from "@features/recruiter/services/job.service";
import useATSDashboard from "@features/recruiter/hooks/useATSDashboard";
import type { ATSJob } from "@types/job";

import HRDashboardHeader from "@features/recruiter/components/dashboard/HRDashboardHeader";
import HRJobContextCard from "@features/recruiter/components/dashboard/HRJobContextCard";
import HROverviewStats from "@features/recruiter/components/dashboard/HROverviewStats";
import HRAnalyticsSection from "@features/recruiter/components/dashboard/HRAnalyticsSection";
import HRSkillInsights from "@features/recruiter/components/dashboard/HRSkillInsights";
import HROutstandingCandidates from "@features/recruiter/components/dashboard/HROutstandingCandidates";
import HRRecentCandidates from "@features/recruiter/components/dashboard/HRRecentCandidates";

import {
  HRDashboardError,
  HRDashboardEmpty,
  HRNoJobs,
} from "@features/recruiter/components/dashboard/HRDashboardStates";

import HRDashboardSkeleton from "@features/recruiter/components/dashboard/HRDashboardSkeleton";
import HRDashboardFilters from "@features/recruiter/components/dashboard/HRDashboardFilters";
import HRDashboardPagination from "@features/recruiter/components/dashboard/HRDashboardPagination";
import HRDashboardSorting from "@features/recruiter/components/dashboard/HRDashboardSorting";

const HRDashboard = () => {
  /* -------------------------------------------------------------------------- */
  /* Jobs                                                                        */
  /* -------------------------------------------------------------------------- */

  const [jobs, setJobs] = useState<ATSJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");

  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /* Filters                                                                     */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");

  const [eligible, setEligible] = useState<boolean | undefined>(
    undefined,
  );

  const [minScore, setMinScore] = useState<number | undefined>(
    undefined,
  );

  const [maxScore, setMaxScore] = useState<number | undefined>(
    undefined,
  );

  /* -------------------------------------------------------------------------- */
  /* Pagination                                                                  */
  /* -------------------------------------------------------------------------- */

  const [page, setPage] = useState(1);

  /* -------------------------------------------------------------------------- */
  /* Sorting                                                                     */
  /* -------------------------------------------------------------------------- */

  const [sortBy, setSortBy] = useState<
    "rankingScore" | "rank" | "createdAt"
  >("rankingScore");

  const [sortOrder, setSortOrder] = useState<
    "asc" | "desc"
  >("desc");

  /* -------------------------------------------------------------------------- */
  /* Load Open Jobs                                                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError(null);

        const response = await getJobs({
          status: "open",
        });

        const loadedJobs = response.data.jobs;

        setJobs(loadedJobs);

        if (loadedJobs.length > 0) {
          setSelectedJobId((current) => {
            const stillExists = loadedJobs.some(
              (job) => job._id === current,
            );

            return stillExists
              ? current
              : loadedJobs[0]._id;
          });
        }
      } catch (error) {
        console.error(
          "Failed to load jobs:",
          error,
        );

        setJobsError(
          "Unable to load your open jobs.",
        );
      } finally {
        setJobsLoading(false);
      }
    };

    loadJobs();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* ATS Dashboard                                                               */
  /* -------------------------------------------------------------------------- */

  const {
    data,
    loading,
    error,
    refresh,
  } = useATSDashboard(
    selectedJobId
      ? {
          jobId: selectedJobId,
          page,
          limit: 10,
          search,
          skill,
          eligible,
          minScore,
          maxScore,
          sortBy,
          sortOrder,
        }
      : null,
  );

  /* -------------------------------------------------------------------------- */
  /* Reset Pagination When Dashboard Parameters Change                           */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setPage(1);
  }, [
    selectedJobId,
    search,
    skill,
    eligible,
    minScore,
    maxScore,
    sortBy,
    sortOrder,
  ]);

  /* -------------------------------------------------------------------------- */
  /* Selected Job                                                                */
  /* -------------------------------------------------------------------------- */

  const selectedJob = jobs.find(
    (job) => job._id === selectedJobId,
  );

  /* -------------------------------------------------------------------------- */
  /* Initial Loading                                                             */
  /* -------------------------------------------------------------------------- */

  if (jobsLoading) {
    return <HRDashboardSkeleton />;
  }

  /* -------------------------------------------------------------------------- */
  /* Jobs Error                                                                  */
  /* -------------------------------------------------------------------------- */

  if (jobsError) {
    return (
      <HRDashboardError
        title="Unable to load jobs"
        message={jobsError}
      />
    );
  }

  /* -------------------------------------------------------------------------- */
  /* No Open Jobs                                                                */
  /* -------------------------------------------------------------------------- */

  if (jobs.length === 0) {
    return <HRNoJobs />;
  }

  /* -------------------------------------------------------------------------- */
  /* Dashboard                                                                    */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-8">
      {/* 1. Dashboard Header */}
      <HRDashboardHeader
        jobs={jobs}
        selectedJobId={selectedJobId}
        onJobChange={setSelectedJobId}
        loading={loading}
        onRefresh={refresh}
      />

      {/* 2. Selected Job Context */}
      {selectedJob && (
        <HRJobContextCard
          job={selectedJob}
        />
      )}

      {/* 3. Dashboard Error */}
      {error && (
        <HRDashboardError
          title="Unable to load ATS analytics"
          message={error}
          compact
        />
      )}

      {/* 4. Dashboard Content */}
      {loading && !data ? (
        <HRDashboardSkeleton contentOnly />
      ) : data ? (
        <div className="space-y-8">
          {/* Overview */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-forest-950">
                Overview
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                High-level performance of candidates for this
                position.
              </p>
            </div>

            <HROverviewStats
              overview={data.overview}
            />
          </section>

          {/* Candidate Filters */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-forest-950">
                Candidate Search
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Filter candidates by skills, eligibility,
                and ATS score.
              </p>
            </div>

            <div className="space-y-4">
              <HRDashboardFilters
                search={search}
                skill={skill}
                eligible={eligible}
                minScore={minScore}
                maxScore={maxScore}
                onSearchChange={setSearch}
                onSkillChange={setSkill}
                onEligibleChange={setEligible}
                onMinScoreChange={setMinScore}
                onMaxScoreChange={setMaxScore}
                onClear={() => {
                  setSearch("");
                  setSkill("");
                  setEligible(undefined);
                  setMinScore(undefined);
                  setMaxScore(undefined);
                }}
              />

              <HRDashboardSorting
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
              />
            </div>
          </section>

          {/* Analytics */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-forest-950">
                Recruitment Analytics
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Understand candidate scores, experience,
                and education alignment.
              </p>
            </div>

            <HRAnalyticsSection
              distributions={data.distributions}
              experience={data.experience}
              education={data.education}
            />
          </section>

          {/* Skill Insights */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-forest-950">
                Skill Insights
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Identify missing and underrepresented skills
                across candidates.
              </p>
            </div>

            <HRSkillInsights
              skillGaps={data.skillGaps}
              requiredSkillGaps={
                data.requiredSkillGaps
              }
            />
          </section>

          {/* Outstanding Candidates */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-forest-950">
                Top Candidates
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Candidates with the strongest overall match
                for this position.
              </p>
            </div>

            <HROutstandingCandidates
              candidates={data.topCandidates}
            />
          </section>

          {/* Recent Candidates */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-forest-950">
                Recent Candidates
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Latest candidates evaluated for this job.
              </p>
            </div>

            <HRRecentCandidates
              candidates={data.recentCandidates}
            />
          </section>

          {/* Pagination */}
          <HRDashboardPagination
            pagination={data.pagination}
            onPageChange={setPage}
            loading={loading}
          />
        </div>
      ) : (
        <HRDashboardEmpty />
      )}
    </div>
  );
};

export default HRDashboard;
