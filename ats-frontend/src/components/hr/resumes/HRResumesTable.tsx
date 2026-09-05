import type {
  RecruiterResume,
} from "../../../types/recruiterResume";

import HRResumeRow from "./HRResumeRow";

interface HRResumesTableProps {
  resumes: RecruiterResume[];
  processingId: string | null;
  onProcess: (resume: RecruiterResume) => void;
  onDelete: (resume: RecruiterResume) => void;
}

const HRResumesTable = ({
  resumes,
  processingId,
  onProcess,
  onDelete,
}: HRResumesTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Candidate
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Resume
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Uploaded
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {resumes.map((resume) => (
              <HRResumeRow
                key={resume._id}
                resume={resume}
                processingId={processingId}
                onProcess={onProcess}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HRResumesTable;