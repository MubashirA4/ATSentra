import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card = ({
  children,
  className = "",
  hover = false,
}: CardProps) => {
  const content = (
    <div
      className={`
        rounded-lg
        border
        border-cream-300
        bg-white
        shadow-soft
        ${className}
      `}
    >
      {children}
    </div>
  );

  if (!hover) {
    return content;
  }

  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.2,
      }}
    >
      {content}
    </motion.div>
  );
};

export default Card;
