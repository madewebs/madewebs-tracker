export function CircleProgress({ pct, size = 120, stroke = 10 }: { pct: number, size?: number, stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  
  let color = "#22c55e"; // Green for >= 80%
  if (pct < 50) color = "#f97316"; // Orange for < 50%
  else if (pct < 80) color = "#078FCD"; // Primary for 50-79%

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle 
        cx={size / 2} cy={size / 2} r={r} 
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ - dash}
        style={{ transition: "stroke-dashoffset 0.6s ease" }} strokeLinecap="round" 
      />
      <text 
        x={size / 2} y={size / 2 + 2} textAnchor="middle" dominantBaseline="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px`, fontSize: size / 4, fontWeight: 700, fill: color }}
      >
        {pct}%
      </text>
    </svg>
  );
}
