import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@store/auth/AuthContext";

const SidebarUser = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const userName = user?.name ?? "Candidate";
  const userEmail = user?.email ?? "";

  const initials = userName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="border-t border-cream-300 p-4">
      <div
        className="
          flex
          items-center
          gap-3
          rounded-lg
          border
          border-cream-300
          bg-white
          p-3
          transition-colors
          duration-200
          hover:border-cream-400
          hover:bg-cream-50
        "
      >
        {/* Avatar */}
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-forest-900
            text-xs
            font-bold
            tracking-wide
            text-white
          "
        >
          {initials || "CA"}
        </div>

        {/* User Information */}
        <div className="min-w-0 flex-1">
          <p
            className="
              truncate
              text-sm
              font-semibold
              text-text-primary
            "
          >
            {userName}
          </p>

          <p
            className="
              mt-0.5
              truncate
              text-xs
              text-text-muted
            "
            title={userEmail}
          >
            {userEmail}
          </p>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />

            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                text-text-muted
              "
            >
              Candidate
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-md
            text-text-muted
            transition-all
            duration-200
            hover:bg-red-50
            hover:text-red-600
            focus:outline-none
            focus:ring-2
            focus:ring-red-200
          "
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SidebarUser;
