import {
  CheckCircle2,
  FileCheck2,
  FileText,
  Sparkles,
} from "lucide-react";

import StatCard from "./StatCard";

import type {
  Resume,
  ResumeContent,
} from "@types/resume";

interface DashboardStatsProps {
  resumes: Resume[];
  resume: Resume | null;
  resumeContent: ResumeContent | null;
  loading: boolean;
}

const DashboardStats = ({
  resumes,
  resume,
  resumeContent,
  loading,
}: DashboardStatsProps) => {
  const totalResumes = resumes.length;

  const analyzedResumes = resumes.filter(
    (item: any) => item.status === "processed",
  ).length;

  const qualityScore =
    resumeContent?.qualityAnalysis?.percentage ?? null;

  const statusLabel = resume?.status
    ? resume.status.charAt(0).toUpperCase() +
      resume.status.slice(1)
    : "No resume";

  const statusDescription = resume
    ? resume.status === "processed"
      ? "Resume is ready"
      : resume.status === "processing"
        ? "Analysis in progress"
        : resume.status === "failed"
          ? "Analysis failed"
          : "Waiting for analysis"
    : "Upload a resume to begin";

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Sparkles}
        label="Resume Quality"
        value={
          qualityScore !== null
            ? `${qualityScore}%`
            : "—"
        }
        description={
          qualityScore !== null
            ? resumeContent?.qualityAnalysis?.rating ??
              "Quality score"
            : "No analysis available"
        }
        loading={loading}
      />

      <StatCard
        icon={FileText}
        label="Total Resumes"
        value={totalResumes}
        description={
          totalResumes === 0
            ? "No resumes uploaded"
            : totalResumes === 1
              ? "1 resume in your account"
              : `${totalResumes} resumes in your account`
        }
        loading={loading}
      />

      <StatCard
        icon={FileCheck2}
        label="Analyzed"
        value={analyzedResumes}
        description={
          analyzedResumes === 0
            ? "No completed analyses"
            : analyzedResumes === 1
              ? "1 completed analysis"
              : `${analyzedResumes} completed analyses`
        }
        loading={loading}
      />

      <StatCard
        icon={CheckCircle2}
        label="Latest Status"
        value={statusLabel}
        description={statusDescription}
        loading={loading}
      />
    </section>
  );
};

export default DashboardStats;
