/**
 * Blog post cover artwork — pure SVG, no state, no props.
 * Ported from the handoff (prototypes/blog-cover-art.jsx).
 * Each cover fills its container; wrap in BlogCover for the 16:9 frame.
 */
import type { CSSProperties } from "react";

const fill: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

// 01 — AI Ethics Journey: a path forking, one branch glowing terracotta.
export function AIEthicsCover() {
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <defs>
        <radialGradient id="ae-fade" cx="60%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#f6f4ef" stopOpacity="1" />
        </radialGradient>
      </defs>
      {[...Array(8)].map((_, i) => (
        <line key={i} x1="0" x2="400" y1={30 + i * 32} y2={30 + i * 32} stroke="#1c1b18" strokeOpacity="0.04" />
      ))}
      <path d="M 60 250 C 110 230, 140 200, 170 180" fill="none" stroke="#1c1b18" strokeWidth="3" opacity="0.4" />
      <path d="M 170 180 C 200 170, 220 180, 240 230 L 260 270" fill="none" stroke="#1c1b18" strokeWidth="2" opacity="0.25" />
      <text x="262" y="278" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478">profit-first</text>
      <path d="M 170 180 C 195 160, 230 140, 270 110 L 330 70" fill="none" stroke="#d97757" strokeWidth="3" />
      <text x="290" y="60" fontFamily="Geist Mono, monospace" fontSize="9" fill="#d97757">responsible</text>
      <circle cx="170" cy="180" r="6" fill="#fff" stroke="#d97757" strokeWidth="2" />
      <circle cx="170" cy="180" r="2" fill="#d97757" />
      <circle cx="330" cy="70" r="5" fill="#d97757" />
      <circle cx="330" cy="70" r="10" fill="#d97757" opacity="0.25" />
      <rect x="0" y="0" width="400" height="300" fill="url(#ae-fade)" opacity="0.3" />
      <text x="200" y="290" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.18em">
        WHICH PATH DOES THE FIELD TAKE?
      </text>
    </svg>
  );
}

// 02 — Beyond the P-Value: normal curve with tails shaded + effect-size CI.
export function BeyondPValueCover() {
  const N = 180;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const x = 40 + (i / N) * 320;
    const t = (i / N - 0.5) * 6;
    const y = 220 - Math.exp((-t * t) / 2) * 130;
    pts.push([x, y]);
  }
  const curvePath = "M " + pts.map((p) => p.join(",")).join(" L ");
  const tailRight = pts.filter((p) => p[0] >= 310);
  const tailLeft = pts.filter((p) => p[0] <= 90);
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <line x1="40" y1="220" x2="360" y2="220" stroke="#1c1b18" strokeOpacity="0.3" />
      <path d={`${curvePath} L 360 220 L 40 220 Z`} fill="#1c1b18" opacity="0.06" />
      <path d={`M 310 220 ${tailRight.map((p) => `L ${p[0]} ${p[1]}`).join(" ")} L 360 220 Z`} fill="#a4622a" opacity="0.3" />
      <path d={`M 40 220 L 90 220 ${tailLeft.map((p) => `L ${p[0]} ${p[1]}`).join(" ")} Z`} fill="#a4622a" opacity="0.3" />
      <text x="320" y="240" fontFamily="Geist Mono, monospace" fontSize="9" fill="#a4622a">p &lt; 0.05</text>
      <path d={curvePath} fill="none" stroke="#1c1b18" strokeWidth="2" />
      <g transform="translate(0, 50)">
        <line x1="180" y1="0" x2="260" y2="0" stroke="#d97757" strokeWidth="2.5" />
        <line x1="180" y1="-6" x2="180" y2="6" stroke="#d97757" strokeWidth="2.5" />
        <line x1="260" y1="-6" x2="260" y2="6" stroke="#d97757" strokeWidth="2.5" />
        <circle cx="220" cy="0" r="4.5" fill="#d97757" />
        <text x="220" y="-12" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#d97757">
          effect size · 95% CI
        </text>
      </g>
      <text x="200" y="285" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.18em">
        SIGNIFICANCE ≠ MAGNITUDE
      </text>
    </svg>
  );
}

// 03 — Database Conversion: two cylinders with schema mapping arrows.
export function DatabaseConvCover() {
  const Cyl = ({
    x, y, color, label, opacity = 1,
  }: { x: number; y: number; color: string; label: string; opacity?: number }) => (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      <ellipse cx="0" cy="0" rx="36" ry="10" fill="none" stroke={color} strokeWidth="1.5" />
      <path d="M -36 0 L -36 60 A 36 10 0 0 0 36 60 L 36 0" fill="none" stroke={color} strokeWidth="1.5" />
      <ellipse cx="0" cy="20" rx="36" ry="10" fill="none" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" />
      <ellipse cx="0" cy="40" rx="36" ry="10" fill="none" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" />
      <text x="0" y="86" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="10" fill={color}>
        {label}
      </text>
    </g>
  );
  const rows: [number, number, number, number][] = [
    [116, 130, 284, 130],
    [116, 150, 284, 150],
    [116, 170, 284, 170],
  ];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <Cyl x={80} y={110} color="#1c1b18" label="MySQL" opacity={0.7} />
      <Cyl x={320} y={110} color="#2a4dbd" label="PostgreSQL" />
      {rows.map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a4dbd" strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="3 3" />
          <polygon points={`${x2 - 1},${y2 - 3} ${x2 + 5},${y2} ${x2 - 1},${y2 + 3}`} fill="#2a4dbd" opacity="0.6" />
        </g>
      ))}
      <text x="200" y="124" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="8" fill="#8a8478">users</text>
      <text x="200" y="144" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="8" fill="#8a8478">orders</text>
      <text x="200" y="164" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="8" fill="#8a8478">events</text>
      <path d="M 116 100 C 200 60, 200 60, 284 100" fill="none" stroke="#2a4dbd" strokeWidth="2" />
      <polygon points="280,98 290,100 280,104" fill="#2a4dbd" />
      <text x="200" y="50" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="10" fill="#2a4dbd">
        migrate · 2.4M rows
      </text>
      <text x="200" y="285" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.18em">
        SCHEMA · MIGRATION · DOWNTIME
      </text>
    </svg>
  );
}

