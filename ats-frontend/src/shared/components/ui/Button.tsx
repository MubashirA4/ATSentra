import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-forest-900 text-white hover:bg-forest-800",

    secondary:
      "border border-cream-300 bg-white text-forest-900 hover:bg-cream-50",

    ghost:
      "text-forest-700 hover:bg-cream-200",

    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-md
        px-4
        py-2.5
        text-sm
        font-semibold
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}

      {children}
    </motion.button>
  );
};

export default Button;
