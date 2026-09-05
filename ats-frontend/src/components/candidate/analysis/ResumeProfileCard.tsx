import {
 
  Globe,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import type {
  AnalysisPersonalInfo,
} from "../../../types/analysis";

interface ResumeProfileCardProps {
  personalInfo: AnalysisPersonalInfo;
  summary: string;
}

const ResumeProfileCard = ({
  personalInfo,
  summary,
}: ResumeProfileCardProps) => {
  return (
    <div className="rounded-xl border border-cream-300 bg-white p-6 shadow-soft">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-500">
          Resume profile
        </p>

        <h2 className="mt-2 font-display text-2xl text-text-primary">
          {personalInfo.name || "Unnamed candidate"}
        </h2>
      </div>

      {/* Contact information */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {personalInfo.email && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cream-100">
              <Mail className="h-4 w-4 text-text-secondary" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-text-muted">
                Email
              </p>

              <p className="mt-0.5 truncate text-sm font-medium text-text-primary">
                {personalInfo.email}
              </p>
            </div>
          </div>
        )}

        {personalInfo.phone && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cream-100">
              <Phone className="h-4 w-4 text-text-secondary" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-text-muted">
                Phone
              </p>

              <p className="mt-0.5 text-sm font-medium text-text-primary">
                {personalInfo.phone}
              </p>
            </div>
          </div>
        )}

        {personalInfo.location && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cream-100">
              <MapPin className="h-4 w-4 text-text-secondary" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-text-muted">
                Location
              </p>

              <p className="mt-0.5 text-sm font-medium text-text-primary">
                {personalInfo.location}
              </p>
            </div>
          </div>
        )}

        {personalInfo.linkedin && (
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 transition hover:opacity-80"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cream-100">
              <Globe className="h-4 w-4 text-text-secondary" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-text-muted">
                LinkedIn
              </p>

              <p className="mt-0.5 truncate text-sm font-medium text-mint-600">
                {personalInfo.linkedin}
              </p>
            </div>
          </a>
        )}

        {personalInfo.github && (
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 transition hover:opacity-80"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cream-100">
              {/* <Github className="h-4 w-4 text-text-secondary" /> */}
            </div>

            <div className="min-w-0">
              <p className="text-xs text-text-muted">
                GitHub
              </p>

              <p className="mt-0.5 truncate text-sm font-medium text-mint-600">
                {personalInfo.github}
              </p>
            </div>
          </a>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mt-7 border-t border-cream-200 pt-6">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-mint-500" />

            <h3 className="text-sm font-semibold text-text-primary">
              Professional summary
            </h3>
          </div>

          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeProfileCard;