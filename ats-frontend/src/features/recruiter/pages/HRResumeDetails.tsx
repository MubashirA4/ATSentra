import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getRecruiterResumeDetails } from "@features/recruiter/services/recruiterResume.service";
import type {
  RecruiterResume,
  ResumeContent,
} from "@types/recruiterResume";

interface ExperienceItem {
  jobTitle?: string | null;
  company?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
  employmentType?: string | null;
  responsibilities?: string[];
  achievements?: string[];
}

interface EducationItem {
  degree?: string | null;
  institution?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
}

const HRResumeDetails = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState<RecruiterResume | null>(null);
  const [resumeContent, setResumeContent] = useState<ResumeContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resumeId) return;

    const loadResume = async () => {
      try {
        setLoading(true);

        const data = await getRecruiterResumeDetails(resumeId);
        setResume(data.resume);
        setResumeContent(data.resumeContent ?? null);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load resume details");
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [resumeId]);

  if (loading) {
    return <ResumeDetailsSkeleton />;
  }

  if (!resume || !resumeContent) {
    return (
      <div className="p-6">
        <button
          type="button"
          onClick={() => navigate("/hr/resumes")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to resumes
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="font-semibold text-slate-900">
            Resume details unavailable
          </p>

          <p className="mt-1 text-sm text-slate-500">
            This resume may not have been processed yet.
          </p>
        </div>
      </div>
    );
  }

  const parsed = resumeContent.parsedResume;
  const personalInfo = parsed?.personalInfo;
  const experiences = (parsed?.experience as ExperienceItem[]) ?? [];
  const education = (parsed?.education as EducationItem[]) ?? [];
  const skills = parsed?.skills ?? [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/hr/resumes")}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to resumes
        </button>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {personalInfo?.name || resume.originalName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {resume.originalName}
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={17} />
            Processed
          </div>
        </div>
      </div>

      {/* Candidate Profile */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          icon={<User size={19} />}
          title="Candidate Profile"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {personalInfo?.email && (
            <InfoItem
              icon={<Mail size={17} />}
              label="Email"
              value={personalInfo.email}
            />
          )}

          {personalInfo?.phone && (
            <InfoItem
              icon={<Phone size={17} />}
              label="Phone"
              value={personalInfo.phone}
            />
          )}

          {personalInfo?.location && (
            <InfoItem
              icon={<MapPin size={17} />}
              label="Location"
              value={personalInfo.location}
            />
          )}
        </div>
      </section>

      {/* Summary */}
      {parsed?.summary && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle
            icon={<Sparkles size={19} />}
            title="Professional Summary"
          />

          <p className="text-sm leading-7 text-slate-600">
            {parsed.summary}
          </p>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle
            icon={<Sparkles size={19} />}
            title="Skills"
          />

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle
            icon={<BriefcaseBusiness size={19} />}
            title="Professional Experience"
          />

          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={`${experience.jobTitle}-${index}`}
                experience={experience}
                isLast={index === experiences.length - 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle
            icon={<GraduationCap size={19} />}
            title="Education"
          />

          <div className="space-y-4">
            {education.map((item, index) => (
              <EducationCard
                key={`${item.degree}-${index}`}
                education={item}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
}

const SectionTitle = ({ icon, title }: SectionTitleProps) => {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <div className="text-emerald-700">{icon}</div>
      <h2 className="font-semibold text-slate-900">{title}</h2>
    </div>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-500">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
};

interface ExperienceCardProps {
  experience: ExperienceItem;
  isLast: boolean;
}

const ExperienceCard = ({
  experience,
  isLast,
}: ExperienceCardProps) => {
  return (
    <div className="relative">
      {!isLast && (
        <div className="absolute left-[9px] top-7 h-[calc(100%+24px)] w-px bg-slate-200" />
      )}

      <div className="flex gap-4">
        <div className="relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-4 border-white bg-emerald-600 shadow-sm" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <div>
              <h3 className="font-semibold text-slate-900">
                {experience.jobTitle || "Experience"}
              </h3>

              <p className="mt-1 text-sm font-medium text-emerald-700">
                {experience.company || "Company unavailable"}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CalendarDays size={14} />
              {formatExperienceDate(experience)}
            </div>
          </div>

          {experience.location && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={14} />
              {experience.location}
            </p>
          )}

          {experience.responsibilities &&
            experience.responsibilities.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Responsibilities
                </p>

                <ul className="space-y-2">
                  {experience.responsibilities.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="relative pl-5 text-sm leading-6 text-slate-600"
                    >
                      <span className="absolute left-0 top-[10px] h-1.5 w-1.5 rounded-full bg-slate-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {experience.achievements &&
            experience.achievements.length > 0 && (
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Key Achievements
                </p>

                <ul className="space-y-2">
                  {experience.achievements.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="relative pl-5 text-sm leading-6 text-slate-700"
                    >
                      <CheckCircle2
                        size={15}
                        className="absolute left-0 top-[5px] text-emerald-600"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

interface EducationCardProps {
  education: EducationItem;
}

const EducationCard = ({ education }: EducationCardProps) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
      <div className="flex flex-col justify-between gap-2 sm:flex-row">
        <div>
          <h3 className="font-semibold text-slate-900">
            {education.degree || "Degree unavailable"}
          </h3>

          <p className="mt-1 text-sm font-medium text-emerald-700">
            {cleanInstitution(education.institution)}
          </p>
        </div>

        {(education.startDate || education.endDate) && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarDays size={14} />
            {education.startDate || "—"}
            {" - "}
            {education.isCurrent ? "Present" : education.endDate || "—"}
          </div>
        )}
      </div>

      {education.location && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin size={14} />
          {education.location}
        </p>
      )}
    </div>
  );
};

const cleanInstitution = (institution?: string | null) => {
  if (!institution) {
    return "Institution unavailable";
  }

  return institution.replace(/\(\s*\)$/, "").trim();
};

const formatExperienceDate = (experience: ExperienceItem) => {
  const start = experience.startDate || "Unknown";
  const end = experience.isCurrent ? "Present" : experience.endDate || "Unknown";
  return `${start} - ${end}`;
};

const ResumeDetailsSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
      <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
      <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
      <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
      <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
};

export default HRResumeDetails;
