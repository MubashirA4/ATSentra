const parseDate = (value, isEnd = false) => {
  if (!value) {
    return null;
  }

  const text = value.trim();

  const monthYearMatch = text.match(
    /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})$/i,
  );

  if (monthYearMatch) {
    const month = new Date(
      `${monthYearMatch[1]} 1, ${monthYearMatch[2]}`,
    ).getMonth();

    const year = Number(monthYearMatch[2]);

    return new Date(
      year,
      month,
      isEnd ? 1 : 1,
    );
  }

  const yearMatch = text.match(/^(\d{4})$/);

  if (yearMatch) {
    return new Date(
      Number(yearMatch[1]),
      isEnd ? 11 : 0,
      1,
    );
  }

  return null;
};

export const calculateExperienceYears = (experience = []) => {
  let totalMonths = 0;

  for (const job of experience) {
    const start = parseDate(job.startDate);

    if (!start) {
      continue;
    }

    const end = job.isCurrent
      ? new Date()
      : parseDate(job.endDate, true);

    if (!end) {
      continue;
    }

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (months > 0) {
      totalMonths += months;
    }
  }

  return {
    totalMonths,
    totalYears: Number(
      (totalMonths / 12).toFixed(1),
    ),
  };
};

export const matchExperience = ({
  experience = [],
  requirement,
}) => {
  if (!requirement) {
    return {
      requiredYears: null,
      candidateYears: calculateExperienceYears(
        experience,
      ).totalYears,
      matched: true,
      score: 100,
    };
  }

  const candidateExperience =
    calculateExperienceYears(experience);

  const requiredYears = requirement.minYears ?? 0;

  const matched =
    candidateExperience.totalYears >= requiredYears;

  return {
    requiredYears,
    candidateYears: candidateExperience.totalYears,
    matched,
    score: matched ? 100 : 0,
  };
};