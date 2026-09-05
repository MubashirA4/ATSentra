import { motion } from "framer-motion";
import { FileText, Upload } from "lucide-react";

interface HRResumesHeaderProps {
  onUpload: () => void;
}

const HRResumesHeader = ({
  onUpload,
}: HRResumesHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <FileText size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Candidate Resumes
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and process resumes uploaded by your recruiting team.
            </p>
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onUpload}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800"
      >
        <Upload size={17} />
        Upload Resume
      </motion.button>
    </div>
  );
};

export default HRResumesHeader;