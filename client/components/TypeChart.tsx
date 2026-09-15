// client/components/TypeChart.tsx
const TYPE_LABELS: Record<string, string> = {
  bird: 'Birds',
  herp: 'Reptiles &\nAmphibians',
  insect: 'Insects',
  plant: 'Plants',
  fungi: 'Fungi',
  mammal: 'Mammals',
}

// Precomputed positions for a 6-node circle, clockwise from the top —
// see conversation notes for the angle math behind these numbers.
const nodes = [
  { type: 'bird', x: 160, y: 50 },
  { type: 'herp', x: 255, y: 105 },
  { type: 'insect', x: 255, y: 215 },
  { type: 'plant', x: 160, y: 270 },
  { type: 'fungi', x: 65, y: 215 },
  { type: 'mammal', x: 65, y: 105 },
]

const arrows = [
  { d: 'M160,50 Q235,30 234,117' }, // bird → herp
  { d: 'M255,105 Q310,160 234,203' }, // herp → insect
  { d: 'M255,215 Q235,290 160,246' }, // insect → plant
  { d: 'M160,270 Q85,290 86,203' }, // plant → fungi
  { d: 'M65,215 Q10,160 86,117' }, // fungi → mammal
  { d: 'M65,105 Q85,30 160,74' }, // mammal → bird
]

export function TypeChart() {
  return (
    <div className="battle-container__type-chart">
      <h2 className="battle-container__type-chart-title">Type Matchups</h2>
      <p className="battle-container__type-chart-note">
        Each type is strong against the one it points to.
      </p>

      <svg
        viewBox="0 0 320 320"
        width="100%"
        style={{ maxWidth: 320, margin: '0 auto', display: 'block' }}
      >
        <defs>
          <marker
            id="type-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M2 1L8 5L2 9"
              fill="none"
              stroke="var(--color-red)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </marker>
        </defs>

        {arrows.map((arrow, i) => (
          <path
            key={i}
            d={arrow.d}
            fill="none"
            stroke="var(--color-red)"
            strokeWidth="2"
            markerEnd="url(#type-arrow)"
          />
        ))}

        {nodes.map((node) => (
          <g key={node.type}>
            <circle
              cx={node.x}
              cy={node.y}
              r="34"
              fill="var(--color-surface)"
              stroke="var(--color-red)"
              strokeWidth="2"
            />
            {TYPE_LABELS[node.type].split('\n').map((line, i, arr) => (
              <text
                key={i}
                x={node.x}
                y={node.y + (i - (arr.length - 1) / 2) * 12}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11"
                fontWeight="700"
                fill="var(--color-dark)"
              >
                {line}
              </text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  )
}
