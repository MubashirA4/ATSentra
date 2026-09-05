import { getATSJobAnalytics } from "./atsAnalyticsService.js";

import { getATSAnalysisHistory } from "./atsHistoryService.js";

import { validateATSDashboardQuery } from "../../utils/ats/validateATSDashboardQuery.js";

export const getATSDashboard = async ({
  jobId,
  page = 1,
  limit = 10,
  search = "",
  skill = "",
  eligible,
  minScore,
  maxScore,
  sortBy = "rankingScore",
  sortOrder = "desc",
}) => {
  const query = validateATSDashboardQuery({
    jobId,
    page,
    limit,
    search,
    skill,
    eligible,
    minScore,
    maxScore,
    sortBy,
    sortOrder,
  });

  const [analytics, history] = await Promise.all([
    getATSJobAnalytics({
      jobId: query.jobId,
      query: {
        search: query.search,
        skill: query.skill,
        eligible: query.eligible,
        minScore: query.minScore,
        maxScore: query.maxScore,
        sortOrder: query.sortOrder,
      },
    }),

    getATSAnalysisHistory({
      jobId: query.jobId,
      query: {
        page: query.page,
        limit: query.limit,
        search: query.search,
        eligible: query.eligible,
        minScore: query.minScore,
        maxScore: query.maxScore,
        skill: query.skill,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      },
    }),
  ]);

  return {
    overview: analytics.overview,

    topCandidates: analytics.topCandidates ?? [],

    skillGaps: analytics.skillGaps ?? [],

    requiredSkillGaps: analytics.requiredSkillGaps ?? [],

    experience: analytics.experience ?? {},

    education: analytics.education ?? {},

    distributions: analytics.distributions ?? {
      score: [],
      ranking: [],
    },

    recentCandidates: history.analyses ?? [],

    pagination: history.pagination,

    filters: {
      search: query.search,

      skill: query.skill,

      eligible: query.eligible,

      minScore: query.minScore,

      maxScore: query.maxScore,

      page: query.page,

      limit: query.limit,

      sortBy: query.sortBy,

      sortOrder: query.sortOrder,
    },
  };
};
