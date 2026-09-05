import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
  Upload,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { getResumes } from "@features/candidate/services/resume";
import {
  matchCandidateResumeToJob,
  type CandidateJobMatchResponse,
} from "@features/candidate/services/jobMatch.service";

interface ResumeOption {
  _id: string;
  originalName: string;
  status: string;
}

const JobMatch = () => {
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loadingResumes, setLoadingResumes] = useState(true);
  const [matching, setMatching] = useState(false);
  const [result, setResult] =
    useState<CandidateJobMatchResponse["data"] | null>(null);

  const loadResumes = async () => {
    try {
      setLoadingResumes(true);

      const response = await getResumes();

      const availableResumes = (response.data?.resumes ?? [])
        .filter((resume: ResumeOption) => resume.status === "processed")
        .map((resume: ResumeOption) => ({
          _id: resume._id,
          originalName: resume.originalName,
          status: resume.status,
        }));

      setResumes(availableResumes);

      if (!selectedResumeId && availableResumes.length > 0) {
        setSelectedResumeId(availableResumes[0]._id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to load your resumes");
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    void loadResumes();
  }, []);

  const selectedResume = useMemo(
    () => resumes.find((resume) => resume._id === selectedResumeId),
    [resumes, selectedResumeId],
  );

  const handleMatch = async () => {
    if (!selectedResumeId) {
      toast.error("Please select a processed resume");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please paste the job description");
      return;
    }

    if (jobDescription.trim().length < 50) {
      toast.error("Please provide a more complete job description");
      return;
    }

    try {
      setMatching(true);
      setResult(null);

      const response = await matchCandidateResumeToJob({
        resumeId: selectedResumeId,
        jobDescription: jobDescription.trim(),
      });

      setResult(response.data);

      toast.success("Job match completed successfully");
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        "Unable to match your resume with this job";

      toast.error(message);
    } finally {
      setMatching(false);
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Career Match
          </div>

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Match Your Resume to a Job
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Select your processed resume, paste a job description, and see
                how well your experience matches the position.
              </p>
            </div>

            {result && (
              <button
                type="button"
                onClick={clearResult}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                New Match
              </button>
            )}
          </div>
        </div>

        {/* Input section */}
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Resume */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Upload className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Select Your Resume
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Choose a processed resume to use for matching.
                </p>
              </div>
            </div>

            {loadingResumes ? (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-200 py-12">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              </div>
            ) : resumes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-amber-500" />

                <p className="mt-3 text-sm font-semibold text-slate-800">
                  No processed resumes found
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Upload and analyze a resume before using Job Match.
                </p>

                <a
                  href="/candidate/resume/upload"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Upload Resume
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedResumeId}
                  onChange={(event) =>
                    setSelectedResumeId(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.originalName}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-slate-400" />

                {selectedResume && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {selectedResume.originalName}
                      </p>
                      <p className="mt-0.5 text-xs text-emerald-700">
                        Resume processed and ready
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Job description */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Job Description
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Paste the complete job description for the position.
                </p>
              </div>
            </div>

            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder={`Paste the job description here...

Example:
Senior MERN Stack Developer
Required Skills:
- JavaScript
- React.js
- Node.js
- MongoDB

Experience:
4+ years...`}
              rows={12}
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400">
                {jobDescription.length.toLocaleString()} characters
              </p>

              <button
                type="button"
                onClick={handleMatch}
                disabled={
                  matching ||
                  loadingResumes ||
                  resumes.length === 0 ||
                  !selectedResumeId
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {matching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Matching...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4" />
                    Match My Resume
                  </>
                )}
              </button>
            </div>
          </section>
        </div>

        {/* Results */}
        {result && <JobMatchResults result={result} />}
      </div>
    </div>
  );
};

interface JobMatchResultsProps {
  result: CandidateJobMatchResponse["data"];
}

const JobMatchResults = ({ result }: JobMatchResultsProps) => {
  const { match, job, recommendations } = result;

  const score = match.score;

  const scoreLabel =
    score >= 80 ? "Strong Match" : score >= 60 ? "Good Match" : "Needs Improvement";

  return (
    <div className="mt-8 space-y-6">
      {/* Score */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
          <div className="flex flex-col items-center justify-center border-b border-slate-200 p-8 text-center lg:border-b-0 lg:border-r">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-emerald-100">
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900">
                  {score}%
                </div>
                <div className="text-xs font-medium text-slate-500">
                  Match Score
                </div>
              </div>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <Sparkles className="h-4 w-4" />
              {scoreLabel}
            </div>
          </div>

          <div className="p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Job Match Result
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {job.title || "Job Position"}
            </h2>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
              {job.company && <span>{job.company}</span>}
              {job.location && <span>{job.location}</span>}
              {job.employmentType && <span>{job.employmentType}</span>}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <ScoreMetric
                label="Required Skills"
                score={match.skills.requiredMatchPercentage}
                weight={match.breakdown.requiredSkills.weight}
              />

              <ScoreMetric
                label="Preferred Skills"
                score={match.skills.preferredMatchPercentage}
                weight={match.breakdown.preferredSkills.weight}
              />

              <ScoreMetric
                label="Experience"
                score={match.experience.score}
                weight={match.breakdown.experience.weight}
              />

              <ScoreMetric
                label="Education"
                score={match.education.score}
                weight={match.breakdown.education.weight}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SkillList
          title="Matched Required Skills"
          skills={match.skills.matchedRequiredSkills}
          positive
        />

        <SkillList
          title="Missing Required Skills"
          skills={match.skills.missingRequiredSkills}
          positive={false}
        />

        <SkillList
          title="Matched Preferred Skills"
          skills={match.skills.matchedPreferredSkills}
          positive
        />

        <SkillList
          title="Missing Preferred Skills"
          skills={match.skills.missingPreferredSkills}
          positive={false}
        />
      </div>

      {/* Experience + Education */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            title="Experience"
          />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <InfoBox
              label="Your Experience"
              value={`${match.experience.candidateYears} years`}
            />

            <InfoBox
              label="Required"
              value={
                match.experience.requiredYears === null
                  ? "Not specified"
                  : `${match.experience.requiredYears}+ years`
              }
            />
          </div>

          <div
            className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
              match.experience.matched
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {match.experience.matched ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}

            {match.experience.matched
              ? "Your experience meets the requirement."
              : "Your current experience does not meet the requirement."}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeading
            icon={<GraduationCap className="h-5 w-5" />}
            title="Education"
          />

          <div className="mt-6">
            {match.education.matchedRequirements.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Detected
                </p>

                <div className="mt-3 space-y-2">
                  {match.education.matchedRequirements.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {match.education.missingRequirements.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Not Detected
                </p>

                <div className="mt-3 space-y-2">
                  {match.education.missingRequirements.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {match.education.matchedRequirements.length === 0 &&
              match.education.missingRequirements.length === 0 && (
                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  No specific education requirements were detected.
                </div>
              )}
          </div>
        </section>
      </div>

      {/* Recommendations */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeading
          icon={<Award className="h-5 w-5" />}
          title="CV Improvement Recommendations"
          description="Suggestions based on the gaps detected between your resume and this job."
        />

        {recommendations.length === 0 ? (
          <div className="mt-6 rounded-xl bg-emerald-50 p-5 text-sm font-medium text-emerald-800">
            Great job! No major improvements were identified for this position.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {recommendations.map((recommendation, index) => (
              <RecommendationItem
                key={`${recommendation.type}-${index}`}
                recommendation={recommendation}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

interface ScoreMetricProps {
  label: string;
  score: number;
  weight: number;
}

const ScoreMetric = ({ label, score, weight }: ScoreMetricProps) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className="text-sm font-bold text-slate-900">{score}%</span>
    </div>

    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-emerald-600 transition-all"
        style={{ width: `${Math.min(score, 100)}%` }}
      />
    </div>

    <p className="mt-2 text-[11px] text-slate-400">
      Weight: {weight}%
    </p>
  </div>
);

interface SkillListProps {
  title: string;
  skills: string[];
  positive: boolean;
}

const SkillList = ({ title, skills, positive }: SkillListProps) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <h3 className="font-semibold text-slate-900">{title}</h3>

      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
        {skills.length}
      </span>
    </div>

    {skills.length === 0 ? (
      <p className="mt-5 text-sm text-slate-400">
        No skills in this category.
      </p>
    ) : (
      <div className="mt-5 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
              positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {positive ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            {skill}
          </span>
        ))}
      </div>
    )}
  </section>
);

interface SectionHeadingProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

const SectionHeading = ({
  icon,
  title,
  description,
}: SectionHeadingProps) => (
  <div className="flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
      {icon}
    </div>

    <div>
      <h2 className="font-semibold text-slate-900">{title}</h2>

      {description && (
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      )}
    </div>
  </div>
);

interface InfoBoxProps {
  label: string;
  value: string;
}

const InfoBox = ({ label, value }: InfoBoxProps) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
  </div>
);

interface RecommendationItemProps {
  recommendation: CandidateJobMatchResponse["data"]["recommendations"][number];
}

const RecommendationItem = ({
  recommendation,
}: RecommendationItemProps) => {
  const isHigh = recommendation.priority === "high";

  return (
    <div className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isHigh
            ? "bg-amber-100 text-amber-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {isHigh ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">
            {recommendation.title}
          </h3>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
              isHigh
                ? "bg-amber-100 text-amber-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {recommendation.priority}
          </span>
        </div>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {recommendation.message}
        </p>
      </div>
    </div>
  );
};

export default JobMatch;
