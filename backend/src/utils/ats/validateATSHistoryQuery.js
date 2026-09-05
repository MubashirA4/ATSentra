import mongoose from "mongoose";

const ALLOWED_SORT_FIELDS = [
  "rankingScore",
  "rank",
  "createdAt",
];

const ALLOWED_SORT_ORDERS = [
  "asc",
  "desc",
];

const parseBoolean = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  if (value === "true" || value === true) {
    return true;
  }

  if (value === "false" || value === false) {
    return false;
  }

  throw new Error(
    "eligible must be true or false",
  );
};

const parseNumber = (
  value,
  fieldName,
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(
      `${fieldName} must be a valid number`,
    );
  }

  return number;
};

export const validateATSHistoryQuery = ({
  jobId,
  query = {},
}) => {
  if (!jobId) {
    throw new Error(
      "Job ID is required",
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      jobId,
    )
  ) {
    throw new Error(
      "Invalid Job ID",
    );
  }

  const page =
    parseNumber(
      query.page,
      "page",
    ) ?? 1;

  const limit =
    parseNumber(
      query.limit,
      "limit",
    ) ?? 20;

  const minScore =
    parseNumber(
      query.minScore,
      "minScore",
    );

  const maxScore =
    parseNumber(
      query.maxScore,
      "maxScore",
    );

  const minRank =
    parseNumber(
      query.minRank,
      "minRank",
    );

  const maxRank =
    parseNumber(
      query.maxRank,
      "maxRank",
    );

  if (
    !Number.isInteger(page) ||
    page < 1
  ) {
    throw new Error(
      "page must be a positive integer",
    );
  }

  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    throw new Error(
      "limit must be between 1 and 100",
    );
  }

  if (
    minScore !== undefined &&
    (minScore < 0 || minScore > 100)
  ) {
    throw new Error(
      "minScore must be between 0 and 100",
    );
  }

  if (
    maxScore !== undefined &&
    (maxScore < 0 || maxScore > 100)
  ) {
    throw new Error(
      "maxScore must be between 0 and 100",
    );
  }

  if (
    minScore !== undefined &&
    maxScore !== undefined &&
    minScore > maxScore
  ) {
    throw new Error(
      "minScore cannot exceed maxScore",
    );
  }

  if (
    minRank !== undefined &&
    (!Number.isInteger(minRank) ||
      minRank < 1)
  ) {
    throw new Error(
      "minRank must be a positive integer",
    );
  }

  if (
    maxRank !== undefined &&
    (!Number.isInteger(maxRank) ||
      maxRank < 1)
  ) {
    throw new Error(
      "maxRank must be a positive integer",
    );
  }

  if (
    minRank !== undefined &&
    maxRank !== undefined &&
    minRank > maxRank
  ) {
    throw new Error(
      "minRank cannot exceed maxRank",
    );
  }

  const eligible =
    parseBoolean(query.eligible);

  const sortBy =
    query.sortBy ??
    "rankingScore";

  const sortOrder =
    query.sortOrder ??
    "desc";

  if (
    !ALLOWED_SORT_FIELDS.includes(
      sortBy,
    )
  ) {
    throw new Error(
      `sortBy must be one of: ${ALLOWED_SORT_FIELDS.join(", ")}`,
    );
  }

  if (
    !ALLOWED_SORT_ORDERS.includes(
      sortOrder,
    )
  ) {
    throw new Error(
      "sortOrder must be asc or desc",
    );
  }

  const search =
    typeof query.search === "string"
      ? query.search.trim()
      : "";

  const skill =
    typeof query.skill === "string"
      ? query.skill.trim()
      : "";

  return {
    page,
    limit,
    search,
    eligible,
    minScore,
    maxScore,
    minRank,
    maxRank,
    skill,
    sortBy,
    sortOrder,
  };
};