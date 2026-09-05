import {
  CheckCircle2,
  Clock3,
  FileText,
  Play,
  Trash2,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type {
  RecruiterResume,
} from "@types/recruiterResume";

interface HRResumeRowProps {
  resume: RecruiterResume;
  processingId: string | null;
  onProcess: (resume: RecruiterResume) => void;
  onDelete: (resume: RecruiterResume) => void;
}

const getCandidateName = (resume: RecruiterResume) => {
  return (
    resume.resumeContent?.parsedResume
      ?.personalInfo?.name ||
    resume.originalName
  );
};

const getCandidateEmail = (resume: RecruiterResume) => {
  return (
    resume.resumeContent?.parsedResume
      ?.personalInfo?.email ||
    "Email unavailable"
  );
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

const statusConfig = {
  uploaded: {
    label: "Uploaded",
    icon: FileText,
    className: "bg-slate-100 text-slate-700",
  },

  processing: {
    label: "Processing",
    icon: Clock3,
    className: "bg-amber-100 text-amber-700",
  },

  processed: {
    label: "Processed",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700",
  },

  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-red-100 text-red-700",
  },
};

const HRResumeRow = ({
  resume,
  processingId,
  onProcess,
  onDelete,
}: HRResumeRowProps) => {
  const navigate = useNavigate();

  const status = statusConfig[resume.status];
  const StatusIcon = status.icon;

  const isProcessing = processingId === resume._id;

  const openDetails = () => {
    navigate(`/hr/resumes/${resume._id}`);
  };

  return (
    <tr className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/70">
      {/* Candidate */}
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={openDetails}
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <FileText size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900 transition hover:text-emerald-700">
              {getCandidateName(resume)}
            </p>

            <p className="truncate text-xs text-slate-500">
              {getCandidateEmail(resume)}
            </p>
          </div>
        </button>
      </td>

      {/* File */}
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={openDetails}
          className="max-w-60 truncate text-left text-sm text-slate-600 transition hover:text-emerald-700"
          title="View resume details"
        >
          {resume.originalName}
        </button>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
        >
          <StatusIcon size={14} />
          {status.label}
        </span>
      </td>

      {/* Date */}
      <td className="px-5 py-4 text-sm text-slate-500">
        {formatDate(resume.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          {/* View */}
          <button
            type="button"
            onClick={openDetails}
            title="View resume"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <FileText size={17} />
          </button>

          {/* Process / Reprocess */}
          <button
            type="button"
            disabled={
              isProcessing ||
              resume.status === "processing"
            }
            onClick={() => onProcess(resume)}
            title={
              resume.status === "processed"
                ? "Reprocess resume"
                : "Process resume"
            }
            className="rounded-lg p-2 text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play size={17} />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(resume)}
            title="Delete resume"
            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default HRResumeRow;
