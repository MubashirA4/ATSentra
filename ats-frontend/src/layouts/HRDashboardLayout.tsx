import { motion } from "framer-motion";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import HRNavbar from "../components/hr/layout/HRNavbar";
import HRSidebar from "../components/hr/layout/HRSidebar";

const HRDashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <HRSidebar mobileOpen={true} onClose={closeSidebar} />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <HRSidebar mobileOpen={mobileSidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Main Application */}
      <div className="min-h-screen lg:pl-[250px]">
        <HRNavbar onMenuClick={() => setMobileSidebarOpen(true)} />

        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="
            mx-auto
            w-full
            max-w-[1600px]
            px-4
            py-6
            sm:px-6
            sm:py-8
            lg:px-8
          "
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default HRDashboardLayout;