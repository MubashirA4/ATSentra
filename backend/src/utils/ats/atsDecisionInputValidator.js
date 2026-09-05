export const validateATSDecisionInput = (
  input,
) => {
  if (!input || typeof input !== "object") {
    throw new Error(
      "ATS decision input is required",
    );
  }

  const {
    job,
    candidates,
    jobId,
  } = input;

  if (!job || typeof job !== "object") {
    throw new Error(
      "ATS decision job is required",
    );
  }

  if (!Array.isArray(candidates)) {
    throw new Error(
      "ATS decision candidates must be an array",
    );
  }

  if (candidates.length === 0) {
    throw new Error(
      "ATS decision requires at least one candidate",
    );
  }

  if (
    jobId !== undefined &&
    jobId !== null &&
    String(jobId).trim() === ""
  ) {
    throw new Error(
      "ATS decision jobId cannot be empty",
    );
  }

  candidates.forEach(
    (candidate, index) => {
      if (
        !candidate ||
        typeof candidate !== "object"
      ) {
        throw new Error(
          `Invalid candidate at index ${index}`,
        );
      }

      if (
        candidate.candidateId ===
          undefined ||
        candidate.candidateId === null ||
        String(candidate.candidateId).trim() ===
          ""
      ) {
        throw new Error(
          `Candidate ID is required at index ${index}`,
        );
      }

      if (
        !candidate.resume ||
        typeof candidate.resume !==
          "object"
      ) {
        throw new Error(
          `Candidate resume is required at index ${index}`,
        );
      }
    },
  );

  return true;
};