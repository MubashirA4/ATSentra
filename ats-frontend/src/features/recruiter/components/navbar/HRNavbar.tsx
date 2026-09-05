import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import HRNavbarSearch from "./HRNavbarSearch";
import HRNavbarNotifications from "./HRNavbarNotifications";
import HRNavbarProfile from "./HRNavbarProfile";

interface HRNavbarProps {
  onMenuClick: () => void;
}

const HRNavbar = ({
  onMenuClick,
}: HRNavbarProps) => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/hr/dashboard") {
      return "Hiring Dashboard";
    }

    if (location.pathname.startsWith("/hr/jobs")) {
      return "Jobs";
    }

    if (
      location.pathname.startsWith("/hr/candidates")
    ) {
      return "Candidates";
    }

    if (
      location.pathname.startsWith("/hr/analysis")
    ) {
      return "ATS Analysis";
    }

    if (
      location.pathname.startsWith("/hr/analytics")
    ) {
      return "Analytics";
    }

    if (
      location.pathname.startsWith("/hr/settings")
    ) {
      return "Settings";
    }

    return "ATSentra";
  };

  return (
    <header
      className="
        sticky
        top-0
        z-30
        border-b
        border-cream-300
        bg-cream-50/95
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          h-[76px]
          items-center
          justify-between
          gap-4
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* Left */}
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="
              rounded-lg
              border
              border-cream-300
              bg-cream-50
              p-2
              text-text-secondary
              transition
              hover:bg-cream-100
              hover:text-forest-900
              active:scale-95
              lg:hidden
            "
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p
              className="
                hidden
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-mint-500
                sm:block
              "
            >
              Recruiter Workspace
            </p>

            <h1
              className="
                truncate
                font-display
                text-xl
                text-forest-950
                sm:text-2xl
              "
            >
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <HRNavbarSearch />

          <HRNavbarNotifications />

          <HRNavbarProfile />
        </div>
      </div>
    </header>
  );
};

export default HRNavbar;
