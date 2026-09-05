import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { motion } from "framer-motion";

interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const FileDropzone = ({
  file,
  onFileSelect,
  onFileRemove,
  disabled = false,
}: FileDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (selectedFile: File) => {
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError("Please upload a PDF, DOC, or DOCX file.");
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10 MB.");
      return false;
    }

    setError("");
    return true;
  };

  const handleFile = (selectedFile: File) => {
    if (disabled) return;

    if (!validateFile(selectedFile)) {
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      handleFile(selectedFile);
    }

    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragging(false);

    if (disabled) return;

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  if (file) {
    return (
      <div className="rounded-xl border border-cream-300 bg-cream-50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-mint-100 text-mint-500">
              <FileText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onFileRemove}
            disabled={disabled}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-muted transition hover:bg-white hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        animate={{
          borderColor: isDragging ? "#4fa878" : undefined,
          backgroundColor: isDragging ? "#f1f9f4" : undefined,
        }}
        onDragOver={(event) => {
          event.preventDefault();

          if (!disabled) {
            setIsDragging(true);
          }
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.click();
          }
        }}
        className={`group cursor-pointer rounded-xl border-2 border-dashed border-cream-300 bg-surface p-10 text-center transition hover:border-mint-300 hover:bg-cream-50 ${
          disabled ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-mint-100 text-mint-500 transition group-hover:scale-105">
          <UploadCloud className="h-7 w-7" />
        </div>

        <h3 className="mt-5 text-base font-semibold text-text-primary">
          Drop your resume here
        </h3>

        <p className="mt-2 text-sm text-text-secondary">
          or click to browse from your computer
        </p>

        <p className="mt-4 text-xs text-text-muted">
          PDF, DOC, or DOCX · Maximum 10 MB
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </motion.div>

      {error && (
        <p className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileDropzone;