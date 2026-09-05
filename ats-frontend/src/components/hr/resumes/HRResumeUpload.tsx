import { useRef, useState } from "react";
import {
  FileUp,
  X,
} from "lucide-react";

interface HRResumeUploadProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const HRResumeUpload = ({
  open,
  loading,
  onClose,
  onUpload,
}: HRResumeUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [error, setError] =
    useState<string>("");

  if (!open) {
    return null;
  }

  const handleFileChange = (
    selectedFile: File | undefined,
  ) => {
    if (!selectedFile) {
      return;
    }

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError(
        "Only PDF and DOCX resumes are supported.",
      );
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a resume.");
      return;
    }

    await onUpload(file);

    setFile(null);
    setError("");
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setFile(null);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Upload Candidate Resume
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload a PDF or DOCX resume for processing.
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-10 text-center transition hover:border-emerald-500 hover:bg-emerald-50/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <FileUp size={23} />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-800">
              {file
                ? file.name
                : "Choose a resume"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              PDF or DOCX
            </p>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            hidden
            onChange={(event) =>
              handleFileChange(
                event.target.files?.[0],
              )
            }
          />

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!file || loading}
              onClick={handleSubmit}
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Uploading..."
                : "Upload Resume"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRResumeUpload;