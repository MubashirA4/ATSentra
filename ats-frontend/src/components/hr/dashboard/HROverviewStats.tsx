import {
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import type { ATSDashboardOverview } from "../../../types/atsDashboard";

interface HROverviewStatsProps {
  overview: ATSDashboardOverview;
}

const HROverviewStats = ({
  overview,
}: HROverviewStatsProps) => {
  const cards = [
    {
      label: "Candidates",
      value: overview.totalCandidates,
      description: "Total analyzed",
      icon: Users,
      iconClass:
        "bg-mint-100 text-forest-800",
    },
    {
      label: "Eligible",
      value: overview.eligibleCandidates,
      description: `${overview.eligibilityRate}% eligibility rate`,
      icon: CheckCircle2,
      iconClass:
        "bg-mint-100 text-success",
    },
    {
      label: "Average Score",
      value: `${Math.round(overview.averageScore)}%`,
      description: `Range ${Math.round(
        overview.lowestScore,
      )}–${Math.round(overview.highestScore)}`,
      icon: TrendingUp,
      iconClass:
        "bg-cream-200 text-forest-800",
    },
    {
      label: "Ranking Score",
      value: Math.round(
        overview.averageRankingScore,
      ),
      description: `Best ${Math.round(
        overview.highestRankingScore,
      )}`,
      icon: BarChart3,
      iconClass:
        "bg-cream-200 text-info",
    },
  ];

  return (
    <section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.label}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.06,
                duration: 0.3,
              }}
              className="
                rounded-2xl
                border
                border-cream-300
                bg-cream-50
                p-5
                shadow-soft
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">
                    {card.label}
                  </p>

                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-forest-950">
                    {card.value}
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    {card.description}
                  </p>
                </div>

                <div
                  className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    ${card.iconClass}
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default HROverviewStats;