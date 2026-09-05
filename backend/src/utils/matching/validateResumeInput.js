export const validateResumeInput = (resume) => {
  if (!resume || typeof resume !== "object") {
    throw new Error("Parsed resume is required");
  }

  if (!Array.isArray(resume.skills)) {
    throw new Error(
      "Invalid resume.skills: expected an array",
    );
  }

  if (!Array.isArray(resume.experience)) {
    throw new Error(
      "Invalid resume.experience: expected an array",
    );
  }

  if (!Array.isArray(resume.education)) {
    throw new Error(
      "Invalid resume.education: expected an array",
    );
  }

  if (
    resume.certifications !== undefined &&
    !Array.isArray(resume.certifications)
  ) {
    throw new Error(
      "Invalid resume.certifications: expected an array",
    );
  }

  return true;
};