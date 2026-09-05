import { ArrowLeft, CalendarDays, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";
import ScoreRing from "../../ui/ScoreRing";

interface ResumeAnalysisHeaderProps {
  resumeName: string;
  analyzedAt: string;
  score: number;
}

const ResumeAnalysisHeader = ({
  resumeName,
  analyzedAt,
  score,
}: ResumeAnalysisHeaderProps) => {
  const navigate = useNavigate();

  const formattedDate = new Date(analyzedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="border-b border-cream-300 pb-7">
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
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-6 px-0 -mt-16 bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Button>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="mint">
              <FileText className="mr-1 h-3 w-3" />
              Resume analysis
            </Badge>

            <Badge variant="neutral">ATS evaluation</Badge>
          </div>

          <h1 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-forest-950 sm:text-4xl">
            {resumeName}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              Analyzed {formattedDate}
            </span>

            <span className="h-1 w-1 rounded-full bg-cream-300" />

            <span>
              Based on resume structure, skills, experience, keywords and
              quality signals
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden text-right sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
              Overall ATS score
            </p>

            <p className="mt-1 text-sm font-semibold text-forest-900">
              Strong resume performance
            </p>
          </div>

          <ScoreRing
            score={score}
            size={128}
            strokeWidth={9}
            label="ATS score"
          />
        </div>
      </div>
      </motion.div>
    </section>
  );
};

export default ResumeAnalysisHeader;
