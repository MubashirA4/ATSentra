interface HealthMetricProps {
  label: string;
  value: string;
}

const HealthMetric = ({
  label,
  value,
}: HealthMetricProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-text-secondary">
        {label}
      </span>

      <span className="text-xs font-bold text-forest-900">
        {value}
      </span>
    </div>
  );
};

export default HealthMetric;