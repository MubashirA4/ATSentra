import { useNavigate } from "react-router-dom";

import Button from "@shared/components/ui/Button";

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-5 border-b border-cream-300 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
          Resume intelligence
        </p>

        <h1 className="mt-2 font-display text-3xl text-forest-950 sm:text-4xl">
          Welcome back.
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
          Understand how competitive your resume is and identify the changes
          that can improve its ATS performance.
        </p>
      </div>

      <Button variant="primary" onClick={() => navigate("/candidate/resume/upload")}>
        Analyze Resume
      </Button>
    </section>
  );
};

export default DashboardHeader;
