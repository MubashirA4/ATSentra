import DashboardHeader from "../../components/candidate/dashboard/DashboardHeader";
import DashboardStats from "../../components/candidate/dashboard/DashboardStats";
import LatestAnalysisCard from "../../components/candidate/dashboard/LatestAnalysisCard";
import ATSBreakdownCard from "../../components/candidate/dashboard/ATSBreakdownCard";
import KeywordCoverageCard from "../../components/candidate/dashboard/KeywordCoverageCard";
import RecommendationsCard from "../../components/candidate/dashboard/RecommendationsCard";
import ResumeHealthCard from "../../components/candidate/dashboard/ResumeHealthCard";

import useLatestResumeAnalysis from "../../hooks/useLatestResumeAnalysis";

const Dashboard = () => {
  const { resumes, resume, resumeContent, loading, error } =
    useLatestResumeAnalysis();

  return (
    <div className="mx-auto w-full max-w-350 px-4 py-6 sm:px-6 lg:px-8">
      <DashboardHeader />

      <DashboardStats
        resumes={resumes}
        resume={resume}
        resumeContent={resumeContent}
        loading={loading}
      />

      {error && (
        <div className="mt-4 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <LatestAnalysisCard
          resume={resume}
          resumeContent={resumeContent}
          loading={loading}
        />

        <ATSBreakdownCard resumeContent={resumeContent} loading={loading} />
      </section>

      <section className="mt-6">
        <RecommendationsCard resumeContent={resumeContent} loading={loading} />
      </section>

      <section className="mt-6">
        <KeywordCoverageCard resumeContent={resumeContent} loading={loading} />
      </section>

      <section className="mt-6">
        <ResumeHealthCard resumeContent={resumeContent} loading={loading}/>
      </section>
    </div>
  );
};
export default Dashboard;
