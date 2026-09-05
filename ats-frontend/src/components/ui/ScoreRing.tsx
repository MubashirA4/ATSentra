import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

const ScoreRing = ({
  score,
  size = 132,
  strokeWidth = 10,
  label = "score",
}: ScoreRingProps) => {
  const [displayScore, setDisplayScore] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const normalizedScore = Math.min(
    Math.max(score, 0),
    100,
  );

  const progressOffset =
    circumference -
    (normalizedScore / 100) * circumference;

  useEffect(() => {
    let animationFrame: number;
    const duration = 900;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setDisplayScore(
        Math.round(easedProgress * normalizedScore),
      );

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      }
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [normalizedScore]);

  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-mint-100"
        />

        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-mint-500"
          strokeDasharray={circumference}
          initial={{
            strokeDashoffset: circumference,
          }}
          animate={{
            strokeDashoffset: progressOffset,
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
        />
      </svg>

      {/* Center content */}
      <div
        className="
          absolute
          inset-0
          flex
          flex-col
          items-center
          justify-center
        "
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display text-3xl text-forest-900"
        >
          {displayScore}
        </motion.p>

        <p
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-wider
            text-text-muted
          "
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export default ScoreRing;