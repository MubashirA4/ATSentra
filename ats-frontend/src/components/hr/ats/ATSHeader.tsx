import { motion } from "framer-motion";
import {
  BrainCircuit,
  RefreshCw,
} from "lucide-react";

interface ATSHeaderProps {
  onReset: () => void;
  hasResults: boolean;
}

const ATSHeader = ({
  onReset,
  hasResults,
}: ATSHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <BrainCircuit size={20} />
          </div>

          <span className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            AI Recruitment
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          ATS Analysis
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Analyze candidates against a job and automatically rank
          them using skills, experience, education, and eligibility.
        </p>
      </div>

      {hasResults && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          New Analysis
        </motion.button>
      )}
    </div>
  );
};

export default ATSHeader;