import {
  BrainCircuit,
  BriefcaseBusiness,
  ChevronUp,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "@store/auth/AuthContext";

interface HRSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  badge?: string | number;
}

interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

const navigationSections: NavigationSection[] = [
  {
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        path: "/hr/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    label: "Recruitment",
    items: [
      {
        label: "Jobs",
        path: "/hr/jobs",
        icon: BriefcaseBusiness,
      },
      {
        label: "Candidates",
        path: "/hr/candidates",
        icon: Users,
      },
      {
        label: "Candidate Resumes",
        path: "/hr/resumes",
        icon: FileText,
      },
    ],
  },

  {
    label: "ATS",
    items: [
      {
        label: "ATS Analysis",
        path: "/hr/analysis",
        icon: BrainCircuit,
      },
      {
        label: "Analysis History",
        path: "/hr/analysis/history",
        icon: History,
      },
    ],
  },

  {
    label: "System",
    items: [
      {
        label: "Settings",
        path: "/hr/settings",
        icon: Settings,
      },
    ],
  },
];

const HRSidebar = ({ mobileOpen, onClose }: HRSidebarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      setUserMenuOpen(false);

      await logout();

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const getInitials = () => {
    if (!user?.name) {
      return "HR";
    }

    return user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  };

  const getRoleLabel = () => {
    if (user?.role === "admin") {
      return "Administrator";
    }

    return "Hiring Manager";
  };

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-40
              bg-forest-950/40
              backdrop-blur-sm
              lg:hidden
            "
          />

          {/* Sidebar */}
          <motion.aside
            initial={{
              x: -280,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: -280,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="
              fixed
              inset-y-0
              left-0
              z-50
              flex
              w-[250px]
              flex-col
              bg-forest-950
              text-white
              shadow-elevated
              lg:z-30
            "
          >
            {/* Brand */}
            <div
              className="
                flex
                h-[76px]
                items-center
                justify-between
                border-b
                border-white/10
                px-5
              "
            >
              <div>
                <p
                  className="
                    font-display
                    text-xl
                    tracking-wide
                    text-white
                  "
                >
                  ATSentra
                </p>

                <p
                  className="
                    mt-0.5
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.16em]
                    text-mint-300
                  "
                >
                  Recruiter Workspace
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="
                  rounded-md
                  p-1.5
                  text-white/60
                  transition
                  hover:bg-white/10
                  hover:text-white
                  lg:hidden
                "
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Workspace */}
            <div className="px-4 pt-6">
              <div
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  px-4
                  py-3
                "
              >
                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  Hiring & Recruitment
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-white/45
                  "
                >
                  Candidate management
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-5 overflow-hidden">
              <div className="space-y-4">
                {navigationSections.map((section) => (
                  <div key={section.label}>
                    <p
                      className="
                        mb-2
                        px-3
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-white/35
                      "
                    >
                      {section.label}
                    </p>

                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;

                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/hr/analysis"}
                            onClick={onClose}
                            className={({ isActive }) => `
                              group
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              px-3
                              py-2
                              text-sm
                              font-medium
                              transition-all
                              duration-200

                              ${
                                isActive
                                  ? `
                                    bg-mint-500
                                    text-forest-950
                                    shadow-soft
                                  `
                                  : `
                                    text-white/65
                                    hover:bg-white/[0.07]
                                    hover:text-white
                                  `
                              }
                            `}
                          >
                            {({ isActive }) => (
                              <>
                                <Icon
                                  className={`
                                    h-[18px]
                                    w-[18px]
                                    shrink-0
                                    transition-transform
                                    duration-200
                                    ${isActive ? "scale-105" : "group-hover:scale-105"}
                                  `}
                                />

                                <span className="min-w-0 flex-1 truncate">
                                  {item.label}
                                </span>

                                {item.badge !== undefined && (
                                  <span
                                    className="
                                      rounded-full
                                      bg-mint-300/15
                                      px-2
                                      py-0.5
                                      text-[10px]
                                      font-bold
                                      text-mint-300
                                    "
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </nav>

            {/* Bottom User */}
            <div className="relative border-t border-white/10 p-4">
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 8,
                      scale: 0.98,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                    className="
                      absolute
                      bottom-[calc(100%-4px)]
                      left-4
                      right-4
                      overflow-hidden
                      rounded-xl
                      border
                      border-white/10
                      bg-forest-900
                      shadow-elevated
                    "
                  >
                    {/* Profile */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/hr/profile");
                        onClose();
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-4
                        py-3
                        text-left
                        text-sm
                        text-white/75
                        transition
                        hover:bg-white/[0.07]
                        hover:text-white
                      "
                    >
                      <UserCircle className="h-[18px] w-[18px]" />

                      <span>Profile</span>
                    </button>

                    <div className="mx-3 border-t border-white/10" />

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-4
                        py-3
                        text-left
                        text-sm
                        text-red-300
                        transition
                        hover:bg-red-400/10
                        hover:text-red-200
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <LogOut className="h-[18px] w-[18px]" />

                      <span>{loggingOut ? "Signing out..." : "Logout"}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setUserMenuOpen((current) => !current)}
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  bg-white/[0.05]
                  px-3
                  py-3
                  text-left
                  transition
                  hover:bg-white/[0.08]
                "
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                {/* Avatar */}
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-mint-300
                    text-sm
                    font-bold
                    text-forest-950
                  "
                >
                  {getInitials()}
                </div>

                {/* User information */}
                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-white
                    "
                  >
                    {user?.name ?? "Recruiter"}
                  </p>

                  <p
                    className="
                      truncate
                      text-xs
                      text-white/45
                    "
                  >
                    {getRoleLabel()}
                  </p>
                </div>

                {/* Dropdown icon */}
                <ChevronUp
                  className={`
                    h-4
                    w-4
                    shrink-0
                    text-white/40
                    transition-transform
                    duration-200
                    ${userMenuOpen ? "rotate-180" : ""}
                  `}
                />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default HRSidebar;
