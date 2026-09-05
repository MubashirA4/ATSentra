import mongoose from "mongoose";

import CandidateJobMatch from "../../models/CandidateJobMatch.js";

const validateId = (id, fieldName = "ID") => {
  if (!id) {
    throw new Error(`${fieldName} is required`);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

export const getCandidateJobMatchDetail = async ({
  matchId,
  userId,
}) => {
  validateId(matchId, "Job match ID");
  validateId(userId, "Authenticated user ID");

  const match = await CandidateJobMatch.findOne({
    _id: matchId,
    userId,
  })
    .select("-__v -fingerprint -jobDescription")
    .lean();

  if (!match) {
    throw new Error(
      "Job match not found or you do not have permission to view it",
    );
  }

  return match;
};