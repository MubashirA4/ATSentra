import {
  Badge,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResumes, deleteResume } from "@features/candidate/services/resume";
import Card from "@shared/components/ui/Card";
import type { Resume } from "@types/resume";

const Resumes = () => {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getResumes();

      setResumes(response.data.resumes ?? []);
    } catch (error) {
      console.error("Failed to load resumes:", error);

      setError("Unable to load your resumes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial mount fetch is intentional here; the rule is suppressed because
    // the server response is the source of truth for this list state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResumes();
  }, [fetchResumes]);

  const handleDelete = async (resume: Resume) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resume.originalName || resume.fileName}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(resume._id);
      setError(null);

      await deleteResume(resume._id);

      setResumes((currentResumes) =>
        currentResumes.filter(
          (currentResume) => currentResume._id !== resume._id,
        ),
      );
    } catch (error) {
      console.error("Failed to delete resume:", error);

      setError("Unable to delete the resume. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: Resume["status"]) => {
    switch (status) {
      case "processed":
        return (
          <Badge>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3" />
              Processed
            </span>
          </Badge>
        );

      case "processing":
        return (
          <Badge>
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin" />
              Processing
            </span>
          </Badge>
        );

      case "uploaded":
        return (
          <Badge>
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3 w-3" />
              Uploaded
            </span>
          </Badge>
        );

      case "failed":
        return (
          <Badge>
            <span className="flex items-center gap-1.5">
              <XCircle className="h-3 w-3" />
              Failed
            </span>
          </Badge>
        );

      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${Math.round(kb)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
            Resume library
          </p>

          <h1 className="mt-2 font-display text-2xl font-bold text-text-primary">
            My Resumes
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            Manage your uploaded resumes, review their processing status, and
            open your latest analysis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/candidate/resume/upload")}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-md
            bg-forest-900
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition-all
            duration-200
            hover:bg-forest-800
            hover:shadow-md
          "
        >
          <Upload className="h-4 w-4" />
          Upload Resume
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3">
          <p className="text-sm text-danger">{error}</p>

          <button
            type="button"
            onClick={fetchResumes}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-danger transition-colors hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="p-5 sm:p-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-lg bg-cream-200" />

                  <div className="flex-1">
                    <div className="h-4 w-48 rounded bg-cream-200" />
                    <div className="mt-2 h-3 w-32 rounded bg-cream-200" />
                  </div>

                  <div className="h-6 w-20 rounded-full bg-cream-200" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && resumes.length === 0 && (
        <Card className="mt-6 flex items-center justify-center p-8 text-center">
          <div className="max-w-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-mint-100 text-forest-800">
              <FileText className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-text-primary">
              No resumes yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Upload your first resume to start analyzing its ATS compatibility
              and resume quality.
            </p>

            <button
              type="button"
              onClick={() => navigate("/candidate/resume/upload")}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-md
                bg-forest-900
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition-colors
                hover:bg-forest-800
              "
            >
              <Upload className="h-4 w-4" />
              Upload Resume
            </button>
          </div>
        </Card>
      )}

      {/* Resume list */}
      {!loading && resumes.length > 0 && (
        <div className="mt-6 space-y-4">
          {resumes.map((resume) => (
            <Card
              key={resume._id}
              className="p-5 transition-shadow duration-200 hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Resume information */}
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-mint-100 text-forest-800">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-text-primary">
                      {resume.originalName || resume.fileName}
                    </h2>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
                      <span>{formatFileSize(resume.fileSize)}</span>

                      <span className="h-1 w-1 rounded-full bg-text-muted" />

                      <span>Uploaded {formatDate(resume.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Status + actions */}
                <div className="flex items-center justify-between gap-4 lg:justify-end">
                  {getStatusBadge(resume.status)}

                  <div className="flex items-center gap-2">
                    {resume.status === "processed" && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/candidate/resume-analysis/${resume._id}`)
                        }
                        className="
                          rounded-md
                          border
                          border-border-subtle
                          bg-white
                          px-3
                          py-2
                          text-xs
                          font-semibold
                          text-forest-800
                          transition-colors
                          hover:border-forest-900/20
                          hover:bg-mint-50
                        "
                      >
                        View Analysis
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(resume)}
                      disabled={deletingId === resume._id}
                      className="
    flex
    h-9
    w-9
    items-center
    justify-center
    rounded-md
    text-text-muted
    transition-colors
    hover:bg-danger/5
    hover:text-danger
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
                      aria-label={`Delete ${resume.originalName || resume.fileName}`}
                    >
                      {deletingId === resume._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resumes;
