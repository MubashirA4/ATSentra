import mongoose from "mongoose";

import CandidateJobMatch from "../../models/CandidateJobMatch.js";

const validateUserId = (userId) => {
  if (!userId) {
    throw new Error("Authenticated user is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid authenticated user ID");
  }
};

export const getCandidateJobMatchHistory = async ({
  userId,
  page = 1,
  limit = 10,
}) => {
  validateUserId(userId);

  const currentPage = Math.max(
    Number.parseInt(page, 10) || 1,
    1,
  );

  const perPage = Math.min(
    Math.max(
      Number.parseInt(limit, 10) || 10,
      1,
    ),
    50,
  );

  const skip = (currentPage - 1) * perPage;

  const filter = {
    userId,
  };

  const [matches, total] = await Promise.all([
    CandidateJobMatch.find(filter)
      .select("-__v -fingerprint -jobDescription")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean(),

    CandidateJobMatch.countDocuments(filter),
  ]);

  const totalPages =
    total === 0
      ? 0
      : Math.ceil(total / perPage);

  return {
    matches,
    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages,
      hasNextPage:
        currentPage < totalPages,
      hasPreviousPage:
        currentPage > 1,
    },
  };
};