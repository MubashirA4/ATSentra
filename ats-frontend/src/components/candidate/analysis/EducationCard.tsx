import {
  Award,
  CalendarDays,
  GraduationCap,
  MapPin,
} from "lucide-react";

import type {
  ParsedCertification,
  ParsedEducation,
  QualitySection,
} from "../../../types/resume";

interface EducationCardProps {
  education: ParsedEducation[];
  certifications: ParsedCertification[];
  quality: QualitySection;
}

const EducationCard = ({
  education,
  certifications,
  quality,
}: EducationCardProps) => {
  const qualityPercentage =
    quality.maxScore > 0
      ? Math.round((quality.score / quality.maxScore) * 100)
      : 0;

  return (
    <div className="rounded-xl border border-cream-300 bg-white p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-100">
              <GraduationCap className="h-4 w-4 text-mint-500" />
            </div>

            <div>
              <h2 className="font-display text-lg text-text-primary">
                Education
              </h2>

              <p className="text-sm text-text-muted">
                Academic background and certifications
              </p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Quality
          </p>

          <p className="mt-1 font-display text-lg text-text-primary">
            {quality.score}
            <span className="text-sm font-normal text-text-muted">
              {" "}
              / {quality.maxScore}
            </span>
          </p>

          <p className="text-xs font-medium text-mint-500">
            {qualityPercentage}%
          </p>
        </div>
      </div>

      {/* Education */}
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">
            Academic Education
          </h3>

          <span className="text-xs text-text-muted">
            {education.length}{" "}
            {education.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {education.length > 0 ? (
          <div className="space-y-4">
            {education.map((item, index) => (
              <div
                key={`${item.degree}-${item.institution}-${index}`}
                className="rounded-lg border border-cream-300 bg-surface-muted p-4"
              >
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cream-200">
                    <GraduationCap className="h-4 w-4 text-forest-700" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-text-primary">
                      {item.degree || "Degree not specified"}
                    </h4>

                    <p className="mt-1 text-sm text-text-secondary">
                      {item.institution || "Institution not specified"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{item.location}</span>
                        </div>
                      )}

                      {(item.startDate || item.endDate) && (
                        <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <CalendarDays className="h-3.5 w-3.5" />

                          <span>
                            {item.startDate || "—"}
                            {" – "}
                            {item.isCurrent
                              ? "Present"
                              : item.endDate || "—"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No education entries were detected." />
        )}
      </div>

      {/* Certifications */}
      <div className="mt-7 border-t border-cream-300 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">
            Certifications
          </h3>

          <span className="text-xs text-text-muted">
            {certifications.length}{" "}
            {certifications.length === 1 ? "certificate" : "certificates"}
          </span>
        </div>

        {certifications.length > 0 ? (
          <div className="space-y-3">
            {certifications.map((certification, index) => (
              <div
                key={`${certification.name}-${index}`}
                className="flex gap-3 rounded-lg border border-cream-300 bg-surface-muted p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mint-100">
                  <Award className="h-4 w-4 text-mint-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-text-primary">
                    {certification.name || "Certification not specified"}
                  </h4>

                  {certification.issuer && (
                    <p className="mt-1 text-sm text-text-secondary">
                      {certification.issuer}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {certification.issueDate && (
                      <span className="text-xs text-text-muted">
                        Issued: {certification.issueDate}
                      </span>
                    )}

                    {certification.expiryDate && (
                      <span className="text-xs text-text-muted">
                        Expires: {certification.expiryDate}
                      </span>
                    )}

                    {certification.credentialId && (
                      <span className="text-xs text-text-muted">
                        ID: {certification.credentialId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No certifications were detected." />
        )}
      </div>

      {/* Quality Feedback */}
      {(quality.strengths.length > 0 || quality.issues.length > 0) && (
        <div className="mt-7 border-t border-cream-300 pt-6">
          <h3 className="text-sm font-semibold text-text-primary">
            Education Quality
          </h3>

          {quality.strengths.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-mint-500">
                Strengths
              </p>

              <ul className="mt-2 space-y-1.5">
                {quality.strengths.map((strength, index) => (
                  <li
                    key={`strength-${index}`}
                    className="flex gap-2 text-sm text-text-secondary"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {quality.issues.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-warning">
                Areas to improve
              </p>

              <ul className="mt-2 space-y-1.5">
                {quality.issues.map((issue, index) => (
                  <li
                    key={`issue-${index}`}
                    className="flex gap-2 text-sm text-text-secondary"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="rounded-lg border border-dashed border-cream-300 bg-surface-muted px-4 py-6 text-center">
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
};

export default EducationCard;