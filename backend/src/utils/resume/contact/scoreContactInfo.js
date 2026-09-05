export const scoreContactInfo = (personalInfo = {}) => {
  let score = 0;
  const issues = [];
  const strengths = [];

  if (personalInfo.name?.trim()) {
    score += 2;
    strengths.push("Name is present");
  } else {
    issues.push("Name is missing");
  }

  if (personalInfo.email?.trim()) {
    score += 3;
    strengths.push("Email is present");
  } else {
    issues.push("Email is missing");
  }

  if (personalInfo.phone?.trim()) {
    score += 2;
    strengths.push("Phone number is present");
  } else {
    issues.push("Phone number is missing");
  }

  if (personalInfo.location?.trim()) {
    score += 1;
  }

  if (personalInfo.linkedin?.trim()) {
    score += 1;
  }

  if (personalInfo.github?.trim()) {
    score += 1;
  }

  return {
    score,
    maxScore: 10,
    issues,
    strengths,
  };
};