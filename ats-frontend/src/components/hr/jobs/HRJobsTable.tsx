import type { ATSJob } from "../../../types/job";
import HRJobRow from "./HRJobRow";

interface HRJobsTableProps {
  jobs: ATSJob[];
}

const HRJobsTable = ({ jobs }: HRJobsTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-forest-900/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-forest-900/10 bg-forest-950/[0.025]">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Job
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Experience
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Employment
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Created
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-forest-900/10">
            {jobs.map((job) => (
              <HRJobRow key={job._id} job={job} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HRJobsTable;