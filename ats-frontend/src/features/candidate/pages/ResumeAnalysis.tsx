import { useEffect, useState } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import ResumeAnalysisHeader from "@features/candidate/components/analysis/ResumeAnalysisHeader";
import AnalysisScoreOverview from "@features/candidate/components/analysis/AnalysisScoreOverview";
import ResumeQualityCard from "@features/candidate/components/analysis/ResumeQualityCard";
import ResumeProfileCard from "@features/candidate/components/analysis/ResumeProfileCard";

import ExperienceAnalysisCard from "@features/candidate/components/analysis/ExperienceAnalysisCard";
import EducationCard from "@features/candidate/components/analysis/EducationCard";
import AnalysisRecommendationsCard from "@features/candidate/components/analysis/AnalysisRecommendationsCard";
import SkillsAnalysisCard from "@features/candidate/components/analysis/SkillsAnalysisCard";

import { getResumeAnalysis } from "@features/candidate/services/resume";

import type { Resume, ResumeContent } from "@types/resume";

export const ResumeAnalysis = () => {
  const navigate = useNavigate();

  const { resumeId } = useParams<{
    resumeId: string;
  }>();

  const [resume, setResume] = useState<Resume | null>(null);
  const [resumeContent, setResumeContent] = useState<ResumeContent | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resumeId) {
      setError("Resume ID is missing.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getResumeAnalysis(resumeId);

        if (!isMounted) {
          return;
        }

        setResume(response.data.resume);
        setResumeContent(response.data.resumeContent);
      } catch (error) {
        console.error("Failed to load resume analysis:", error);

        if (!isMounted) {
          return;
        }

        setError("Unable to load this resume analysis. Please try again.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAnalysis();

    return () => {
      isMounted = false;
    };
  }, [resumeId]);

  /*
   * Missing resume ID
   */
  if (!resumeId) {
    return (
      <AnalysisError
        message="The resume ID is missing from the URL."
        onBack={() => navigate("/candidate/dashboard")}
      />
    );
  }

  /*
   * Loading state
   */
  if (loading) {
    return <AnalysisLoading />;
  }

  /*
   * Error state
   */
  if (error || !resume || !resumeContent) {
    return (
      <AnalysisError
        message={error || "Resume analysis data could not be loaded."}
        onBack={() => navigate("/candidate/dashboard")}
      />
    );
  }

  /*
   * Backend analysis data
   */
  const { parsedResume, qualityAnalysis } = resumeContent;

  return (
    <div className="mx-auto max-w-350 pb-10">
      {/* Header */}
      <ResumeAnalysisHeader
        resumeName={resume.originalName}
        analyzedAt={resume.updatedAt}
        score={qualityAnalysis.percentage}
      />

      {/* Score overview */}
      <AnalysisScoreOverview quality={qualityAnalysis} />

      {/* Profile + quality */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <ResumeProfileCard
          personalInfo={parsedResume.personalInfo}
          summary={parsedResume.summary}
        />

        <ResumeQualityCard quality={qualityAnalysis} />
      </section>

      {/* Skills */}
      <section className="mt-6">
        <SkillsAnalysisCard
          skills={parsedResume.skills}
          quality={qualityAnalysis.breakdown.skills}
        />
      </section>

      {/* Experience */}
      <section className="mt-6">
        <ExperienceAnalysisCard
          experience={parsedResume.experience}
          quality={qualityAnalysis.breakdown.experience}
        />
      </section>

      {/* Education + recommendations */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <EducationCard
          education={parsedResume.education}
          certifications={parsedResume.certifications}
          quality={qualityAnalysis.breakdown.education}
        />

        <AnalysisRecommendationsCard
          issues={qualityAnalysis.issues}
          strengths={qualityAnalysis.strengths}
        />
      </section>
    </div>
  );
};

export default ResumeAnalysis;

/* -------------------------------------------------------------------------- */
/* Loading State                                                              */
/* -------------------------------------------------------------------------- */

const AnalysisLoading = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-350 items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint-100">
          <Loader2 className="h-5 w-5 animate-spin text-mint-500" />
        </div>

        <h2 className="mt-4 font-display text-lg text-text-primary">
          Loading resume analysis
        </h2>

        <p className="mt-1 max-w-sm text-sm text-text-muted">
          We're retrieving your resume analysis and preparing the results.
        </p>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Error State                                                                */
/* -------------------------------------------------------------------------- */

interface AnalysisErrorProps {
  message: string;
  onBack: () => void;
}

const AnalysisError = ({ message, onBack }: AnalysisErrorProps) => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-350 items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-cream-300 bg-surface p-8 text-center shadow-soft">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-danger/10">
          <AlertCircle className="h-5 w-5 text-danger" />
        </div>

        <h2 className="mt-4 font-display text-lg text-text-primary">
          Unable to load analysis
        </h2>

        <p className="mt-2 text-sm leading-6 text-text-muted">{message}</p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-cream-300 px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-cream-100"
          >
            Back to dashboard
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-lg bg-forest-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-forest-800"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
};
