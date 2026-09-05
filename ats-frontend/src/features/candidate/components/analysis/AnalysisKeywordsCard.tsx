import {
  Check,
  Search,
  X,
} from "lucide-react";

import Badge from "@shared/components/ui/Badge";
import Card from "@shared/components/ui/Card";
import type { AnalysisKeywords } from "@types/analysis";

interface AnalysisKeywordsCardProps {
  keywords: AnalysisKeywords;
}

const AnalysisKeywordsCard = ({
  keywords,
}: AnalysisKeywordsCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-mint-100 text-forest-800">
            <Search className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
              Keyword analysis
            </p>

            <h2 className="mt-1 text-lg font-bold text-forest-900">
              Search-term coverage
            </h2>
          </div>
        </div>

        <Badge variant="mint">
          {keywords.score}% coverage
        </Badge>
      </div>

      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary">
            Coverage
          </span>

          <span className="text-xs font-bold text-forest-900">
            {keywords.score}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-mint-500"
            style={{
              width: `${keywords.score}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <KeywordGroup
          title="Matched keywords"
          items={keywords.matched}
          matched
        />

        <KeywordGroup
          title="Missing keywords"
          items={keywords.missing}
        />
      </div>

      <div className="mt-6 flex gap-3 border-t border-cream-300 pt-5">
        <Search className="mt-0.5 h-4 w-4 shrink-0 text-forest-700" />

        <p className="text-xs leading-5 text-text-secondary">
          Missing keywords are opportunities, not instructions
          to add unrelated skills. Only incorporate them when
          they genuinely describe your experience.
        </p>
      </div>
    </Card>
  );
};

interface KeywordGroupProps {
  title: string;
  items: string[];
  matched?: boolean;
}

const KeywordGroup = ({
  title,
  items,
  matched = false,
}: KeywordGroupProps) => {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {matched ? (
          <Check className="h-4 w-4 text-success" />
        ) : (
          <X className="h-4 w-4 text-warning" />
        )}

        <span className="text-xs font-bold text-forest-900">
          {title}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={
              matched
                ? "rounded-md border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-800"
                : "rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-800"
            }
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnalysisKeywordsCard;
