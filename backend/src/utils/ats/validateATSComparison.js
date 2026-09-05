import mongoose from "mongoose";

export const validateAnalysisId = (
  analysisId,
) => {
  if (!analysisId) {
    throw new Error(
      "Analysis ID is required",
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      analysisId,
    )
  ) {
    throw new Error(
      "Invalid Analysis ID",
    );
  }

  return true;
};

export const validateCandidateComparisonIds =
  ({
    jobId,
    candidateA,
    candidateB,
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

    if (!candidateA) {
      throw new Error(
        "First candidate ID is required",
      );
    }

    if (!candidateB) {
      throw new Error(
        "Second candidate ID is required",
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        candidateA,
      )
    ) {
      throw new Error(
        "Invalid first candidate ID",
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        candidateB,
      )
    ) {
      throw new Error(
        "Invalid second candidate ID",
      );
    }

    if (
      String(candidateA) ===
      String(candidateB)
    ) {
      throw new Error(
        "Cannot compare a candidate with itself",
      );
    }

    return true;
  };