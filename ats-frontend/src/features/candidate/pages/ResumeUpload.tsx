import { useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import ResumeUploadCard from "@features/candidate/components/upload/ResumeUploadCard";
import type { ProcessingStep } from "@features/candidate/components/upload/UploadProgress";
import { processResume, uploadResume } from "@features/candidate/services/resume";

const ResumeUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] =
    useState<ProcessingStep>("uploading");
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setProcessing(true);
      setProcessingStep("uploading");

      const uploadResponse = await uploadResume(file);

      const resumeId = uploadResponse.data.resume._id;

      setProcessingStep("extracting");

      await processResume(resumeId);

      setProcessingStep("parsing");

      // Small UX delay so the user can actually see the step.
      await new Promise((resolve) => setTimeout(resolve, 400));

      setProcessingStep("analyzing");

      await new Promise((resolve) => setTimeout(resolve, 400));

      navigate(`/candidate/resume-analysis/${resumeId}`);
    } catch (error) {
      console.error("Resume analysis failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to upload or process your resume. Please try again.";

      setError(message);
      setProcessing(false);
      setProcessingStep("uploading");
    }
  };

  return (
    <div className="mx-auto w-full max-w-350 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/candidate/dashboard")}
          className="inline-flex items-center gap-2 bg-white p-2 rounded-sm text-sm font-medium text-text-secondary transition hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </button>

        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-500">
            Resume analysis
          </p>

          <h1 className="mt-2 font-display text-4xl text-text-primary">
            See how ATS-ready your resume is.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            Upload your resume to receive a structured analysis of your skills,
            experience, keywords, resume quality, and areas for improvement.
          </p>
        </div>
      </motion.div>

      {error && !processing && (
        <motion.div
          initial={{
            opacity: 0,
            y: 6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </motion.div>
      )}

      <div className="mt-8">
        <ResumeUploadCard
          file={file}
          processing={processing}
          processingStep={processingStep}
          onFileSelect={(selectedFile) => {
            setFile(selectedFile);
            setError(null);
          }}
          onFileRemove={() => {
            setFile(null);
            setError(null);
          }}
          onAnalyze={handleAnalyze}
        />
      </div>

      {!processing && (
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.15,
          }}
          className="mt-6 grid gap-4 md:grid-cols-3"
        >
          <div className="rounded-lg border border-cream-300 bg-white p-5">
            <p className="text-sm font-semibold text-text-primary">
              ATS compatibility
            </p>

            <p className="mt-2 text-xs leading-5 text-text-muted">
              Evaluate the structure and content of your resume for applicant
              tracking systems.
            </p>
          </div>

          <div className="rounded-lg border border-cream-300 bg-white p-5">
            <p className="text-sm font-semibold text-text-primary">
              Skill matching
            </p>

            <p className="mt-2 text-xs leading-5 text-text-muted">
              Identify the skills present in your resume and areas where
              relevant skills may be missing.
            </p>
          </div>

          <div className="rounded-lg border border-cream-300 bg-white p-5">
            <p className="text-sm font-semibold text-text-primary">
              Actionable feedback
            </p>

            <p className="mt-2 text-xs leading-5 text-text-muted">
              Get practical recommendations to strengthen your resume.
            </p>
          </div>
        </motion.div>
      )}

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-text-muted">
        <ShieldCheck className="h-4 w-4 text-mint-500" />
        Your resume is processed securely.
      </div>
    </div>
  );
};

export default ResumeUpload;
