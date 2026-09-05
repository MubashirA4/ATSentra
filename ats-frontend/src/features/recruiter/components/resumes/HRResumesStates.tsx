import {
  AlertCircle,
  FileSearch,
} from "lucide-react";

interface HRResumesStatesProps {
  type: "loading" | "empty" | "error";
  message?: string;
}

const HRResumesStates = ({
  type,
  message,
}: HRResumesStatesProps) => {
  if (type === "loading") {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-700" />

          <p className="mt-4 text-sm text-slate-500">
            Loading candidate resumes...
          </p>
        </div>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-red-100 bg-red-50/50">
        <div className="max-w-md px-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <AlertCircle size={23} />
          </div>

          <h3 className="mt-4 font-semibold text-slate-900">
            Unable to load resumes
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {message ||
              "Something went wrong while loading the resume pool."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
      <div className="max-w-md px-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <FileSearch size={23} />
        </div>

        <h3 className="mt-4 font-semibold text-slate-900">
          No resumes found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          {message ||
            "Upload a candidate resume to start building your recruiting pool."}
        </p>
      </div>
    </div>
  );
};

export default HRResumesStates;
