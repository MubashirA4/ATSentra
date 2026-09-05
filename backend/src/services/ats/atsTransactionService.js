import mongoose from "mongoose";
import Job from "../../models/Job.js";
import Candidate from "../../models/Candidate.js";
import ATSAnalysis from "../../models/ATSAnalysis.js";

export const saveATSDecisionTransaction = async ({
  jobData,
  candidateData,
  analysisData,
}) => {
  if (!jobData || typeof jobData !== "object") {
    throw new Error("Job data is required");
  }

  if (
    !candidateData ||
    typeof candidateData !== "object"
  ) {
    throw new Error("Candidate data is required");
  }

  if (
    !analysisData ||
    typeof analysisData !== "object"
  ) {
    throw new Error(
      "ATS analysis data is required",
    );
  }

  const session =
    await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(
      async () => {
        const [job] =
          await Job.create(
            [jobData],
            { session },
          );

        const [candidate] =
          await Candidate.create(
            [candidateData],
            { session },
          );

        const [analysis] =
          await ATSAnalysis.create(
            [
              {
                ...analysisData,
                jobId: job._id,
                candidateId:
                  candidate._id,
              },
            ],
            { session },
          );

        result = {
          job,
          candidate,
          analysis,
        };
      },
    );

    return result;
  } finally {
    await session.endSession();
  }
};