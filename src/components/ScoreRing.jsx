export default function ScoreRing({ score, size = 90, stroke = 7 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = (score / 100) * circ

  const color = score >= 90 ? '#00d68f' : score >= 75 ? '#00e5ff' : score >= 60 ? '#ffd600' : '#ff3860'

  return (
    <div className="score-ring-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--at-border)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${pct} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="score-value" style={{ fontSize: size * 0.18, color }}>{score}</span>
    </div>
  )
}
