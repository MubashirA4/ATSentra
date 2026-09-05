import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import {
  deleteRecruiterResume,
  getRecruiterResumes,
  processRecruiterResume,
  uploadRecruiterResume,
} from "../../services/resume/recruiterResumeApi";

import type {
  RecruiterResume,
  ResumeStatus,
} from "../../types/recruiterResume";

import HRResumesHeader from "../../components/hr/resumes/HRResumesHeader";
import HRResumesStats from "../../components/hr/resumes/HRResumesStats";
import HRResumesFilters from "../../components/hr/resumes/HRResumesFilters";
import HRResumeUpload from "../../components/hr/resumes/HRResumeUpload";
import HRResumesTable from "../../components/hr/resumes/HRResumesTable";
import HRResumesStates from "../../components/hr/resumes/HRResumesStates";
import HRResumesSkeleton from "../../components/hr/resumes/HRResumesSkeleton";

const HRResumes = () => {
  const [resumes, setResumes] =
    useState<RecruiterResume[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string>("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<ResumeStatus | "all">("all");

  const [uploadOpen, setUploadOpen] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getRecruiterResumes();

      setResumes(data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load recruiter resumes.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadResumes();
  }, []);

  const filteredResumes = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return resumes.filter((resume) => {
      const personalInfo =
        resume.resumeContent
          ?.parsedResume?.personalInfo;

      const candidateName =
        personalInfo?.name?.toLowerCase() ||
        "";

      const candidateEmail =
        personalInfo?.email?.toLowerCase() ||
        "";

      const fileName =
        resume.originalName.toLowerCase();

      const matchesSearch =
        !query ||
        candidateName.includes(query) ||
        candidateEmail.includes(query) ||
        fileName.includes(query);

      const matchesStatus =
        status === "all" ||
        resume.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [resumes, search, status]);

  const handleUpload = async (
    file: File,
  ) => {
    try {
      setUploading(true);

      const resume =
        await uploadRecruiterResume(file);

      setResumes((current) => [
        resume,
        ...current,
      ]);

      setUploadOpen(false);

      toast.success(
        "Candidate resume uploaded successfully.",
      );
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to upload candidate resume.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleProcess = async (
    resume: RecruiterResume,
  ) => {
    try {
      setProcessingId(resume._id);

      setResumes((current) =>
        current.map((item) =>
          item._id === resume._id
            ? {
                ...item,
                status: "processing",
              }
            : item,
        ),
      );

      const result =
        await processRecruiterResume(
          resume._id,
        );

      setResumes((current) =>
        current.map((item) =>
          item._id === resume._id
            ? {
                ...item,
                ...result.resume,
                resumeContent:
                  result.resumeContent ||
                  item.resumeContent,
              }
            : item,
        ),
      );

      toast.success(
        "Resume processed successfully.",
      );
    } catch (err) {
      console.error(err);

      setResumes((current) =>
        current.map((item) =>
          item._id === resume._id
            ? {
                ...item,
                status: "failed",
              }
            : item,
        ),
      );

      toast.error(
        "Failed to process resume.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (
    resume: RecruiterResume,
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${resume.originalName}"? This action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteRecruiterResume(
        resume._id,
      );

      setResumes((current) =>
        current.filter(
          (item) =>
            item._id !== resume._id,
        ),
      );

      toast.success(
        "Resume deleted successfully.",
      );
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to delete resume.",
      );
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
  };

  return (
    <div className="space-y-6">
      <HRResumesHeader
        onUpload={() =>
          setUploadOpen(true)
        }
      />

      {!loading && (
        <HRResumesStats
          resumes={resumes}
        />
      )}

      <HRResumesFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onClear={clearFilters}
      />

      {loading ? (
        <HRResumesSkeleton />
      ) : error ? (
        <HRResumesStates
          type="error"
          message={error}
        />
      ) : filteredResumes.length === 0 ? (
        <HRResumesStates
          type="empty"
          message={
            resumes.length === 0
              ? undefined
              : "No resumes match your current search or status filter."
          }
        />
      ) : (
        <HRResumesTable
          resumes={filteredResumes}
          processingId={processingId}
          onProcess={handleProcess}
          onDelete={handleDelete}
        />
      )}

      <HRResumeUpload
        open={uploadOpen}
        loading={uploading}
        onClose={() =>
          setUploadOpen(false)
        }
        onUpload={handleUpload}
      />
    </div>
  );
};

export default HRResumes;