export default function DonutChart({ onBudget, selfFunded, size = 92, stroke = 14 }) {
  const total = onBudget + selfFunded;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const onBudgetPct = total === 0 ? 0 : onBudget / total;
  const onBudgetLen = circumference * onBudgetPct;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Funding split donut chart">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#EFEFF3"
        strokeWidth={stroke}
      />
      {total > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#4F46E5"
          strokeWidth={stroke}
          strokeDasharray={`${onBudgetLen} ${circumference - onBudgetLen}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dasharray 0.4s ease" }}
        />
      )}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="15"
        fontWeight="600"
        fill="#14182B"
      >
        {total === 0 ? "0" : Math.round(onBudgetPct * 100) + "%"}
      </text>
    </svg>
  );
}
