export const normalizeCertification = ({
  name,
  issuer,
  issueDate,
  expiryDate,
  credentialId,
}) => {
  return {
    name: name?.replace(/\s+/g, " ").trim() || null,
    issuer: issuer?.replace(/\s+/g, " ").trim() || null,
    issueDate: issueDate?.trim() || null,
    expiryDate: expiryDate?.trim() || null,
    credentialId: credentialId?.trim() || null,
  };
};