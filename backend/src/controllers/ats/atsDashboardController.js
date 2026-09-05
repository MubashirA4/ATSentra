import { getATSDashboard } from "../../services/ats/atsDashboardService.js";

export const getATSDashboardController = async (req, res) => {
  const dashboard = await getATSDashboard({
    jobId: req.params.jobId,

    page: req.query.page,

    limit: req.query.limit,

    search: req.query.search,

    skill: req.query.skill,

    eligible: req.query.eligible,

    minScore: req.query.minScore,

    maxScore: req.query.maxScore,

    sortBy: req.query.sortBy,

    sortOrder: req.query.sortOrder,
  });

  return res.status(200).json({
    success: true,

    message: "ATS recruiter dashboard retrieved successfully",

    data: dashboard,
  });
};
