import { useEffect, useState } from "react";
import { BriefcaseBusiness, Check, Save } from "lucide-react";

import type { ATSJob } from "@types/job";

import {
  parseJobDescription,
  type CreateJobPayload,
  type UpdateJobPayload,
} from "@features/recruiter/services/job.service";

interface HRJobFormProps {
  initialJob?: ATSJob;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (
    data: CreateJobPayload | UpdateJobPayload,
  ) => Promise<void>;
}

const HRJobForm = ({
  initialJob,
  loading = false,
  submitLabel = "Create Job",
  onSubmit,
}: HRJobFormProps) => {
  const isEditMode = Boolean(initialJob);

  // Create mode
  const [jobDescriptionInput, setJobDescriptionInput] =
    useState("");

  // Shared / Edit mode fields
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  const [requiredSkills, setRequiredSkills] = useState("");
  const [preferredSkills, setPreferredSkills] = useState("");

  const [minYears, setMinYears] = useState("");
  const [maxYears, setMaxYears] = useState("");

  const [educationRequirements, setEducationRequirements] =
    useState("");

  const [responsibilities, setResponsibilities] = useState("");

  const [description, setDescription] = useState("");

  // Job status
  const [status, setStatus] =
    useState<ATSJob["status"]>("draft");

  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");

  /*
   * Populate edit form from existing job.
   */
  useEffect(() => {
    if (!initialJob) {
      return;
    }

    setTitle(initialJob.title ?? "");
    setCompany(initialJob.company ?? "");
    setLocation(initialJob.location ?? "");
    setEmploymentType(initialJob.employmentType ?? "");

    setRequiredSkills(
      initialJob.requiredSkills?.join(", ") ?? "",
    );

    setPreferredSkills(
      initialJob.preferredSkills?.join(", ") ?? "",
    );

    setMinYears(
      initialJob.experienceRequirement?.minYears !== null &&
        initialJob.experienceRequirement?.minYears !== undefined
        ? String(initialJob.experienceRequirement.minYears)
        : "",
    );

    setMaxYears(
      initialJob.experienceRequirement?.maxYears !== null &&
        initialJob.experienceRequirement?.maxYears !== undefined
        ? String(initialJob.experienceRequirement.maxYears)
        : "",
    );

    setEducationRequirements(
      initialJob.educationRequirements?.join("\n") ?? "",
    );

    setResponsibilities(
      initialJob.responsibilities?.join("\n") ?? "",
    );

    setDescription(initialJob.description ?? "");

    setStatus(initialJob.status ?? "draft");
  }, [initialJob]);

  const parseCommaSeparated = (value: string) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const parseLineSeparated = (value: string) => {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  /*
   * CREATE MODE
   *
   * JD → Parse → Create
   */
  const handleCreate = async () => {
    const input = jobDescriptionInput.trim();

    if (!input) {
      setError("Please paste a job description first.");
      return;
    }

    try {
      setParsing(true);
      setError("");

      const result = await parseJobDescription(input);
      const parsedJob = result.data.job;

      const payload: CreateJobPayload = {
        title:
          parsedJob.jobTitle?.trim() || "Untitled Job",

        company:
          parsedJob.company?.trim() || "Unknown Company",

        location:
          parsedJob.location?.trim() || null,

        employmentType:
          parsedJob.employmentType?.trim() || null,

        description: input,

        // Use selected status instead of always forcing draft
        status,

        requiredSkills:
          parsedJob.requiredSkills ?? [],

        preferredSkills:
          parsedJob.preferredSkills ?? [],

        educationRequirements:
          parsedJob.educationRequirements ?? [],

        responsibilities:
          parsedJob.responsibilities ?? [],

        experienceRequirement:
          parsedJob.experienceRequirement?.minYears !== null ||
          parsedJob.experienceRequirement?.maxYears !== null
            ? {
                minYears:
                  parsedJob.experienceRequirement?.minYears ??
                  null,

                maxYears:
                  parsedJob.experienceRequirement?.maxYears ??
                  null,
              }
            : null,
      };

      await onSubmit(payload);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to parse the job description.",
      );
    } finally {
      setParsing(false);
    }
  };

  /*
   * EDIT MODE
   *
   * Structured fields → Update
   */
  const handleUpdate = async () => {
    if (!title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!company.trim()) {
      setError("Company is required.");
      return;
    }

    const parsedMinYears =
      minYears.trim() === ""
        ? null
        : Number(minYears);

    const parsedMaxYears =
      maxYears.trim() === ""
        ? null
        : Number(maxYears);

    if (
      parsedMinYears !== null &&
      Number.isNaN(parsedMinYears)
    ) {
      setError(
        "Minimum experience must be a valid number.",
      );
      return;
    }

    if (
      parsedMaxYears !== null &&
      Number.isNaN(parsedMaxYears)
    ) {
      setError(
        "Maximum experience must be a valid number.",
      );
      return;
    }

    if (
      parsedMinYears !== null &&
      parsedMaxYears !== null &&
      parsedMinYears > parsedMaxYears
    ) {
      setError(
        "Minimum experience cannot be greater than maximum experience.",
      );
      return;
    }

    try {
      setError("");

      const payload: UpdateJobPayload = {
        title: title.trim(),

        company: company.trim(),

        location:
          location.trim() || null,

        employmentType:
          employmentType.trim() || null,

        requiredSkills:
          parseCommaSeparated(requiredSkills),

        preferredSkills:
          parseCommaSeparated(preferredSkills),

        experienceRequirement:
          parsedMinYears !== null ||
          parsedMaxYears !== null
            ? {
                minYears: parsedMinYears,
                maxYears: parsedMaxYears,
              }
            : null,

        educationRequirements:
          parseLineSeparated(
            educationRequirements,
          ),

        responsibilities:
          parseLineSeparated(
            responsibilities,
          ),

        description:
          description.trim() || null,

        status,
      };

      await onSubmit(payload);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update job.",
      );
    }
  };

  const isProcessing = parsing || loading;

  /*
   * CREATE VIEW
   */
  if (!isEditMode) {
    return (
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint-500/10 text-mint-700">
              <BriefcaseBusiness size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-forest-950">
                Create Job from Job Description
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Paste the complete job description below.
                ATSentra will automatically extract the job
                details, skills, experience, education, and
                responsibilities.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="job-description"
              className="text-sm font-semibold text-forest-950"
            >
              Job Description
            </label>

            <textarea
              id="job-description"
              value={jobDescriptionInput}
              onChange={(event) => {
                setJobDescriptionInput(
                  event.target.value,
                );

                if (error) {
                  setError("");
                }
              }}
              disabled={isProcessing}
              rows={18}
              placeholder={`Paste the complete job description here...

Example:

Senior MERN Stack Developer
Systems Limited
Karachi, Pakistan

We are looking for a Senior MERN Stack Developer...

Requirements:
- 4+ years of experience
- React
- Node.js
- MongoDB
- Express.js

Responsibilities:
- Build scalable web applications...
- Collaborate with engineering teams...`}
              className="mt-2 w-full resize-y rounded-xl border border-forest-900/10 bg-white px-4 py-4 text-sm leading-6 text-forest-950 outline-none transition placeholder:text-text-secondary/60 focus:border-mint-400 focus:ring-2 focus:ring-mint-400/15 disabled:cursor-not-allowed disabled:bg-forest-50"
            />

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-text-secondary">
                ATSentra will extract the structured job
                information automatically.
              </p>

              <span className="text-xs text-text-secondary">
                {jobDescriptionInput.length} characters
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="mt-6">
            <label
              htmlFor="create-job-status"
              className="text-sm font-semibold text-forest-950"
            >
              Job Status
            </label>

            <p className="mt-1 text-xs text-text-secondary">
              Choose the status for this job when it is
              created.
            </p>

            <select
              id="create-job-status"
              value={status}
              onChange={(event) => {
                setStatus(
                  event.target.value as ATSJob["status"],
                );

                if (error) {
                  setError("");
                }
              }}
              disabled={isProcessing}
              className="mt-2 h-11 w-full rounded-xl border border-forest-900/10 bg-white px-4 text-sm font-medium text-forest-950 outline-none transition focus:border-mint-400 focus:ring-2 focus:ring-mint-400/15"
            >
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleCreate}
              disabled={
                isProcessing ||
                !jobDescriptionInput.trim()
              }
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-forest-950 px-6 text-sm font-semibold text-white transition hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? (
                "Parsing & Creating..."
              ) : (
                <>
                  <Check size={17} />
                  {submitLabel}
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    );
  }

  /*
   * EDIT VIEW
   */
  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint-500/10 text-mint-700">
            <BriefcaseBusiness size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-forest-950">
              Job Details
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Update the existing job information.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field
            label="Job Title"
            value={title}
            onChange={setTitle}
          />

          <Field
            label="Company"
            value={company}
            onChange={setCompany}
          />

          <Field
            label="Location"
            value={location}
            onChange={setLocation}
          />

          <Field
            label="Employment Type"
            value={employmentType}
            onChange={setEmploymentType}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-forest-950">
          Skills
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Separate skills with commas.
        </p>

        <div className="mt-5 space-y-5">
          <TextAreaField
            label="Required Skills"
            value={requiredSkills}
            onChange={setRequiredSkills}
            rows={4}
          />

          <TextAreaField
            label="Preferred Skills"
            value={preferredSkills}
            onChange={setPreferredSkills}
            rows={4}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-forest-950">
          Experience & Education
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field
            label="Minimum Experience (Years)"
            type="number"
            min="0"
            value={minYears}
            onChange={setMinYears}
          />

          <Field
            label="Maximum Experience (Years)"
            type="number"
            min="0"
            value={maxYears}
            onChange={setMaxYears}
          />
        </div>

        <div className="mt-5">
          <TextAreaField
            label="Education Requirements"
            value={educationRequirements}
            onChange={setEducationRequirements}
            rows={5}
            hint="One requirement per line."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-forest-950">
          Responsibilities
        </h2>

        <div className="mt-5">
          <TextAreaField
            label="Responsibilities"
            value={responsibilities}
            onChange={setResponsibilities}
            rows={8}
            hint="One responsibility per line."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-forest-950">
          Job Description
        </h2>

        <div className="mt-5">
          <TextAreaField
            label="Original Job Description"
            value={description}
            onChange={setDescription}
            rows={12}
          />
        </div>
      </section>

      {/* Status */}
      <section className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-forest-950">
              Job Status
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Control whether this job is a draft, open,
              closed, or archived.
            </p>
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as ATSJob["status"],
              )
            }
            disabled={isProcessing}
            className="h-11 rounded-xl border border-forest-900/10 bg-white px-4 text-sm font-semibold text-forest-950 outline-none focus:border-mint-400 focus:ring-2 focus:ring-mint-400/15"
          >
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleUpdate}
          disabled={isProcessing}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-forest-950 px-6 text-sm font-semibold text-white transition hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Save size={17} />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
}

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  min,
}: FieldProps) => {
  return (
    <div>
      <label className="text-sm font-semibold text-forest-950">
        {label}
      </label>

      <input
        type={type}
        min={min}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-11 w-full rounded-xl border border-forest-900/10 bg-white px-4 text-sm text-forest-950 outline-none transition focus:border-mint-400 focus:ring-2 focus:ring-mint-400/15"
      />
    </div>
  );
};

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}

const TextAreaField = ({
  label,
  value,
  onChange,
  rows = 5,
  hint,
}: TextAreaFieldProps) => {
  return (
    <div>
      <label className="text-sm font-semibold text-forest-950">
        {label}
      </label>

      {hint && (
        <p className="mt-1 text-xs text-text-secondary">
          {hint}
        </p>
      )}

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={rows}
        className="mt-2 w-full resize-y rounded-xl border border-forest-900/10 bg-white px-4 py-3 text-sm leading-6 text-forest-950 outline-none transition focus:border-mint-400 focus:ring-2 focus:ring-mint-400/15"
      />
    </div>
  );
};

export default HRJobForm;
