import { useEffect, useState } from "react";

import {
  getResumeAnalysis,
  getResumes,
} from "@features/candidate/services/resume";

import type {
  Resume,
  ResumeContent,
} from "@types/resume";

interface UseLatestResumeAnalysisResult {
  resumes: Resume[];
  resume: Resume | null;
  resumeContent: ResumeContent | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const useLatestResumeAnalysis =
  (): UseLatestResumeAnalysisResult => {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [resume, setResume] = useState<Resume | null>(null);
    const [resumeContent, setResumeContent] =
      useState<ResumeContent | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadLatestAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getResumes();

        const resumeList = response.data.resumes;

        setResumes(resumeList);

        const latestProcessedResume =
          resumeList.find(
            (item) => item.status === "processed",
          );

        if (!latestProcessedResume) {
          setResume(null);
          setResumeContent(null);
          return;
        }

        const analysisResponse =
          await getResumeAnalysis(
            latestProcessedResume._id,
          );

        setResume(latestProcessedResume);

        setResumeContent(
          analysisResponse.data.resumeContent,
        );
      } catch (error) {
        console.error(
          "Failed to load latest resume analysis:",
          error,
        );

        setError(
          "Unable to load your latest resume analysis.",
        );

        setResumes([]);
        setResume(null);
        setResumeContent(null);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadLatestAnalysis();
    }, []);

    return {
      resumes,
      resume,
      resumeContent,
      loading,
      error,
      refresh: loadLatestAnalysis,
    };
  };

export default useLatestResumeAnalysis;
