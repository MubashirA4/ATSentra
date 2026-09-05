import mongoose from "mongoose";
import AppError from "../AppError.js";

export const validateATSDashboardQuery = ({
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
  if (!jobId) {
    throw new AppError("Job ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new AppError("Invalid Job ID", 400);
  }

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (!Number.isInteger(parsedPage) || parsedPage <= 0) {
    throw new AppError("Page must be a positive integer", 400);
  }

  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100) {
    throw new AppError("Limit must be between 1 and 100", 400);
  }

  if (
    minScore !== undefined &&
    minScore !== null &&
    (!Number.isFinite(Number(minScore)) ||
      Number(minScore) < 0 ||
      Number(minScore) > 100)
  ) {
    throw new AppError("minScore must be between 0 and 100", 400);
  }

  if (
    maxScore !== undefined &&
    maxScore !== null &&
    (!Number.isFinite(Number(maxScore)) ||
      Number(maxScore) < 0 ||
      Number(maxScore) > 100)
  ) {
    throw new AppError("maxScore must be between 0 and 100", 400);
  }

  if (
    minScore !== undefined &&
    maxScore !== undefined &&
    Number(minScore) > Number(maxScore)
  ) {
    throw new AppError("minScore cannot be greater than maxScore",400);
  }

  let normalizedEligible;

  if (eligible !== undefined && eligible !== null) {
    if (
      eligible !== true &&
      eligible !== false &&
      eligible !== "true" &&
      eligible !== "false"
    ) {
      throw new AppError("eligible must be true or false",400);
    }

    normalizedEligible = eligible === true || eligible === "true";
  }

  const allowedSortBy = ["rankingScore", "rank", "createdAt"];

  if (!allowedSortBy.includes(sortBy)) {
    throw new AppError("Invalid sortBy",400);
  }

  if (sortOrder !== "asc" && sortOrder !== "desc") {
    throw new AppError("sortOrder must be asc or desc",400);
  }

  return {
    jobId,

    page: parsedPage,

    limit: parsedLimit,

    search: String(search ?? "").trim(),

    skill: String(skill ?? "").trim(),

    eligible: normalizedEligible,

    minScore:
      minScore === undefined || minScore === null
        ? undefined
        : Number(minScore),

    maxScore:
      maxScore === undefined || maxScore === null
        ? undefined
        : Number(maxScore),

    sortBy,

    sortOrder,
  };
};
