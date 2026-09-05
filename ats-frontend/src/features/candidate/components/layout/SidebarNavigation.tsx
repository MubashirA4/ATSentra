import {
  BriefcaseBusiness,
  FileSearch,
  FileText,
  History,
  LayoutDashboard,
  Loader2,
  Settings,
  Sparkles,
  Upload,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, type ComponentType } from "react";

import { getResumes } from "@features/candidate/services/resume";

interface NavigationItem {
  label: string;
  path: string;
  icon: ComponentType<{
    className?: string;
  }>;
}

interface SidebarNavigationProps {
  onNavigate: () => void;
}

const mainNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/candidate/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Resumes",
    path: "/candidate/resumes",
    icon: FileText,
  },
  {
    label: "Analyze Resume",
    path: "/candidate/resume/upload",
    icon: Upload,
  },
];

const careerNavigation: NavigationItem[] = [
  {
    label: "Job Matches",
    path: "/candidate/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Match History",
    path: "/candidate/jobs/history",
    icon: History,
  },
  {
    label: "Recommendations",
    path: "/recommendations",
    icon: Sparkles,
  },
];

const SidebarNavigation = ({ onNavigate }: SidebarNavigationProps) => {
  return (
    <nav className="flex-1 overflow-y-auto px-4 py-6">
      <NavigationSection
        title="Overview"
        items={mainNavigation}
        onNavigate={onNavigate}
      />

      <ResumeAnalysisNavItem onNavigate={onNavigate} />

      <NavigationSection
        title="Career"
        items={careerNavigation}
        onNavigate={onNavigate}
      />

      <div className="mt-7">
        <p
          className="
            mb-2
            px-3
            text-[10px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-text-muted
          "
        >
          Account
        </p>

        <NavItem
          item={{
            label: "Settings",
            path: "/settings",
            icon: Settings,
          }}
          onNavigate={onNavigate}
        />
      </div>
    </nav>
  );
};

interface ResumeAnalysisNavItemProps {
  onNavigate: () => void;
}

const ResumeAnalysisNavItem = ({ onNavigate }: ResumeAnalysisNavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const isActive = location.pathname.startsWith("/candidate/resume-analysis/") || location.pathname.startsWith("/resume-analysis/");

  const handleClick = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await getResumes();

      const resumes = response.data.resumes;

      const latestProcessedResume = resumes.find(
        (resume: any) => resume.status === "processed",
      );

      if (!latestProcessedResume) {
        navigate("/candidate/resume/upload");
        return;
      }

      navigate(`/candidate/resume-analysis/${latestProcessedResume._id}`);
    } catch (error) {
      console.error("Failed to load latest resume:", error);
    } finally {
      setLoading(false);
      onNavigate();
    }
  };

  return (
    <div className="mb-7">
      <p
        className="
          mb-2
          px-3
          text-[10px]
          font-bold
          uppercase
          tracking-[0.16em]
          text-text-muted
        "
      >
        Analysis
      </p>

      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`
  group
  flex
  w-full
  items-center
  gap-3
  rounded-md
  border
  px-3
  py-2.5
  text-left
  text-sm
  font-semibold
  transition-all
  duration-200

  ${
    isActive
      ? `
        border-forest-900/10
        bg-forest-900
        text-white
        shadow-sm
      `
      : `
        border-transparent
        text-text-secondary
        hover:border-cream-300
        hover:bg-white
        hover:text-forest-900
      `
  }

  disabled:cursor-not-allowed
  disabled:opacity-60
`}
      >
        {loading ? (
          <Loader2
            className="
              h-[17px]
              w-[17px]
              shrink-0
              animate-spin
              text-mint-500
            "
          />
        ) : (
          <FileSearch
  className={`
    h-[17px]
    w-[17px]
    shrink-0
    transition-transform
    duration-200
    group-hover:scale-105

    ${
      isActive
        ? "text-mint-300"
        : "text-text-muted group-hover:text-forest-700"
    }
  `}
/>
        )}

        <span>{loading ? "Loading analysis..." : "Resume Analysis"}</span>
      </button>
    </div>
  );
};

interface NavigationSectionProps {
  title: string;
  items: NavigationItem[];
  onNavigate: () => void;
}

const NavigationSection = ({
  title,
  items,
  onNavigate,
}: NavigationSectionProps) => {
  return (
    <div className="mb-7">
      <p
        className="
          mb-2
          px-3
          text-[10px]
          font-bold
          uppercase
          tracking-[0.16em]
          text-text-muted
        "
      >
        {title}
      </p>

      <div className="space-y-1">
        {items.map((item) => (
          <NavItem key={item.path} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
};

interface NavItemProps {
  item: NavigationItem;
  onNavigate: () => void;
}

const NavItem = ({ item, onNavigate }: NavItemProps) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/candidate/jobs"}
      onClick={onNavigate}
      className={({ isActive }) => `
        group
        flex
        items-center
        gap-3
        rounded-md
        border
        px-3
        py-2.5
        text-sm
        font-semibold
        transition-all
        duration-200

        ${
          isActive
            ? `
              border-forest-900/10
              bg-forest-900
              text-white
              shadow-sm
            `
            : `
              border-transparent
              text-text-secondary
              hover:border-cream-300
              hover:bg-white
              hover:text-forest-900
            `
        }
      `}
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`
              h-[17px]
              w-[17px]
              shrink-0
              transition-transform
              duration-200
              group-hover:scale-105

              ${
                isActive
                  ? "text-mint-300"
                  : "text-text-muted group-hover:text-forest-700"
              }
            `}
          />

          <span
            className={
              isActive ? "text-white" : ""
            }
          >
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
};

export default SidebarNavigation;
