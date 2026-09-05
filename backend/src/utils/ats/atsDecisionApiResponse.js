export const buildATSDecisionApiResponse = ({
  result,
}) => {
  if (!result || typeof result !== "object") {
    throw new Error(
      "ATS decision result is required",
    );
  }

  if (!Array.isArray(result.candidates)) {
    throw new Error(
      "ATS decision candidates must be an array",
    );
  }

  return {
    job: {
      jobId:
        result.jobId ??
        null,

      jobTitle:
        result.job?.jobTitle ??
        result.job?.title ??
        null,

      company:
        result.job?.company ??
        null,

      location:
        result.job?.location ??
        null,
    },

    persisted:
      Array.isArray(
        result.persistedAnalyses,
      ),

    candidates:
      result.candidates.map(
        (candidate) => ({
          candidateId:
            candidate.candidateId,

          rank:
            candidate.rank,

          rankingScore:
            candidate.rankingScore,

          eligible:
            candidate.eligible,

          eligibilityReasons:
            candidate.eligibilityReasons ??
            [],

          matchResult:
            candidate.matchResult,

          explanation:
            candidate.explanation,

          rankingComparison:
            candidate.rankingComparison,

          analysisId:
            result.persistedAnalyses?.find(
              (analysis) =>
                String(
                  analysis.candidateId,
                ) ===
                String(
                  candidate.candidateId,
                ),
            )?._id ?? null,
        }),
      ),
  };
};