import {
  Search,
  Users,
  MapPin,
  FileText,
  Eye,
  Loader2,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getCandidates } from "@features/recruiter/services/candidate.service";
import type { Candidate, CandidateStatus } from "@types/candidate";

const HRCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "all">(
    "all",
  );

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCandidates();

        setCandidates(data.candidates);
      } catch (error) {
        console.error("Failed to load candidates:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load candidates.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, []);

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const matchesSearch =
        !normalizedSearch ||
        candidate.name.toLowerCase().includes(normalizedSearch) ||
        candidate.email?.toLowerCase().includes(normalizedSearch) ||
        candidate.location?.toLowerCase().includes(normalizedSearch) ||
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(normalizedSearch),
        );

      const matchesStatus =
        statusFilter === "all" || candidate.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [candidates, search, statusFilter]);

  const getStatusClasses = (status: CandidateStatus) => {
    switch (status) {
      case "active":
        return "bg-mint-500/10 text-mint-700";

      case "inactive":
        return "bg-amber-500/10 text-amber-700";

      case "archived":
        return "bg-slate-500/10 text-slate-600";

      default:
        return "bg-slate-500/10 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <div className="mb-2 flex items-center gap-2 text-mint-700">
            <Users className="h-5 w-5" />
            <span className="text-sm font-semibold">Recruitment</span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-forest-950 sm:text-3xl">
            Candidates
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and review candidates in your recruitment workspace.
          </p>
        </motion.div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <Users className="h-4 w-4 text-mint-700" />
          <span className="text-sm font-semibold text-slate-700">
            {candidates.length}
          </span>
          <span className="text-sm text-slate-500">candidates</span>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search candidates, skills, location..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-4
                text-sm
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-mint-500
                focus:bg-white
                focus:ring-2
                focus:ring-mint-500/10
              "
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as CandidateStatus | "all")
            }
            className="
              h-11
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              text-sm
              font-medium
              text-slate-700
              outline-none
              focus:border-mint-500
              focus:ring-2
              focus:ring-mint-500/10
            "
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading candidates...
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <UserRound className="h-6 w-6 text-slate-400" />
          </div>

          <h2 className="text-sm font-semibold text-slate-800">
            No candidates found
          </h2>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Skills
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Resume
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate._id}
                    className="transition hover:bg-slate-50/70"
                  >
                    {/* Candidate */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint-500/10 text-sm font-bold text-mint-700">
                          {candidate.name
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {candidate.name}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {candidate.email ?? "No email provided"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>{candidate.location ?? "Not specified"}</span>
                      </div>
                    </td>

                    {/* Skills */}
                    <td className="px-6 py-4">
                      <div className="flex max-w-65 flex-wrap gap-1.5">
                        {candidate.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}

                        {candidate.skills.length > 3 && (
                          <span className="rounded-md bg-mint-500/10 px-2 py-1 text-[11px] font-semibold text-mint-700">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Resume */}
                    <td className="px-6 py-4">
                      {candidate.resume ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-mint-700">
                          <FileText className="h-4 w-4" />
                          Available
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Not available
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                          candidate.status,
                        )}`}
                      >
                        {candidate.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/hr/candidates/${candidate._id}`}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-lg
                          border
                          border-slate-200
                          px-3
                          py-2
                          text-xs
                          font-semibold
                          text-slate-700
                          transition
                          hover:border-mint-300
                          hover:bg-mint-50
                          hover:text-mint-800
                        "
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRCandidates;