// 04 — Ethical Decision Making: decision tree, ship / stop branches.
export function EthicalDecisionCover() {
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <g transform="translate(200, 50)">
        <rect x="-50" y="-14" width="100" height="28" rx="4" fill="#1c1b18" />
        <text x="0" y="6" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="10" fill="#fff">decision?</text>
      </g>
      <line x1="200" y1="64" x2="110" y2="130" stroke="#1c1b18" strokeWidth="1.5" opacity="0.4" />
      <line x1="200" y1="64" x2="290" y2="130" stroke="#1c1b18" strokeWidth="1.5" opacity="0.4" />
      <g transform="translate(110, 144)">
        <rect x="-46" y="-14" width="92" height="28" rx="4" fill="none" stroke="#3a8a4a" strokeWidth="1.5" />
        <text x="0" y="6" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="10" fill="#3a8a4a">consent ✓</text>
        <line x1="0" y1="14" x2="-30" y2="60" stroke="#3a8a4a" strokeWidth="1" />
        <line x1="0" y1="14" x2="30" y2="60" stroke="#3a8a4a" strokeWidth="1" />
        <circle cx="-30" cy="68" r="6" fill="#3a8a4a" />
        <circle cx="30" cy="68" r="6" fill="#3a8a4a" />
        <text x="0" y="92" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#3a8a4a">ship</text>
      </g>
      <g transform="translate(290, 144)">
        <rect x="-46" y="-14" width="92" height="28" rx="4" fill="none" stroke="#c43838" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="0" y="6" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="10" fill="#c43838">harm? ✕</text>
        <line x1="-6" y1="32" x2="6" y2="44" stroke="#c43838" strokeWidth="2" />
        <line x1="6" y1="32" x2="-6" y2="44" stroke="#c43838" strokeWidth="2" />
        <text x="0" y="92" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#c43838">stop</text>
      </g>
      <text x="200" y="288" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.18em">
        FRAMEWORKS FOR HARDER QUESTIONS
      </text>
    </svg>
  );
}

// 05 — Nashville Airbnb (blog edition): skyline + neighborhood price markers.
export function NashvilleBlogCover() {
  const buildings = [
    { x: 30, w: 28, h: 70 },
    { x: 62, w: 22, h: 110, antenna: true },
    { x: 88, w: 34, h: 80 },
    { x: 126, w: 26, h: 130, antenna: true },
    { x: 156, w: 38, h: 100 },
    { x: 198, w: 22, h: 70 },
    { x: 224, w: 30, h: 120 },
    { x: 258, w: 26, h: 88 },
    { x: 288, w: 36, h: 76 },
    { x: 328, w: 24, h: 102 },
    { x: 356, w: 20, h: 64 },
  ];
  const baseline = 220;
  const markers = [
    { x: 80, val: "$ 92", label: "East" },
    { x: 180, val: "$ 218", label: "Gulch", hi: true },
    { x: 270, val: "$ 145", label: "12 South" },
    { x: 350, val: "$ 88", label: "Hermitage" },
  ];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <circle cx="330" cy="80" r="22" fill="#3a8a4a" opacity="0.08" />
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={baseline - b.h} width={b.w} height={b.h} fill="#1c1b18" opacity={0.8 - (i % 3) * 0.1} />
          {b.antenna && (
            <line x1={b.x + b.w / 2} y1={baseline - b.h} x2={b.x + b.w / 2} y2={baseline - b.h - 14} stroke="#1c1b18" strokeWidth="1.2" />
          )}
          {[...Array(Math.floor(b.h / 14))].map((_, r) =>
            [...Array(Math.floor(b.w / 8))].map((_, c) =>
              (r + c) % 3 === 0 ? (
                <rect
                  key={`${r}-${c}`}
                  x={b.x + 4 + c * 8}
                  y={baseline - b.h + 10 + r * 14}
                  width="3"
                  height="4"
                  fill="#3a8a4a"
                  opacity={0.5 + ((r + c) % 4) * 0.12}
                />
              ) : null,
            ),
          )}
        </g>
      ))}
      <line x1="0" y1={baseline} x2="400" y2={baseline} stroke="#1c1b18" strokeOpacity="0.5" />
      {markers.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={baseline} r="4" fill={m.hi ? "#3a8a4a" : "#1c1b18"} opacity={m.hi ? 1 : 0.5} />
          <line
            x1={m.x}
            y1={baseline}
            x2={m.x}
            y2={baseline + 20}
            stroke={m.hi ? "#3a8a4a" : "#1c1b18"}
            strokeWidth={m.hi ? 1.5 : 0.8}
            strokeDasharray="2 2"
          />
          <text
            x={m.x}
            y={baseline + 36}
            textAnchor="middle"
            fontFamily="Geist Mono, monospace"
            fontSize="10"
            fill={m.hi ? "#3a8a4a" : "#8a8478"}
          >
            {m.val}
          </text>
          <text
            x={m.x}
            y={baseline + 50}
            textAnchor="middle"
            fontFamily="Geist Mono, monospace"
            fontSize="8"
            fill={m.hi ? "#3a8a4a" : "#8a8478"}
            opacity={m.hi ? 1 : 0.7}
          >
            {m.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
