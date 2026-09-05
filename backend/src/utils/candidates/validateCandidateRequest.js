export const validateCreateCandidateRequest =
  (data) => {
    if (
      !data ||
      typeof data !== "object"
    ) {
      throw new Error(
        "Candidate data is required",
      );
    }

    const {
      name,
      email,
      skills,
      experience,
      education,
      status,
    } = data;

    if (
      typeof name !== "string" ||
      name.trim() === ""
    ) {
      throw new Error(
        "Candidate name is required",
      );
    }

    if (
      email !== undefined &&
      email !== null &&
      typeof email !== "string"
    ) {
      throw new Error(
        "Candidate email must be a string",
      );
    }

    if (
      skills !== undefined &&
      !Array.isArray(skills)
    ) {
      throw new Error(
        "Candidate skills must be an array",
      );
    }

    if (
      experience !== undefined &&
      !Array.isArray(experience)
    ) {
      throw new Error(
        "Candidate experience must be an array",
      );
    }

    if (
      education !== undefined &&
      !Array.isArray(education)
    ) {
      throw new Error(
        "Candidate education must be an array",
      );
    }

    if (status !== undefined) {
      const allowedStatuses = [
        "active",
        "inactive",
        "archived",
      ];

      if (
        !allowedStatuses.includes(
          status,
        )
      ) {
        throw new Error(
          "Invalid candidate status",
        );
      }
    }

    return true;
  };

export const validateUpdateCandidateRequest =
  (data) => {
    if (
      !data ||
      typeof data !== "object"
    ) {
      throw new Error(
        "Candidate update data is required",
      );
    }

    if (
      Object.keys(data).length === 0
    ) {
      throw new Error(
        "At least one candidate field is required",
      );
    }

    return validateCreateCandidateRequest({
      name:
        data.name ??
        "Existing Candidate",
      ...data,
    });
  };