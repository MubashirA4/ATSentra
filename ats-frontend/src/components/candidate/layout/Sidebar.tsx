import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import SidebarBrand from "./SidebarBrand";
import SidebarNavigation from "./SidebarNavigation";
import SidebarUser from "./SidebarUser";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ mobileOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-40
              bg-forest-950/30
              backdrop-blur-sm
              lg:hidden
            "
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: mobileOpen ? 0 : "-100%",
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className="
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[264px]
          flex-col
          border-r
          border-cream-300
          bg-cream-50

          lg:z-auto
          lg:w-[250px]
          lg:translate-x-0
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
            border-cream-300
            px-6
          "
        >
          <SidebarBrand onNavigate={onClose} />

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-md
              p-2
              text-text-muted
              transition-colors
              hover:bg-cream-200
              hover:text-forest-900
              lg:hidden
            "
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

   
  

        {/* Navigation */}
        <SidebarNavigation onNavigate={onClose} />

        {/* Upgrade */}
        {/* <SidebarUpgrade /> */}

        {/* User */}
        <SidebarUser />
      </motion.aside>
    </>
  );
};

export default Sidebar;