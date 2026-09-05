import { isCertificationLine, cleanCertificationLine } from "./line.js";
import { extractCertificationName } from "./name.js";
import { extractCertificationIssuer } from "./issuer.js";
import { extractCertificationDates } from "./date.js";
import { extractCredentialId } from "./credential.js";
import { normalizeCertification } from "./normalize.js";
import { deduplicateCertifications } from "./deduplicate.js";
import { validateCertifications } from "./validate.js";

export const parseCertifications = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return [];
  }

  const certificationLines = lines
    .filter(isCertificationLine)
    .map(cleanCertificationLine)
    .filter(Boolean);

  const certifications = certificationLines.map((text) => {
    const name = extractCertificationName(text);

    const issuer = extractCertificationIssuer(text);

    const {
      issueDate,
      expiryDate,
    } = extractCertificationDates(text);

    const credentialId = extractCredentialId(text);

    return normalizeCertification({
      name,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
    });
  });

  const uniqueCertifications =
    deduplicateCertifications(certifications);

  const validation =
    validateCertifications(uniqueCertifications);

  if (!validation.valid) {
    return [];
  }

  return uniqueCertifications;
};