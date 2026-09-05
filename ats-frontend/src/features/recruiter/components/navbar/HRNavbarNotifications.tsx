import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HRNavbarNotifications = () => {
  const [open, setOpen] = useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
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

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
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
                onClick={() => setOpen(false)}
                className="p-1 text-text-muted"
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
                Candidate activity and ATS updates
                will appear here.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HRNavbarNotifications;
