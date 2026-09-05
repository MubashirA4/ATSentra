import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "danger" | "neutral" | "mint";
}

const Badge = ({
  children,
  variant = "neutral",
}: BadgeProps) => {
  const variants = {
    success:
      "bg-green-50 text-green-700 border-green-200",

    warning:
      "bg-amber-50 text-amber-700 border-amber-200",

    danger:
      "bg-red-50 text-red-700 border-red-200",

    neutral:
      "bg-cream-100 text-text-secondary border-cream-300",

    mint:
      "bg-mint-100 text-forest-800 border-mint-300",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-2.5
        py-1
        text-xs
        font-semibold
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
