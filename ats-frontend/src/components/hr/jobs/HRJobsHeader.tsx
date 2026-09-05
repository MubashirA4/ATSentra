import { BriefcaseBusiness, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HRJobsHeader = () => {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest-950 text-mint-400 shadow-sm">
          <BriefcaseBusiness size={22} className="text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-forest-950 sm:text-3xl">
            Jobs
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-text-secondary">
            Manage your organization&apos;s recruitment positions
            and monitor hiring activity.
          </p>
        </div>
      </div>

      <Link to="/hr/jobs/new">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-forest-950 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-900"
        >
          <Plus size={18} />
          Create Job
        </motion.button>
      </Link>
    </div>
  );
};

export default HRJobsHeader;