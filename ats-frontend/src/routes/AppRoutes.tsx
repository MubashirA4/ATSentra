import { BrowserRouter, Route, Routes } from "react-router-dom";

import CandidateProtectedRoute from "./CandidateProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import CandidateDashboard from "../pages/candidate/Dashboard";
import ResumeUpload from "../pages/candidate/ResumeUpload";
import ResumeAnalysis from "../pages/candidate/ResumeAnalysis";
import Resumes from "../components/candidate/resumes/Resumes";
import JobMatch from "../pages/candidate/JobMatch";
import JobMatchHistory from "../pages/candidate/JobMatchHistory";
import JobMatchHistoryDetail from "../pages/candidate/JobMatchHistoryDetail";

import HRProtectedRoute from "./HRProtectedRoute";
import HRDashboard from "../pages/hr/HRDashboard";
import HRDashboardLayout from "../layouts/HRDashboardLayout";
import HRJobs from "../pages/hr/HRJobs";
import HRJobDetails from "../pages/hr/HRJobDetails";
import HRCreateJob from "../pages/hr/HRCreateJob";
import HREditJob from "../pages/hr/HREditJob";

import HRATSAnalysis from "../pages/hr/HRATSAnalysis";
import HRATSAnalysisHistory from "../pages/hr/HRATSAnalysisHistory";
import HRATSAnalysisHistoryDetails from "../pages/hr/HRATSAnalysisHistoryDetails";
import HRCandidateDetails from "../pages/hr/HRCandidateDetails";
import HRCandidates from "../pages/hr/HRCandidates";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import PublicRoute from "./PublicRoute";
import RoleRedirect from "./RoleRedirect";
import HRResumes from "../pages/hr/HRResumes";
import HRResumeDetails from "../pages/hr/HRResumeDetails";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================= */}
        {/* PUBLIC ROUTES */}
        {/* ========================= */}

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* ========================= */}
        {/* CANDIDATE ROUTES */}
        {/* ========================= */}

        <Route element={<CandidateProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<CandidateDashboard />} />

            <Route path="/resumes" element={<Resumes />} />

            <Route path="/resume/upload" element={<ResumeUpload />} />
            <Route path="/jobs" element={<JobMatch />} />
            <Route path="/jobs/history" element={<JobMatchHistory />} />
            <Route
              path="/jobs/history/:matchId"
              element={<JobMatchHistoryDetail />}
            />
            <Route
              path="/resume-analysis/:resumeId"
              element={<ResumeAnalysis />}
            />
          </Route>
        </Route>

        {/* ========================= */}
        {/* HR / RECRUITER ROUTES */}
        {/* ========================= */}

        <Route element={<HRProtectedRoute />}>
          <Route element={<HRDashboardLayout />}>
            <Route path="/hr/dashboard" element={<HRDashboard />} />

            <Route path="/hr/jobs" element={<HRJobs />} />
            <Route path="/hr/jobs/new" element={<HRCreateJob />} />

            <Route path="/hr/jobs/:jobId/edit" element={<HREditJob />} />
            <Route path="/hr/jobs/:jobId" element={<HRJobDetails />} />

            <Route path="/hr/resumes" element={<HRResumes />} />
            <Route path="/hr/resumes/:resumeId" element={<HRResumeDetails />} />

            <Route path="/hr/analysis" element={<HRATSAnalysis />} />
            <Route path="/hr/candidates" element={<HRCandidates />} />
            <Route
              path="/hr/candidates/:candidateId"
              element={<HRCandidateDetails />}
            />
            <Route
              path="/hr/analysis/history"
              element={<HRATSAnalysisHistory />}
            />

            <Route
              path="/hr/analysis/history/:runId"
              element={<HRATSAnalysisHistoryDetails />}
            />
          </Route>
        </Route>

        {/* ========================= */}
        {/* ROLE-AWARE FALLBACK */}
        {/* ========================= */}

        <Route path="*" element={<RoleRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
