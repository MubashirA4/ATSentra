import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@store/auth/AuthContext";

const HRNavbarProfile = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      setOpen(false);

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

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
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
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      <AnimatePresence>
        {open && (
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
            {/* Account */}
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

            {/* Actions */}
            <div className="p-1.5">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
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
                  setOpen(false);
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
                  hover:bg-red-50
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
  );
};

export default HRNavbarProfile;
