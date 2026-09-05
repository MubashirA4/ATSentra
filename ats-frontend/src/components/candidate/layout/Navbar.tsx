import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  FileText,
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

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  /*
   * ---------------------------------------------------------
   * Page context
   * ---------------------------------------------------------
   */

  const getPageContext = () => {
    if (location.pathname === "/dashboard") {
      return {
        label: "Candidate workspace",
        title: "Dashboard",
      };
    }

    if (location.pathname === "/resumes") {
      return {
        label: "Candidate workspace",
        title: "My resumes",
      };
    }

    if (location.pathname === "/resume/upload") {
      return {
        label: "Candidate workspace",
        title: "Upload resume",
      };
    }

    if (location.pathname.startsWith("/resume-analysis")) {
      return {
        label: "Candidate workspace",
        title: "Resume analysis",
      };
    }

    return {
      label: "Candidate workspace",
      title: "Resume intelligence",
    };
  };

  const pageContext = getPageContext();

  /*
   * ---------------------------------------------------------
   * User helpers
   * ---------------------------------------------------------
   */

  const getInitials = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  };

  /*
   * ---------------------------------------------------------
   * Logout
   * ---------------------------------------------------------
   */

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      setProfileOpen(false);

      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * Close dropdowns when clicking outside
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
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
   * ---------------------------------------------------------
   * Keyboard shortcut
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const isShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setProfileOpen(false);
        setNotificationsOpen(false);
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
   * ---------------------------------------------------------
   * Search navigation
   * ---------------------------------------------------------
   */

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("search") || "")
      .trim()
      .toLowerCase();

    if (!query) {
      return;
    }

    if (
      query.includes("resume") ||
      query.includes("cv")
    ) {
      navigate("/resumes");
      setSearchOpen(false);
      return;
    }

    if (
      query.includes("upload") ||
      query.includes("upload resume")
    ) {
      navigate("/resume/upload");
      setSearchOpen(false);
      return;
    }

    if (
      query.includes("dashboard") ||
      query.includes("home")
    ) {
      navigate("/dashboard");
      setSearchOpen(false);
      return;
    }

    /*
     * If there is no direct destination yet,
     * keep the search UI open rather than pretending
     * that a result exists.
     */
  };

  return (
    <header
      className="
        sticky
        top-0
        z-30
        border-b
        border-cream-300
        bg-cream-100/90
        backdrop-blur-md
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

        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="
              rounded-md
              p-2
              text-text-secondary
              transition-colors
              hover:bg-cream-200
              hover:text-forest-900
              lg:hidden
            "
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Current page */}
          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-text-muted
              "
            >
              {pageContext.label}
            </p>

            <p
              className="
                mt-0.5
                truncate
                text-sm
                font-semibold
                text-forest-900
              "
            >
              {pageContext.title}
            </p>
          </div>
        </div>

        {/* =================================================
            CENTER SEARCH
        ================================================= */}

        <form
          onSubmit={handleSearch}
          className="
            hidden
            max-w-md
            flex-1
            md:block
          "
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
              name="search"
              type="search"
              placeholder="Search resumes, pages..."
              className="
                h-10
                w-full
                rounded-md
                border
                border-cream-300
                bg-white
                pl-10
                pr-16
                text-xs
                text-forest-900
                outline-none
                transition
                placeholder:text-text-muted
                focus:border-forest-700/40
                focus:ring-2
                focus:ring-mint-300/40
              "
              onFocus={() => setSearchOpen(true)}
            />

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="
                absolute
                right-2
                top-1/2
                hidden
                -translate-y-1/2
                rounded
                border
                border-cream-300
                bg-cream-50
                px-1.5
                py-0.5
                text-[9px]
                font-semibold
                text-text-muted
                transition
                hover:bg-cream-200
                lg:block
              "
            >
              ⌘ K
            </button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -4,
                  }}
                  className="
                    absolute
                    left-0
                    right-0
                    top-12
                    z-50
                    overflow-hidden
                    rounded-xl
                    border
                    border-cream-300
                    bg-white
                    shadow-elevated
                  "
                >
                  <div className="border-b border-cream-200 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Quick navigation
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/dashboard");
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
                      transition-colors
                      hover:bg-cream-100
                    "
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-100 text-mint-500">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-forest-900">
                        Dashboard
                      </p>

                      <p className="text-[10px] text-text-muted">
                        View your ATS overview
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/resumes");
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
                      transition-colors
                      hover:bg-cream-100
                    "
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream-200 text-forest-700">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-forest-900">
                        My Resumes
                      </p>

                      <p className="text-[10px] text-text-muted">
                        View your uploaded resumes
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/resume/upload");
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
                      transition-colors
                      hover:bg-cream-100
                    "
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-900 text-white">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-forest-900">
                        Upload Resume
                      </p>

                      <p className="text-[10px] text-text-muted">
                        Analyze a new resume
                      </p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <div
            ref={notificationRef}
            className="relative"
          >
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => {
                setNotificationsOpen(
                  (current) => !current,
                );
                setProfileOpen(false);
              }}
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-md
                border
                border-cream-300
                bg-white
                text-text-secondary
                transition-colors
                hover:border-cream-400
                hover:text-forest-900
              "
              aria-label="Notifications"
            >
              <Bell className="h-[17px] w-[17px]" />

              <span
                className="
                  absolute
                  right-2
                  top-2
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-mint-500
                  ring-2
                  ring-white
                "
              />
            </motion.button>

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
                  <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3">
                    <p className="text-sm font-bold text-forest-900">
                      Notifications
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setNotificationsOpen(false)
                      }
                      className="rounded-md p-1 text-text-muted hover:bg-cream-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="px-4 py-8 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-mint-100 text-mint-500">
                      <Bell className="h-4 w-4" />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-forest-900">
                      You're all caught up
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-text-muted">
                      New resume analysis updates and
                      recommendations will appear here.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
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
                rounded-md
                border
                border-transparent
                px-2
                py-1.5
                transition-colors
                hover:border-cream-300
                bg-white
                hover:bg-white
                sm:flex
              "
              aria-expanded={profileOpen}
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-forest-900
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                {getInitials()}
              </div>

              <div className="hidden text-left md:block">
                <p className="text-xs font-bold text-forest-900">
                  {user?.name || "Candidate"}
                </p>

                <p className="text-[9px] text-text-muted">
                  Candidate
                </p>
              </div>

              <ChevronDown
                className={`
                  ml-1
                  h-3.5
                  w-3.5
                  text-text-muted
                  transition-transform
                  ${profileOpen ? "rotate-180" : ""}
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
                    w-60
                    overflow-hidden
                    rounded-xl
                    border
                    border-cream-300
                    bg-white
                    shadow-elevated
                  "
                >
                  {/* User header */}
                  <div className="border-b border-cream-200 px-4 py-4">
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
                          text-white
                        "
                      >
                        {getInitials()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-forest-900">
                          {user?.name || "Candidate"}
                        </p>

                        <p className="truncate text-[10px] text-text-muted">
                          {user?.email || ""}
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
                        navigate("/profile");
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
                        transition-colors
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
                        navigate("/settings");
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
                        transition-colors
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
                        transition-colors
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

      {/* =====================================================
          MOBILE SEARCH
      ===================================================== */}

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="
              overflow-hidden
              border-t
              border-cream-300
              bg-white
              md:hidden
            "
          >
            <div className="px-4 py-3 sm:px-6">
              <form onSubmit={handleSearch}>
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
                      rounded-md
                      border
                      border-cream-300
                      bg-cream-50
                      pl-10
                      pr-10
                      text-xs
                      text-forest-900
                      outline-none
                      focus:border-forest-700/40
                      focus:ring-2
                      focus:ring-mint-300/40
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
                      p-1.5
                      text-text-muted
                      hover:bg-cream-200
                    "
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;