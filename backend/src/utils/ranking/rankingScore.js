export const normalizeScore = (score) => {
  const numericScore = Number(score);

  if (!Number.isFinite(numericScore)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, numericScore),
  );
};

export const calculateRankingScore = ({
  matchScore = 0,
}) => {
  return normalizeScore(matchScore);
};