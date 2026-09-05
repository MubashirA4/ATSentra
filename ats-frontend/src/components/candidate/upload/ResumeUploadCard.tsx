import FileDropzone from "./FileDropzone";
import UploadProgress, {
  type ProcessingStep,
} from "./UploadProgress";

interface ResumeUploadCardProps {
  file: File | null;
  processing: boolean;
  processingStep: ProcessingStep;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onAnalyze: () => void;
}

const ResumeUploadCard = ({
  file,
  processing,
  processingStep,
  onFileSelect,
  onFileRemove,
  onAnalyze,
}: ResumeUploadCardProps) => {
  if (processing) {
    return <UploadProgress currentStep={processingStep} />;
  }

  return (
    <div className="rounded-xl border border-cream-300 bg-white p-6 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-500">
          Resume file
        </p>

        <h2 className="mt-2 font-display text-2xl text-text-primary">
          Upload your resume
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
          Upload your latest resume and we’ll evaluate its structure,
          skills, experience, keywords, and overall ATS readiness.
        </p>
      </div>

      <div className="mt-7">
        <FileDropzone
          file={file}
          onFileSelect={onFileSelect}
          onFileRemove={onFileRemove}
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-cream-200 pt-5">
        <p className="text-xs leading-5 text-text-muted">
          Your resume will be analyzed for ATS compatibility.
        </p>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={!file}
          className="rounded-lg bg-forest-800  px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-600 disabled:cursor-not-allowed "
        >
          Analyze Resume
        </button>
      </div>
    </div>
  );
};

export default ResumeUploadCard;