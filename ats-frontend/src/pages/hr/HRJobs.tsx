import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getJobs } from "../../services/jobs/jobService";
import type {
  ATSJob,
  JobSortField,
  JobStatus,
  JobsStats,
} from "../../types/job";

import HRJobsHeader from "../../components/hr/jobs/HRJobsHeader";
import HRJobsStats from "../../components/hr/jobs/HRJobsStats";
import HRJobsFilters from "../../components/hr/jobs/HRJobsFilters";
import HRJobsTable from "../../components/hr/jobs/HRJobsTable";
import HRJobsPagination from "../../components/hr/jobs/HRJobsPagination";
import HRJobsSkeleton from "../../components/hr/jobs/HRJobsSkeleton";

import {
  HRJobsError,
  HRJobsEmpty,
} from "../../components/hr/jobs/HRJobsStates";

const ITEMS_PER_PAGE = 8;

type SortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "company-asc";

const HRJobs = () => {
  const [jobs, setJobs] = useState<ATSJob[]>([]);
  const [stats, setStats] = useState<JobsStats>({
    all: 0,
    draft: 0,
    open: 0,
    closed: 0,
    archived: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<JobStatus | "all">("all");

  const [sort, setSort] =
    useState<SortOption>("newest");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalItems, setTotalItems] =
    useState(0);

  const getSortParams = (
    value: SortOption,
  ): {
    sortBy: JobSortField;
    sortOrder: "asc" | "desc";
  } => {
    switch (value) {
      case "oldest":
        return {
          sortBy: "createdAt",
          sortOrder: "asc",
        };

      case "title-asc":
        return {
          sortBy: "title",
          sortOrder: "asc",
        };

      case "title-desc":
        return {
          sortBy: "title",
          sortOrder: "desc",
        };

      case "company-asc":
        return {
          sortBy: "company",
          sortOrder: "asc",
        };

      case "newest":
      default:
        return {
          sortBy: "createdAt",
          sortOrder: "desc",
        };
    }
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        sortBy,
        sortOrder,
      } = getSortParams(sort);

      const response = await getJobs({
        search: search.trim() || undefined,
        status:
          status === "all"
            ? undefined
            : status,
        page,
        limit: ITEMS_PER_PAGE,
        sortBy,
        sortOrder,
      });

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to load jobs.",
        );
      }

      setJobs(response.data.jobs || []);

      setStats(
        response.data.stats || {
          all: 0,
          draft: 0,
          open: 0,
          closed: 0,
          archived: 0,
        },
      );

      setTotalPages(
        Math.max(
          1,
          response.data.pagination
            .totalPages,
        ),
      );

      setTotalItems(
        response.data.pagination.total,
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load jobs. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Reload whenever page, search, status or
   * sorting changes.
   */
  useEffect(() => {
    loadJobs();
  }, [page, search, status, sort]);

  /*
   * Search/filter/sort should always return
   * the recruiter to the first page.
   */
  useEffect(() => {
    setPage(1);
  }, [search, status, sort]);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setSort("newest");
    setPage(1);
  };

  const hasFilters =
    search.trim() !== "" ||
    status !== "all" ||
    sort !== "newest";

  if (loading && jobs.length === 0) {
    return <HRJobsSkeleton />;
  }

  if (error && jobs.length === 0) {
    return (
      <HRJobsError
        message={error}
        onRetry={loadJobs}
      />
    );
  }

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto w-full max-w-400 px-4 py-6 sm:px-6 lg:px-8">
        <HRJobsHeader />

        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <HRJobsStats
            stats={stats}
          />
        </motion.div>

        <div className="mt-6">
          <HRJobsFilters
            search={search}
            status={status}
            sort={sort}
            onSearchChange={setSearch}
            onStatusChange={(value) => {
              setStatus(value);
            }}
            onSortChange={setSort}
            onClear={clearFilters}
            hasFilters={hasFilters}
          />
        </div>

        <div className="mt-5">
          {jobs.length === 0 ? (
            <HRJobsEmpty
              hasFilters={hasFilters}
              onClear={clearFilters}
            />
          ) : (
            <>
              <HRJobsTable jobs={jobs} />

              <HRJobsPagination
                page={page}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRJobs;