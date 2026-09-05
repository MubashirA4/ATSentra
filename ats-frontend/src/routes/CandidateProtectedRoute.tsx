import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CandidateProtectedRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream-300 border-t-mint-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Recruiters and admins should use the HR/ATS area
  if (
    user?.role === "recruiter" ||
    user?.role === "admin"
  ) {
    return <Navigate to="/hr/dashboard" replace />;
  }

  return <Outlet />;
};

export default CandidateProtectedRoute;