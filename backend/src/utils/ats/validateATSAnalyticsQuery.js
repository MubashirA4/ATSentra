import mongoose from "mongoose";

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

  if (
    value === "true" ||
    value === true
  ) {
    return true;
  }

  if (
    value === "false" ||
    value === false
  ) {
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

export const validateATSAnalyticsQuery = ({
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
    minScore !== undefined &&
    (minScore < 0 ||
      minScore > 100)
  ) {
    throw new Error(
      "minScore must be between 0 and 100",
    );
  }

  if (
    maxScore !== undefined &&
    (maxScore < 0 ||
      maxScore > 100)
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
    parseBoolean(
      query.eligible,
    );

  const search =
    typeof query.search === "string"
      ? query.search.trim()
      : "";

  const skill =
    typeof query.skill === "string"
      ? query.skill.trim()
      : "";

  const sortOrder =
    query.sortOrder ??
    "desc";

  if (
    !ALLOWED_SORT_ORDERS.includes(
      sortOrder,
    )
  ) {
    throw new Error(
      "sortOrder must be asc or desc",
    );
  }

  return {
    search,
    skill,
    eligible,
    minScore,
    maxScore,
    minRank,
    maxRank,
    sortOrder,
  };
};