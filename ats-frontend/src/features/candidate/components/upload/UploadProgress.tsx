import {
  Check,
  FileSearch,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";

export type ProcessingStep =
  | "uploading"
  | "extracting"
  | "parsing"
  | "analyzing";

interface UploadProgressProps {
  currentStep: ProcessingStep;
}

const steps = [
  {
    id: "uploading",
    label: "Uploading resume",
    description: "Securely preparing your document",
    icon: Upload,
  },
  {
    id: "extracting",
    label: "Extracting content",
    description: "Reading text and resume structure",
    icon: FileSearch,
  },
  {
    id: "parsing",
    label: "Parsing resume",
    description: "Identifying your profile information",
    icon: FileSearch,
  },
  {
    id: "analyzing",
    label: "Analyzing resume",
    description: "Calculating your ATS compatibility",
    icon: Sparkles,
  },
] as const;

const UploadProgress = ({
  currentStep,
}: UploadProgressProps) => {
  const currentIndex = steps.findIndex(
    (step) => step.id === currentStep
  );

  return (
    <div className="rounded-xl border border-cream-300 bg-surface p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-500">
          Resume analysis
        </p>

        <h2 className="mt-2 font-display text-2xl text-text-primary">
          Analyzing your resume
        </h2>

        <p className="mt-2 text-sm leading-6 text-text-secondary">
          We’re processing your resume and preparing your ATS
          analysis.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {steps.map((step, index) => {
          const Icon = step.icon;

          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.08,
              }}
              className="flex items-start gap-4"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  isCompleted
                    ? "bg-mint-100 text-mint-500"
                    : isCurrent
                      ? "bg-forest-900 text-white"
                      : "bg-cream-100 text-text-muted"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>

              <div className="pt-0.5">
                <p
                  className={`text-sm font-semibold ${
                    isCurrent || isCompleted
                      ? "text-text-primary"
                      : "text-text-muted"
                  }`}
                >
                  {step.label}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-cream-200">
        <motion.div
          className="h-full rounded-full bg-mint-500"
          animate={{
            width: `${((currentIndex + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
};

export default UploadProgress;
