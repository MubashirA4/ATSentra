import { Navigate } from "react-router-dom";
import { useAuth } from "@store/auth/AuthContext";

const RoleRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream-300 border-t-mint-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    user?.role === "recruiter" ||
    user?.role === "admin"
  ) {
    return <Navigate to="/hr/dashboard" replace />;
  }

  return <Navigate to="/candidate/dashboard" replace />;
};

export default RoleRedirect;
