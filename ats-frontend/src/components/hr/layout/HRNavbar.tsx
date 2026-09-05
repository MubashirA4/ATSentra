import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

interface HRNavbarProps {
  onMenuClick: () => void;
}

const HRNavbar = ({
  onMenuClick,
}: HRNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const notificationRef =
    useRef<HTMLDivElement>(null);

  const profileRef =
    useRef<HTMLDivElement>(null);

  /*
   * =========================================================
   * PAGE CONTEXT
   * =========================================================
   */

  const getPageContext = () => {
    if (location.pathname === "/hr/dashboard") {
      return {
        label: "Recruiter workspace",
        title: "Hiring Dashboard",
      };
    }

    if (location.pathname.startsWith("/hr/jobs")) {
      return {
        label: "Recruiter workspace",
        title: "Jobs",
      };
    }

    if (
      location.pathname.startsWith(
        "/hr/candidates",
      )
    ) {
      return {
        label: "Recruiter workspace",
        title: "Candidates",
      };
    }

    if (
      location.pathname.startsWith(
        "/hr/analysis",
      )
    ) {
      return {
        label: "Recruiter workspace",
        title: "ATS Analysis",
      };
    }

    if (
      location.pathname.startsWith(
        "/hr/analytics",
      )
    ) {
      return {
        label: "Recruiter workspace",
        title: "Analytics",
      };
    }

    if (
      location.pathname.startsWith(
        "/hr/settings",
      )
    ) {
      return {
        label: "Recruiter workspace",
        title: "Settings",
      };
    }

    return {
      label: "Recruiter workspace",
      title: "ATSentra",
    };
  };

  const pageContext = getPageContext();

  /*
   * =========================================================
   * USER HELPERS
   * =========================================================
   */

  const getInitials = () => {
    if (!user?.name) {
      return "HR";
    }

    return user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) =>
        name.charAt(0).toUpperCase(),
      )
      .join("");
  };

  const getRoleLabel = () => {
    if (user?.role === "admin") {
      return "Administrator";
    }

    return "Hiring Manager";
  };

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);
      setProfileOpen(false);

      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout failed:",
        error,
      );
    } finally {
      setLoggingOut(false);
    }
  };

  /*
   * =========================================================
   * OUTSIDE CLICK
   * =========================================================
   */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          target,
        )
      ) {
        setNotificationsOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(
          target,
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  /*
   * =========================================================
   * KEYBOARD SEARCH
   * =========================================================
   */

  useEffect(() => {
    const handleKeyboard = (
      event: KeyboardEvent,
    ) => {
      const isShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyboard,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyboard,
      );
    };
  }, []);

  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget,
    );

    const query = String(
      formData.get("search") || "",
    )
      .trim()
      .toLowerCase();

    if (!query) {
      return;
    }

    if (
      query.includes("candidate") ||
      query.includes("applicant")
    ) {
      navigate("/hr/candidates");
      setSearchOpen(false);
      return;
    }

    if (
      query.includes("job") ||
      query.includes("position")
    ) {
      navigate("/hr/jobs");
      setSearchOpen(false);
      return;
    }

    if (
      query.includes("analysis") ||
      query.includes("ats")
    ) {
      navigate("/hr/analysis");
      setSearchOpen(false);
      return;
    }

    if (
      query.includes("analytics") ||
      query.includes("report")
    ) {
      navigate("/hr/analytics");
      setSearchOpen(false);
      return;
    }

    if (
      query.includes("dashboard") ||
      query.includes("home")
    ) {
      navigate("/hr/dashboard");
      setSearchOpen(false);
    }
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
        {/* =================================================
            LEFT
        ================================================= */}

        <div className="flex min-w-0 items-center gap-4">
          {/* Mobile menu */}
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

          {/* Page context */}
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
              {pageContext.label}
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
              {pageContext.title}
            </h1>
          </div>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setSearchOpen(
                  (current) => !current,
                )
              }
              className="
                hidden
                items-center
                gap-6
                rounded-xl
                border
                border-cream-300
                bg-cream-50
                px-3
                py-2
                w-78
                text-sm
                text-text-muted
                transition
                hover:border-mint-300
                hover:bg-white
                hover:text-text-primary
                md:flex
              "
            >
              <Search className="h-4 w-4" />

              <span>
                Search candidates...
              </span>

              <kbd
                className="
                  ml-8
                  rounded-md
                  bg-cream-200
                  px-1.5
                  py-0.5
                  text-[10px]
                  text-text-muted
                "
              >
                ⌘ K
              </kbd>
            </button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -5,
                  }}
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-80
                    overflow-hidden
                    rounded-xl
                    border
                    border-cream-300
                    bg-white
                    shadow-elevated
                  "
                >
                  <form
                    onSubmit={handleSearch}
                    className="p-3"
                  >
                    <div className="relative">
                      <Search
                        className="
                          pointer-events-none
                          absolute
                          left-3
                          top-1/2
                          h-4
                          w-4
                          -translate-y-1/2
                          text-text-muted
                        "
                      />

                      <input
                        autoFocus
                        name="search"
                        type="search"
                        placeholder="Search ATSentra..."
                        className="
                          h-10
                          w-full
                          rounded-lg
                          border
                          border-cream-300
                          bg-cream-50
                          pl-10
                          pr-9
                          text-xs
                          text-forest-900
                          outline-none
                          focus:border-mint-300
                          focus:ring-2
                          focus:ring-mint-300/30
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setSearchOpen(false)
                        }
                        className="
                          absolute
                          right-2
                          top-1/2
                          -translate-y-1/2
                          rounded-md
                          p-1
                          text-text-muted
                          hover:bg-cream-200
                        "
                        aria-label="Close search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </form>

                  <div className="border-t border-cream-200 px-4 py-3">
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-text-muted
                      "
                    >
                      Quick navigation
                    </p>
                  </div>

                  {/* Candidates */}
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/hr/candidates");
                      setSearchOpen(false);
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      transition
                      hover:bg-cream-100
                    "
                  >
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-mint-100
                        text-mint-500
                      "
                    >
                      <User className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-forest-900">
                        Candidates
                      </p>

                      <p className="text-[10px] text-text-muted">
                        Review candidate profiles
                      </p>
                    </div>
                  </button>

                  {/* Jobs */}
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/hr/jobs");
                      setSearchOpen(false);
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      transition
                      hover:bg-cream-100
                    "
                  >
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-cream-200
                        text-forest-700
                      "
                    >
                      <BriefcaseBusiness className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-forest-900">
                        Jobs
                      </p>

                      <p className="text-[10px] text-text-muted">
                        Manage open positions
                      </p>
                    </div>
                  </button>

                  {/* ATS Analysis */}
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/hr/analysis");
                      setSearchOpen(false);
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      transition
                      hover:bg-cream-100
                    "
                  >
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-forest-900
                        text-white
                      "
                    >
                      <Search className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-forest-900">
                        ATS Analysis
                      </p>

                      <p className="text-[10px] text-text-muted">
                        Review candidate evaluations
                      </p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div
            ref={notificationRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(
                  (current) => !current,
                );

                setProfileOpen(false);
              }}
              className="
                relative
                rounded-xl
                border
                border-cream-300
                bg-cream-50
                p-2.5
                text-text-secondary
                transition
                hover:border-mint-300
                hover:bg-mint-100
                hover:text-forest-900
              "
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />

              <span
                className="
                  absolute
                  right-2
                  top-2
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-danger
                "
              />
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -5,
                  }}
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-80
                    overflow-hidden
                    rounded-xl
                    border
                    border-cream-300
                    bg-white
                    shadow-elevated
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-cream-200
                      px-4
                      py-3
                    "
                  >
                    <p className="text-sm font-bold text-forest-900">
                      Notifications
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setNotificationsOpen(
                          false,
                        )
                      }
                      className="
                        rounded-md
                        p-1
                        text-text-muted
                        hover:bg-cream-100
                      "
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="px-4 py-8 text-center">
                    <div
                      className="
                        mx-auto
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-mint-100
                        text-mint-500
                      "
                    >
                      <Bell className="h-4 w-4" />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-forest-900">
                      No new notifications
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-text-muted">
                      Candidate analysis updates and
                      recruitment activity will appear here.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================
              PROFILE
          ================================================= */}

          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() => {
                setProfileOpen(
                  (current) => !current,
                );

                setNotificationsOpen(false);
              }}
              className="
                hidden
                items-center
                gap-2
                rounded-xl
                border
                border-transparent
                px-2
                py-1.5
                transition
                hover:border-cream-300
                hover:bg-white
                sm:flex
              "
              aria-expanded={profileOpen}
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-forest-900
                  text-[10px]
                  font-bold
                  text-mint-100
                "
              >
                {getInitials()}
              </div>

              <div className="hidden text-left lg:block">
                <p className="text-xs font-bold text-forest-900">
                  {user?.name || "HR User"}
                </p>

                <p className="text-[9px] text-text-muted">
                  {getRoleLabel()}
                </p>
              </div>

              <ChevronDown
                className={`
                  hidden
                  h-3.5
                  w-3.5
                  text-text-muted
                  transition-transform
                  lg:block
                  ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -5,
                  }}
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-64
                    overflow-hidden
                    rounded-xl
                    border
                    border-cream-300
                    bg-white
                    shadow-elevated
                  "
                >
                  {/* Account header */}
                  <div
                    className="
                      border-b
                      border-cream-200
                      px-4
                      py-4
                    "
                  >
                    <div className="flex items-center gap-3">
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
                          text-mint-100
                        "
                      >
                        {getInitials()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-forest-900">
                          {user?.name || "HR User"}
                        </p>

                        <p className="truncate text-[10px] text-text-muted">
                          {user?.email || ""}
                        </p>

                        <p className="mt-0.5 text-[9px] font-semibold text-mint-500">
                          {getRoleLabel()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/hr/profile");
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-xs
                        font-semibold
                        text-text-secondary
                        transition
                        hover:bg-cream-100
                        hover:text-forest-900
                      "
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/hr/settings");
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-xs
                        font-semibold
                        text-text-secondary
                        transition
                        hover:bg-cream-100
                        hover:text-forest-900
                      "
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>

                    <div className="my-1 border-t border-cream-200" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-xs
                        font-semibold
                        text-danger
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <LogOut className="h-4 w-4" />

                      {loggingOut
                        ? "Signing out..."
                        : "Sign out"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HRNavbar;