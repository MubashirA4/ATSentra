import { BrowserRouter, Route, Routes } from "react-router-dom";

import CandidateProtectedRoute from "@app/routes/CandidateProtectedRoute";
import HRProtectedRoute from "@app/routes/HRProtectedRoute";
import PublicRoute from "@app/routes/PublicRoute";
import RoleRedirect from "@app/routes/RoleRedirect";

// Layouts
import CandidateLayout from "@layouts/CandidateLayout";
import RecruiterLayout from "@layouts/RecruiterLayout";

// Auth pages
import Login from "@features/auth/pages/Login";
import Signup from "@features/auth/pages/Signup";

// Candidate pages
import CandidateDashboard from "@features/candidate/pages/Dashboard";
import ResumeUpload from "@features/candidate/pages/ResumeUpload";
import ResumeAnalysis from "@features/candidate/pages/ResumeAnalysis";
import Resumes from "@features/candidate/components/resumes/Resumes";
import JobMatch from "@features/candidate/pages/JobMatch";
import JobMatchHistory from "@features/candidate/pages/JobMatchHistory";
import JobMatchHistoryDetail from "@features/candidate/pages/JobMatchHistoryDetail";

// Recruiter pages
import HRDashboard from "@features/recruiter/pages/HRDashboard";
import HRJobs from "@features/recruiter/pages/HRJobs";
import HRJobDetails from "@features/recruiter/pages/HRJobDetails";
import HRCreateJob from "@features/recruiter/pages/HRCreateJob";
import HREditJob from "@features/recruiter/pages/HREditJob";
import HRATSAnalysis from "@features/recruiter/pages/HRATSAnalysis";
import HRATSAnalysisHistory from "@features/recruiter/pages/HRATSAnalysisHistory";
import HRATSAnalysisHistoryDetails from "@features/recruiter/pages/HRATSAnalysisHistoryDetails";
import HRCandidateDetails from "@features/recruiter/pages/HRCandidateDetails";
import HRCandidates from "@features/recruiter/pages/HRCandidates";
import HRResumes from "@features/recruiter/pages/HRResumes";
import HRResumeDetails from "@features/recruiter/pages/HRResumeDetails";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================= */}
        {/* PUBLIC ROUTES             */}
        {/* ========================= */}

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* ========================= */}
        {/* CANDIDATE ROUTES          */}
        {/* ========================= */}

        <Route element={<CandidateProtectedRoute />}>
          <Route element={<CandidateLayout />}>
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/resumes" element={<Resumes />} />
            <Route path="/candidate/resume/upload" element={<ResumeUpload />} />
            <Route path="/candidate/resume-analysis/:resumeId" element={<ResumeAnalysis />} />
            <Route path="/candidate/jobs" element={<JobMatch />} />
            <Route path="/candidate/jobs/history" element={<JobMatchHistory />} />
            <Route path="/candidate/jobs/history/:matchId" element={<JobMatchHistoryDetail />} />
          </Route>
        </Route>

        {/* ========================= */}
        {/* HR / RECRUITER ROUTES     */}
        {/* ========================= */}

        <Route element={<HRProtectedRoute />}>
          <Route element={<RecruiterLayout />}>
            <Route path="/hr/dashboard" element={<HRDashboard />} />

            <Route path="/hr/jobs" element={<HRJobs />} />
            <Route path="/hr/jobs/new" element={<HRCreateJob />} />
            <Route path="/hr/jobs/:jobId/edit" element={<HREditJob />} />
            <Route path="/hr/jobs/:jobId" element={<HRJobDetails />} />

            <Route path="/hr/resumes" element={<HRResumes />} />
            <Route path="/hr/resumes/:resumeId" element={<HRResumeDetails />} />

            <Route path="/hr/analysis" element={<HRATSAnalysis />} />
            <Route path="/hr/analysis/history" element={<HRATSAnalysisHistory />} />
            <Route path="/hr/analysis/history/:runId" element={<HRATSAnalysisHistoryDetails />} />

            <Route path="/hr/candidates" element={<HRCandidates />} />
            <Route path="/hr/candidates/:candidateId" element={<HRCandidateDetails />} />
          </Route>
        </Route>

        {/* ========================= */}
        {/* ROLE-AWARE FALLBACK       */}
        {/* ========================= */}

        <Route path="*" element={<RoleRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
