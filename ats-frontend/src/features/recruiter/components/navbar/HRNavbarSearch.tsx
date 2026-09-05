import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Search,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HRNavbarSearch = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyboard,
      );
    };
  }, []);

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const query = String(formData.get("search") || "")
      .trim()
      .toLowerCase();

    if (!query) return;

    if (
      query.includes("candidate") ||
      query.includes("applicant")
    ) {
      navigate("/hr/candidates");
      setOpen(false);
      return;
    }

    if (
      query.includes("job") ||
      query.includes("position")
    ) {
      navigate("/hr/jobs");
      setOpen(false);
      return;
    }

    if (
      query.includes("analysis") ||
      query.includes("ats")
    ) {
      navigate("/hr/analysis");
      setOpen(false);
      return;
    }

    if (
      query.includes("analytics") ||
      query.includes("report")
    ) {
      navigate("/hr/analytics");
      setOpen(false);
      return;
    }

    if (
      query.includes("dashboard") ||
      query.includes("home")
    ) {
      navigate("/hr/dashboard");
      setOpen(false);
    }
  };

  return (
    <div className="relative hidden md:block">
      {/* Search Trigger */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="
          flex h-10 items-center
          rounded-xl border border-cream-300
          bg-cream-50
          px-3
          text-sm text-text-muted
          transition-all duration-200
          hover:border-mint-300
          hover:bg-white
          hover:text-text-secondary
          focus:outline-none
          focus:ring-2
          focus:ring-mint-300/40
        "
      >
        <Search className="h-4 w-4 shrink-0" />

        <span className="ml-2.5 whitespace-nowrap">
          Search ATSentra...
        </span>

        <kbd
          className="
            ml-4
            flex h-5 items-center
            rounded-md
            border border-cream-300
            bg-cream-100
            px-1.5
            text-[10px]
            font-medium
            leading-none
            text-text-muted
          "
        >
          ⌘ K
        </kbd>
      </button>

      {/* Search Dropdown */}
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            y: -6,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.18,
            ease: "easeOut",
          }}
          className="
            absolute
            right-0
            top-[calc(100%+8px)]
            z-50
            w-[340px]
            overflow-hidden
            rounded-2xl
            border border-cream-300
            bg-white
            shadow-elevated
          "
        >
          {/* Search Input */}
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
                placeholder="Search candidates, jobs..."
                className="
                  h-10
                  w-full
                  rounded-xl
                  border border-cream-300
                  bg-cream-50
                  pl-10
                  pr-10
                  text-xs
                  text-text-primary
                  placeholder:text-text-muted
                  outline-none
                  transition
                  focus:border-mint-400
                  focus:bg-white
                  focus:ring-2
                  focus:ring-mint-300/20
                "
              />

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="
                  absolute
                  right-2
                  top-1/2
                  flex
                  h-6
                  w-6
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-md
                  text-text-muted
                  transition
                  hover:bg-cream-200
                  hover:text-text-secondary
                "
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Quick Navigation */}
          <div className="border-t border-cream-200 px-2 py-2">
            <SearchItem
              icon={<User className="h-4 w-4" />}
              title="Candidates"
              description="Review candidates"
              onClick={() => {
                navigate("/hr/candidates");
                setOpen(false);
              }}
            />

            <SearchItem
              icon={
                <BriefcaseBusiness className="h-4 w-4" />
              }
              title="Jobs"
              description="Manage positions"
              onClick={() => {
                navigate("/hr/jobs");
                setOpen(false);
              }}
            />

            <SearchItem
              icon={<Search className="h-4 w-4" />}
              title="ATS Analysis"
              description="Review evaluations"
              onClick={() => {
                navigate("/hr/analysis");
                setOpen(false);
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface SearchItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const SearchItem = ({
  icon,
  title,
  description,
  onClick,
}: SearchItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        min-h-[56px]
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        text-left
        transition-all duration-150
        hover:bg-cream-100
      "
    >
      {/* Icon */}
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-mint-100
          text-mint-500
        "
      >
        {icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold leading-5 text-forest-900">
          {title}
        </p>

        <p className="text-[10px] leading-4 text-text-muted">
          {description}
        </p>
      </div>
    </button>
  );
};

export default HRNavbarSearch;
