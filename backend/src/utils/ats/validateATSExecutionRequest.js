import mongoose from "mongoose";

export const validateATSExecutionRequest =
  (data) => {
    if (
      !data ||
      typeof data !== "object"
    ) {
      throw new Error(
        "ATS execution request is required",
      );
    }

    const {
      jobId,
      candidateIds,
    } = data;

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

    if (!Array.isArray(candidateIds)) {
      throw new Error(
        "Candidate IDs must be an array",
      );
    }

    if (candidateIds.length === 0) {
      throw new Error(
        "At least one candidate is required",
      );
    }

    const uniqueIds =
      new Set(
        candidateIds.map((id) =>
          String(id),
        ),
      );

    if (
      uniqueIds.size !==
      candidateIds.length
    ) {
      throw new Error(
        "Duplicate candidate IDs are not allowed",
      );
    }

    candidateIds.forEach(
      (candidateId) => {
        if (
          !mongoose.Types.ObjectId.isValid(
            candidateId,
          )
        ) {
          throw new Error(
            `Invalid Candidate ID: ${candidateId}`,
          );
        }
      },
    );

    return true;
  };