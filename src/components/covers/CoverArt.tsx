/**
 * Per-project cover artwork — pure SVG, no state, no props.
 * Ported from the design handoff (prototypes/cover-art.jsx).
 * Each component fills its container; wrap it in ProjectCover for the
 * 4:3 tinted frame. See ./index.tsx for the slug → component map.
 */
import type { CSSProperties } from "react";

const fill: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

// 01 — Mental Health LLM: paired prompts → unequal responses.
export function MentalHealth() {
  const cols = 18,
    rows = 10;
  const flagged = new Set([
    "3-2", "4-2", "5-2", "9-5", "10-5", "11-5", "13-7", "14-7", "15-7",
  ]);
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <defs>
        <radialGradient id="mh-fade" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#f6f4ef" stopOpacity="1" />
        </radialGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((t, i) => (
        <line
          key={i}
          x1="20"
          x2="380"
          y1={40 + t * 220}
          y2={40 + t * 220}
          stroke="#1c1b18"
          strokeOpacity="0.06"
          strokeDasharray="2 4"
        />
      ))}
      {[...Array(rows)].map((_, r) =>
        [...Array(cols)].map((_, c) => {
          const isFlag = flagged.has(`${c}-${r}`);
          return (
            <circle
              key={`${r}-${c}`}
              cx={28 + c * 19}
              cy={36 + r * 24}
              r={isFlag ? 3.5 : 1.6}
              fill={isFlag ? "#d97757" : "#1c1b18"}
              opacity={isFlag ? 1 : 0.32}
            />
          );
        }),
      )}
      <rect x="0" y="0" width="400" height="300" fill="url(#mh-fade)" opacity="0.5" />
      <g stroke="#d97757" strokeWidth="1.2" fill="none">
        <path d="M22 130 L18 130 L18 178 L22 178" />
        <path d="M378 130 L382 130 L382 178 L378 178" />
      </g>
      <text x="200" y="288" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.18em">
        PAIRED-PROMPT FAIRNESS · 6 MODELS × 12 DEMOGRAPHIC AXES
      </text>
    </svg>
  );
}

// 02 — Airline: seat map from above + price curve.
export function Airline() {
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <rect x="40" y="60" width="320" height="180" rx="90" fill="none" stroke="#c98a00" strokeOpacity="0.35" strokeWidth="1.2" />
      {[...Array(10)].map((_, c) => {
        const x = 70 + c * 28;
        return (
          <g key={c}>
            {[0, 1, 2, 3, 4, 5].map((r) => {
              const y = 90 + r * 24;
              const cls = r < 2 ? "first" : r < 4 ? "biz" : "econ";
              const f = cls === "first" ? "#c98a00" : "#1c1b18";
              const o = cls === "first" ? 0.85 : cls === "biz" ? 0.55 : 0.18;
              if (r === 2) return null;
              return <rect key={r} x={x} y={y} width={20} height={14} rx={2} fill={f} opacity={o} />;
            })}
          </g>
        );
      })}
      <path d="M40 220 C 120 200, 180 170, 230 140 S 340 70, 380 50" fill="none" stroke="#c98a00" strokeWidth="2" />
      <circle cx="380" cy="50" r="3.5" fill="#c98a00" />
      <text x="384" y="48" fontFamily="Geist Mono, monospace" fontSize="9" fill="#c98a00">+6.4%</text>
      <text x="200" y="280" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.18em">
        DYNAMIC SEAT-CLASS ALLOCATION
      </text>
    </svg>
  );
}

// 03 — F1: track silhouette + sector lap line.
export function F1() {
  const track =
    "M50 200 C 50 120, 130 60, 220 80 S 360 140, 350 200 C 340 250, 240 260, 180 240 S 60 250, 50 200 Z";
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <path d={track} fill="none" stroke="#3a3a3a" strokeWidth="22" strokeLinejoin="round" />
      <path d={track} fill="none" stroke="#e84a4a" strokeWidth="2" strokeDasharray="6 8" />
      {([[110, 80], [220, 76], [330, 130], [350, 215], [240, 252], [120, 248]] as const).map(
        ([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#e84a4a" />
            <text x={x + 8} y={y + 4} fontFamily="Geist Mono, monospace" fontSize="9" fill="#e84a4a">
              S{i + 1}
            </text>
          </g>
        ),
      )}
      <rect x="46" y="190" width="8" height="20" fill="#fff" />
      <text x="200" y="290" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#5a554a" letterSpacing="0.18em">
        FINISHING POSITION · MAE 1.8
      </text>
    </svg>
  );
}

// 04 — Nashville: river through neighborhood grid, hotspots.
export function Nashville() {
  const river =
    "M40 40 C 120 90, 100 140, 170 160 S 280 200, 260 260 L 270 280";
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      {[...Array(12)].map((_, i) => (
        <line key={`v${i}`} x1={20 + i * 32} x2={20 + i * 32} y1="30" y2="270" stroke="#3a8a4a" strokeOpacity="0.12" strokeWidth="1" />
      ))}
      {[...Array(8)].map((_, i) => (
        <line key={`h${i}`} x1="20" x2="400" y1={30 + i * 32} y2={30 + i * 32} stroke="#3a8a4a" strokeOpacity="0.12" strokeWidth="1" />
      ))}
      <path d={river} fill="none" stroke="#3a8a4a" strokeWidth="9" strokeOpacity="0.18" strokeLinecap="round" />
      <path d={river} fill="none" stroke="#3a8a4a" strokeWidth="1.5" strokeOpacity="0.6" />
      {([[80, 80, 12, 0.45], [120, 130, 22, 0.85], [210, 110, 16, 0.65], [280, 160, 28, 1], [240, 220, 14, 0.55], [330, 90, 10, 0.4]] as const).map(
        ([x, y, r, o], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill="#3a8a4a" opacity={o * 0.25} />
            <circle cx={x} cy={y} r="2.6" fill="#3a8a4a" />
          </g>
        ),
      )}
      <text x="200" y="290" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#5a8a5e" letterSpacing="0.18em">
        12 NEIGHBORHOODS · 2.3× SPREAD
      </text>
    </svg>
  );
}

// 05 — Portfolio Optimization: efficient frontier + optimal point.
export function Portfolio() {
  const scatter: [number, number][] = [
    [80, 210], [100, 200], [120, 180], [110, 220], [140, 170], [160, 160],
    [150, 200], [180, 150], [200, 140], [220, 130], [195, 170], [230, 160],
    [250, 120], [270, 110], [290, 130], [280, 160], [300, 150], [260, 180],
    [210, 190], [170, 210], [130, 210], [320, 140], [340, 170], [300, 200],
  ];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <line x1="50" y1="240" x2="370" y2="240" stroke="#1c1b18" strokeOpacity="0.25" />
      <line x1="50" y1="40" x2="50" y2="240" stroke="#1c1b18" strokeOpacity="0.25" />
      {scatter.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill="#1c1b18" opacity="0.35" />
      ))}
      <path d="M70 230 Q 130 170, 200 120 T 360 70" fill="none" stroke="#2a4dbd" strokeWidth="2" />
      <circle cx="230" cy="100" r="8" fill="#2a4dbd" opacity="0.18" />
      <circle cx="230" cy="100" r="3.5" fill="#2a4dbd" />
      <text x="240" y="98" fontFamily="Geist Mono, monospace" fontSize="9" fill="#2a4dbd">tangency</text>
      <text x="370" y="258" textAnchor="end" fontFamily="Geist Mono, monospace" fontSize="9" fill="#1c1b18" opacity="0.55">σ (risk) →</text>
      <text x="56" y="48" fontFamily="Geist Mono, monospace" fontSize="9" fill="#1c1b18" opacity="0.55">↑ μ (return)</text>
      <text x="200" y="285" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.18em">
        MEAN-VARIANCE · BLACK-LITTERMAN
      </text>
    </svg>
  );
}

// 06 — Restaurant reviews: token bars + stars.
export function Restaurant() {
  const tokens = ["service", "salt", "atmosphere", "wait", "view", "price", "portion", "music"];
  const widths = [0.85, 0.42, 0.78, 0.28, 0.66, 0.36, 0.74, 0.5];
  const sentiment = [1, -1, 1, -1, 1, -1, 1, 0];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <g transform="translate(50,32)">
        {[0, 1, 2, 3, 4].map((i) => (
          <polygon
            key={i}
            points="0,-7 2,-2 7.5,-2 3,1 5,7 0,3 -5,7 -3,1 -7.5,-2 -2,-2"
            transform={`translate(${i * 22}, 8)`}
            fill="#a4622a"
            opacity={i < 4 ? 1 : 0.2}
          />
        ))}
        <text x="120" y="14" fontFamily="Geist Mono, monospace" fontSize="11" fill="#a4622a">4.1 / 5 · n=2,148</text>
      </g>
      {tokens.map((tok, i) => (
        <g key={tok} transform={`translate(50, ${75 + i * 22})`}>
          <text x="0" y="10" fontFamily="Geist Mono, monospace" fontSize="11" fill="#1c1b18" opacity="0.75">{tok}</text>
          <rect
            x="90"
            y="2"
            width={widths[i] * 240}
            height="9"
            rx="1"
            fill={sentiment[i] > 0 ? "#a4622a" : sentiment[i] < 0 ? "#1c1b18" : "#a8a395"}
            opacity={sentiment[i] !== 0 ? 0.85 : 0.5}
          />
          <text x={94 + widths[i] * 240} y="10" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478">
            {sentiment[i] > 0 ? "+" : sentiment[i] < 0 ? "−" : "·"}
          </text>
        </g>
      ))}
    </svg>
  );
}

// 07 — Attrition: org dots + Sankey flow leaving.
export function Attrition() {
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      {[...Array(8)].map((_, r) =>
        [...Array(10)].map((_, c) => {
          const x = 36 + c * 24,
            y = 40 + r * 22;
          const isLeaving = c === 9 && (r === 1 || r === 3 || r === 5 || r === 6);
          return (
            <circle
              key={`${r}-${c}`}
              cx={x}
              cy={y}
              r={isLeaving ? 4 : 3}
              fill={isLeaving ? "#6e4ba8" : "#1c1b18"}
              opacity={isLeaving ? 1 : 0.25}
            />
          );
        }),
      )}
      {[62, 106, 150, 172].map((y, i) => (
        <path
          key={i}
          d={`M280 ${y} C 320 ${y}, 340 220, 380 ${230 + i * 10}`}
          fill="none"
          stroke="#6e4ba8"
          strokeWidth="2.2"
          strokeOpacity="0.6"
        />
      ))}
      <rect x="370" y="218" width="22" height="62" rx="2" fill="#6e4ba8" opacity="0.85" />
      <text x="368" y="212" textAnchor="end" fontFamily="Geist Mono, monospace" fontSize="9" fill="#6e4ba8">14.2% / yr →</text>
      <text x="200" y="290" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.18em">
        SHAP-EXPLAINED CHURN MODEL
      </text>
    </svg>
  );
}

// 08 — Car sales: silhouettes + price-vs-volume curve.
export function Cars() {
  const Car = ({ x, y, scale = 1, opacity = 1 }: { x: number; y: number; scale?: number; opacity?: number }) => (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
      <path
        d="M0 16 L8 4 L26 4 L36 0 L60 0 L72 8 L88 8 L92 16 L92 22 L78 22 A6 6 0 0 0 66 22 L26 22 A6 6 0 0 0 14 22 L0 22 Z"
        fill="#1c1b18"
      />
      <circle cx="20" cy="22" r="5" fill="#1c1b18" />
      <circle cx="72" cy="22" r="5" fill="#1c1b18" />
      <circle cx="20" cy="22" r="2" fill="#f6f4ef" />
      <circle cx="72" cy="22" r="2" fill="#f6f4ef" />
    </g>
  );
  const cars: [number, number, number, number][] = [
    [40, 140, 0.55, 0.18], [120, 130, 0.7, 0.32], [70, 180, 0.6, 0.25],
    [180, 168, 0.85, 0.55], [260, 150, 0.95, 0.85], [260, 210, 0.55, 0.2],
    [340, 180, 0.75, 0.45], [40, 220, 0.6, 0.22], [180, 230, 0.8, 0.55],
  ];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <path d="M30 80 C 100 60, 160 100, 220 70 S 360 50, 380 80" fill="none" stroke="#1c1b18" strokeOpacity="0.35" strokeWidth="1.6" strokeDasharray="3 4" />
      {cars.map(([x, y, s, o], i) => (
        <Car key={i} x={x} y={y} scale={s} opacity={o} />
      ))}
      <rect x="248" y="142" width="92" height="36" fill="none" stroke="#1c1b18" strokeWidth="1" strokeDasharray="2 3" />
      <text x="294" y="138" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#1c1b18">premium SUVs</text>
      <text x="200" y="288" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.18em">
        SEGMENT × PRICE × VOLUME
      </text>
    </svg>
  );
}

// 09 — Birds: migration arc made of dots + bird silhouette.
export function Birds() {
  const dots: [number, number, number][] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    dots.push([40 + t * 320, 200 - Math.sin(t * Math.PI) * 110, t]);
  }
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      {dots.map(([x, y, t], i) => (
        <circle key={i} cx={x} cy={y} r={1.5 + t * 1.8} fill="#2a8a8a" opacity={0.25 + t * 0.6} />
      ))}
      <g transform="translate(195, 85) scale(1.2)">
        <path
          d="M0 0 C -10 -8, -22 -8, -30 -2 C -22 -4, -14 -3, -8 0 C -14 1, -20 5, -22 10 C -16 6, -10 5, -4 6 C -1 4, 1 4, 4 6 C 10 5, 16 6, 22 10 C 20 5, 14 1, 8 0 C 14 -3, 22 -4, 30 -2 C 22 -8, 10 -8, 0 0 Z"
          fill="#1c1b18"
        />
      </g>
      <circle cx="40" cy="200" r="4" fill="#2a8a8a" />
      <circle cx="360" cy="200" r="4" fill="#2a8a8a" />
      <text x="40" y="220" fontFamily="Geist Mono, monospace" fontSize="9" fill="#2a8a8a">winter</text>
      <text x="360" y="220" textAnchor="end" fontFamily="Geist Mono, monospace" fontSize="9" fill="#2a8a8a">summer</text>
      <text x="200" y="280" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#5a8a5e" letterSpacing="0.18em">
        eBIRD · 48 SPECIES · 6 YR
      </text>
    </svg>
  );
}

// 10 — Internet usage: world dot-map + adoption curves.
export function Internet() {
  const dotMap: [number, number][] = [];
  const blobs: [number, number, number, number][] = [
    [80, 80, 50, 30], [110, 180, 28, 50], [200, 70, 30, 22],
    [220, 140, 36, 50], [280, 90, 70, 40], [320, 200, 30, 18],
  ];
  const land = (x: number, y: number) =>
    blobs.some(([bx, by, rx, ry]) => (x - bx) ** 2 / (rx * rx) + (y - by) ** 2 / (ry * ry) < 1);
  for (let y = 30; y < 220; y += 9) {
    for (let x = 20; x < 380; x += 9) {
      if (land(x, y)) dotMap.push([x, y]);
    }
  }
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      {dotMap.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="#5ec8c2" opacity={0.45 + (i % 5) * 0.08} />
      ))}
      <g transform="translate(0, 230)">
        <path d="M20 40 C 80 38, 120 30, 180 18 S 320 4, 380 2" fill="none" stroke="#5ec8c2" strokeWidth="1.6" />
        <path d="M20 46 C 80 44, 120 38, 180 28 S 320 14, 380 10" fill="none" stroke="#5ec8c2" strokeWidth="1.4" opacity="0.6" />
        <path d="M20 52 C 80 50, 120 46, 180 38 S 320 26, 380 20" fill="none" stroke="#5ec8c2" strokeWidth="1.2" opacity="0.35" />
      </g>
      <text x="200" y="294" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#5ec8c2" letterSpacing="0.18em">
        ADOPTION · 1990 → 2022
      </text>
    </svg>
  );
}

// 11 — Lyft: block plan with pickup density heat.
export function Lyft() {
  const pins: [number, number][] = [
    [170, 90], [200, 110], [220, 80], [180, 130], [240, 140],
    [200, 160], [160, 110], [230, 110], [190, 100],
  ];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      {[...Array(8)].map((_, r) =>
        [...Array(11)].map((_, c) => {
          const dx = c * 32 + 28,
            dy = r * 28 + 24;
          const dist = Math.sqrt((c - 5) ** 2 + (r - 3) ** 2);
          const heat = Math.max(0, 1 - dist / 4);
          return (
            <rect key={`${r}-${c}`} x={dx} y={dy} width={22} height={18} rx={1.5} fill="#e0457b" opacity={0.07 + heat * 0.55} />
          );
        }),
      )}
      {pins.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.2" fill="#e0457b" />
          <circle cx={x} cy={y} r="9" fill="#e0457b" opacity="0.18" />
        </g>
      ))}
      <path d="M70 220 Q 180 200, 240 140 T 360 60" fill="none" stroke="#1c1b18" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="70" cy="220" r="4" fill="#1c1b18" />
      <circle cx="360" cy="60" r="4" fill="#e0457b" />
      <text x="200" y="290" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.18em">
        PICKUP DENSITY · MARKET STUDY
      </text>
    </svg>
  );
}

// 12 — PT-Assist: pose skeleton with YOLO keypoints, knee angle, rep counter.
export function PTAssist() {
  const joints: Record<string, [number, number]> = {
    head: [200, 70], nose: [200, 75],
    lsh: [180, 105], rsh: [220, 105],
    lel: [165, 140], rel: [235, 140],
    lwr: [155, 175], rwr: [245, 175],
    hip: [200, 160], lhip: [188, 162], rhip: [212, 162],
    lkn: [175, 215], rkn: [225, 215],
    lan: [170, 260], ran: [230, 260],
  };
  const skel: [string, string][] = [
    ["lsh", "rsh"], ["lsh", "lel"], ["lel", "lwr"], ["rsh", "rel"], ["rel", "rwr"],
    ["lsh", "lhip"], ["rsh", "rhip"], ["lhip", "rhip"],
    ["lhip", "lkn"], ["lkn", "lan"], ["rhip", "rkn"], ["rkn", "ran"],
  ];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      {[0.25, 0.5, 0.75].map((t, i) => (
        <line key={`v${i}`} x1={400 * t} x2={400 * t} y1="0" y2="300" stroke="#2a6fc4" strokeOpacity="0.06" />
      ))}
      {[0.25, 0.5, 0.75].map((t, i) => (
        <line key={`h${i}`} x1="0" x2="400" y1={300 * t} y2={300 * t} stroke="#2a6fc4" strokeOpacity="0.06" />
      ))}
      {([[18, 18, 1, 1], [382, 18, -1, 1], [18, 282, 1, -1], [382, 282, -1, -1]] as const).map(
        ([x, y, dx, dy], i) => (
          <g key={i} stroke="#2a6fc4" strokeWidth="1.5" strokeOpacity="0.7" fill="none">
            <line x1={x} y1={y} x2={x + 14 * dx} y2={y} />
            <line x1={x} y1={y} x2={x} y2={y + 14 * dy} />
          </g>
        ),
      )}
      {skel.map(([a, b], i) => (
        <line key={i} x1={joints[a][0]} y1={joints[a][1]} x2={joints[b][0]} y2={joints[b][1]} stroke="#1c1b18" strokeWidth="2" />
      ))}
      <circle cx={joints.head[0]} cy={joints.head[1]} r="14" fill="none" stroke="#1c1b18" strokeWidth="2" />
      {Object.values(joints).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="#2a6fc4" opacity="0.18" />
          <circle cx={x} cy={y} r="2.6" fill="#2a6fc4" />
        </g>
      ))}
      <path
        d={`M ${joints.lhip[0]} ${joints.lhip[1]} L ${joints.lkn[0]} ${joints.lkn[1]} L ${joints.lan[0]} ${joints.lan[1]}`}
        fill="none"
        stroke="#2a6fc4"
        strokeWidth="3"
        strokeOpacity="0.4"
      />
      <text x={joints.lkn[0] - 26} y={joints.lkn[1] + 4} fontFamily="Geist Mono, monospace" fontSize="10" fill="#2a6fc4">94°</text>
      <g transform="translate(290, 32)">
        <rect x="0" y="0" width="86" height="36" rx="4" fill="#1c1b18" />
        <text x="10" y="14" fontFamily="Geist Mono, monospace" fontSize="8" fill="#9c9889" letterSpacing="0.12em">REP · FORM</text>
        <text x="10" y="30" fontFamily="Geist Mono, monospace" fontSize="14" fill="#fff">07 · OK</text>
      </g>
      <text x="200" y="288" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#2a6fc4" letterSpacing="0.18em">
        YOLO11 POSE · REAL-TIME FORM CHECK
      </text>
    </svg>
  );
}

// 13 — Saban Realty: Saba island silhouette + Mt. Scenery + property pin.
export function Saba() {
  const island =
    "M 80 200 C 100 195, 110 190, 130 188 C 150 186, 165 165, 180 130 C 195 90, 210 70, 220 80 C 232 95, 240 130, 255 155 C 270 178, 290 188, 310 192 C 330 195, 340 200, 320 205";
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      {[...Array(7)].map((_, i) => (
        <path
          key={i}
          d={`M 0 ${190 + i * 14} Q 50 ${186 + i * 14}, 100 ${190 + i * 14} T 200 ${190 + i * 14} T 300 ${190 + i * 14} T 400 ${190 + i * 14}`}
          fill="none"
          stroke="#0f6b5e"
          strokeOpacity="0.18"
          strokeWidth="1"
        />
      ))}
      <path d={`${island} L 320 205 L 80 205 Z`} fill="#0f6b5e" opacity="0.18" />
      <path d={island} fill="none" stroke="#0f6b5e" strokeWidth="1.8" />
      <line x1="220" y1="80" x2="280" y2="50" stroke="#0f6b5e" strokeWidth="1" strokeDasharray="2 3" />
      <text x="284" y="48" fontFamily="Geist Mono, monospace" fontSize="9" fill="#0f6b5e">Mt. Scenery · 877m</text>
      <g transform="translate(160, 175)">
        <path d="M 0 0 C -8 -8, -8 -20, 0 -22 C 8 -20, 8 -8, 0 0 Z" fill="#0f6b5e" />
        <circle cx="0" cy="-14" r="3.5" fill="#fff" />
        <line x1="0" y1="0" x2="0" y2="8" stroke="#0f6b5e" strokeWidth="1" strokeDasharray="1 2" />
      </g>
      <text x="170" y="184" fontFamily="Geist Mono, monospace" fontSize="9" fill="#0f6b5e">Windwardside</text>
      <text x="20" y="42" fontFamily="Geist Mono, monospace" fontSize="10" fill="#0f6b5e" opacity="0.7">17.63°N</text>
      <text x="20" y="56" fontFamily="Geist Mono, monospace" fontSize="10" fill="#0f6b5e" opacity="0.7">63.23°W</text>
      <g transform="translate(355, 50)">
        <circle r="14" fill="none" stroke="#0f6b5e" strokeWidth="0.8" opacity="0.6" />
        <line x1="0" y1="-12" x2="0" y2="12" stroke="#0f6b5e" strokeWidth="0.8" opacity="0.6" />
        <line x1="-12" y1="0" x2="12" y2="0" stroke="#0f6b5e" strokeWidth="0.8" opacity="0.6" />
        <text x="0" y="-16" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="8" fill="#0f6b5e">N</text>
      </g>
      <text x="200" y="288" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#0f6b5e" letterSpacing="0.18em">
        SABA · 5 SQ MI · NETHERLANDS ANTILLES
      </text>
    </svg>
  );
}

// 14 — Letterboxd random: film card flipper.
export function Letterboxd() {
  const Card = ({
    x, y, rot, cardFill, opacity, dot1, dot2, dot3,
  }: {
    x: number; y: number; rot: number; cardFill: string; opacity: number;
    dot1: string; dot2: string; dot3: string;
  }) => (
    <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={opacity}>
      <rect x="-32" y="-46" width="64" height="92" rx="4" fill={cardFill} />
      <rect x="-32" y="-46" width="64" height="92" rx="4" fill="none" stroke="#5ec8c2" strokeOpacity="0.15" />
      <rect x="-22" y="-36" width="44" height="48" rx="2" fill="#5ec8c2" opacity="0.08" />
      <circle cx="-14" cy="22" r="2" fill={dot1} />
      <circle cx="-7" cy="22" r="2" fill={dot2} />
      <circle cx="0" cy="22" r="2" fill={dot3} />
      <circle cx="7" cy="22" r="2" fill="#3a3a3a" />
      <circle cx="14" cy="22" r="2" fill="#3a3a3a" />
      <rect x="-22" y="32" width="34" height="2" rx="1" fill="#fff" opacity="0.4" />
    </g>
  );
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <path d="M 80 60 Q 140 30, 220 60" fill="none" stroke="#ff8000" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
      <path d="M 200 240 Q 280 270, 340 240" fill="none" stroke="#ff8000" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
      <Card x={120} y={150} rot={-14} cardFill="#2a2a2a" opacity={0.55} dot1="#3a3a3a" dot2="#3a3a3a" dot3="#3a3a3a" />
      <Card x={280} y={150} rot={11} cardFill="#2a2a2a" opacity={0.6} dot1="#3a3a3a" dot2="#3a3a3a" dot3="#3a3a3a" />
      <g>
        <Card x={200} y={150} rot={-2} cardFill="#262625" opacity={1} dot1="#ff8000" dot2="#ff8000" dot3="#ff8000" />
        <rect x="166" y="100" width="68" height="96" rx="5" fill="none" stroke="#ff8000" strokeWidth="1.5" transform="rotate(-2 200 150)" />
      </g>
      <g transform="translate(40, 252)">
        <rect width="24" height="24" rx="5" fill="none" stroke="#ff8000" strokeWidth="1.5" />
        <circle cx="7" cy="7" r="1.8" fill="#ff8000" />
        <circle cx="17" cy="7" r="1.8" fill="#ff8000" />
        <circle cx="12" cy="12" r="1.8" fill="#ff8000" />
        <circle cx="7" cy="17" r="1.8" fill="#ff8000" />
        <circle cx="17" cy="17" r="1.8" fill="#ff8000" />
      </g>
      <text x="74" y="269" fontFamily="Geist Mono, monospace" fontSize="11" fill="#ff8000">→ pick one</text>
      <text x="200" y="288" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#9c9889" letterSpacing="0.18em">
        CLOUDFLARE WORKER · LIVE TOOL
      </text>
    </svg>
  );
}

// 15 — AI Sports Commentary: stadium + speech bubble + waveform.
export function Commentary() {
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <ellipse cx="200" cy="270" rx="180" ry="36" fill="#8a3a00" opacity="0.08" />
      <ellipse cx="200" cy="270" rx="140" ry="26" fill="#8a3a00" opacity="0.1" />
      <ellipse cx="200" cy="270" rx="96" ry="18" fill="#8a3a00" opacity="0.12" />
      <ellipse cx="200" cy="270" rx="50" ry="10" fill="none" stroke="#8a3a00" strokeWidth="1" strokeOpacity="0.45" />
      <line x1="200" y1="262" x2="200" y2="278" stroke="#8a3a00" strokeOpacity="0.45" />
      <g transform="translate(60, 50)">
        <rect x="0" y="0" width="200" height="60" rx="6" fill="#fff" stroke="#8a3a00" strokeOpacity="0.4" />
        <text x="14" y="22" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a3a00" letterSpacing="0.12em">▎AI COMMENTATOR</text>
        <text x="14" y="40" fontFamily="Inter, sans-serif" fontSize="11" fill="#1c1b18">&quot;Third down, two yards.</text>
        <text x="14" y="54" fontFamily="Inter, sans-serif" fontSize="11" fill="#1c1b18">Shotgun. He&apos;s looking deep—&quot;</text>
        <path d="M30 60 L 38 70 L 50 60 Z" fill="#fff" stroke="#8a3a00" strokeOpacity="0.4" />
      </g>
      <g transform="translate(40, 150)">
        {Array.from({ length: 60 }).map((_, i) => {
          const h = 4 + Math.abs(Math.sin(i * 0.4) * 18 + Math.cos(i * 0.7) * 8);
          return (
            <rect key={i} x={i * 5.5} y={20 - h / 2} width="2" height={h} rx="1" fill="#8a3a00" opacity={0.6 + Math.sin(i * 0.3) * 0.3} />
          );
        })}
      </g>
      <text x="50" y="200" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a3a00" letterSpacing="0.12em">▎HUME TTS · 1.2s LATENCY</text>
      <g transform="translate(280, 130)">
        <rect width="92" height="22" rx="3" fill="#8a3a00" opacity="0.12" />
        <text x="10" y="15" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a3a00">RAG · 18K plays</text>
      </g>
      <text x="200" y="290" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a3a00" letterSpacing="0.18em">
        LLM · TTS · RAG PIPELINE
      </text>
    </svg>
  );
}

// 16 — FraudGuard-AI: transaction stream + score gauge.
export function FraudGuard() {
  const txns = [
    { v: 24.5, ok: true }, { v: 187.2, ok: true }, { v: 3.99, ok: true },
    { v: 9842.0, ok: false }, { v: 56.3, ok: true }, { v: 412.8, ok: true },
    { v: 19.99, ok: true }, { v: 78.45, ok: true },
  ];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <g transform="translate(80, 100)">
        <path d="M -50 0 A 50 50 0 0 1 50 0" fill="none" stroke="#e5e1d6" strokeWidth="10" strokeLinecap="round" />
        <path d="M -50 0 A 50 50 0 0 1 38 -32" fill="none" stroke="#c43838" strokeWidth="10" strokeLinecap="round" />
        <line x1="0" y1="0" x2="32" y2="-38" stroke="#1c1b18" strokeWidth="2.5" strokeLinecap="round" />
        <circle r="4" fill="#1c1b18" />
        <text x="0" y="22" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#1c1b18" letterSpacing="0.12em">RISK SCORE</text>
        <text x="0" y="40" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="22" fill="#c43838">0.94</text>
      </g>
      <g transform="translate(180, 50)">
        <text x="0" y="0" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.12em">▎LIVE STREAM</text>
        {txns.map((t, i) => {
          const y = 12 + i * 24;
          return (
            <g key={i} opacity={t.ok ? 0.5 : 1}>
              <rect
                x="0" y={y} width="180" height="18" rx="3"
                fill={t.ok ? "#fff" : "#fde8e8"}
                stroke={t.ok ? "#e5e1d6" : "#c43838"}
                strokeOpacity={t.ok ? 1 : 0.7}
              />
              <circle cx="10" cy={y + 9} r="3" fill={t.ok ? "#3a8a4a" : "#c43838"} />
              <text x="22" y={y + 13} fontFamily="Geist Mono, monospace" fontSize="10" fill="#1c1b18">
                txn_{(7461 + i).toString(16)}
              </text>
              <text x="170" y={y + 13} textAnchor="end" fontFamily="Geist Mono, monospace" fontSize="10" fill={t.ok ? "#5a554a" : "#c43838"}>
                ${t.v.toFixed(2)}
              </text>
              {!t.ok && (
                <text x="186" y={y + 13} fontFamily="Geist Mono, monospace" fontSize="9" fill="#c43838">⚑</text>
              )}
            </g>
          );
        })}
      </g>
      <text x="200" y="288" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.18em">
        XGBOOST · FASTAPI · LIVE DASHBOARD
      </text>
    </svg>
  );
}

// 17 — Hume Voice Demo: radial waveform + two model chips.
export function HumeVoice() {
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <g transform="translate(200, 150)">
        {Array.from({ length: 64 }).map((_, i) => {
          const angle = (i / 64) * Math.PI * 2 - Math.PI / 2;
          const len = 18 + Math.abs(Math.sin(i * 0.5) * 28 + Math.cos(i * 0.31) * 14);
          return (
            <line
              key={i}
              x1={Math.cos(angle) * 64}
              y1={Math.sin(angle) * 64}
              x2={Math.cos(angle) * (64 + len)}
              y2={Math.sin(angle) * (64 + len)}
              stroke="#6e4ba8"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity={0.4 + Math.sin(i * 0.4) * 0.3}
            />
          );
        })}
        <circle r="56" fill="none" stroke="#6e4ba8" strokeWidth="0.8" opacity="0.4" />
        <circle r="48" fill="#6e4ba8" opacity="0.08" />
        <circle r="6" fill="#6e4ba8" />
      </g>
      <g transform="translate(36, 36)">
        <rect width="80" height="26" rx="13" fill="#6e4ba8" />
        <text x="14" y="17" fontFamily="Geist Mono, monospace" fontSize="10" fill="#fff">● Claude</text>
      </g>
      <g transform="translate(120, 36)">
        <rect width="80" height="26" rx="13" fill="none" stroke="#6e4ba8" strokeWidth="1" />
        <text x="14" y="17" fontFamily="Geist Mono, monospace" fontSize="10" fill="#6e4ba8">○ GPT-4</text>
      </g>
      <text x="208" y="50" fontFamily="Geist Mono, monospace" fontSize="14" fill="#6e4ba8">⇄</text>
      <text x="232" y="50" fontFamily="Geist Mono, monospace" fontSize="11" fill="#6e4ba8">live swap</text>
      <text x="200" y="288" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#6e4ba8" letterSpacing="0.18em">
        VOICE AGENT · STREAMLIT
      </text>
    </svg>
  );
}

// 18 — Marvel Rivals Assistant: hex grid of heroes, optimal team highlighted.
export function MarvelRivals() {
  const cols = 7,
    rows = 5,
    r = 17;
  const dx = r * Math.sqrt(3);
  const dy = r * 1.5;
  const suggested = new Set(["2-1", "3-2", "4-1"]);
  const hexes: { x: number; y: number; key: string; suggested: boolean }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      hexes.push({
        x: 50 + col * dx + (row % 2 === 1 ? dx / 2 : 0),
        y: 60 + row * dy,
        key: `${col}-${row}`,
        suggested: suggested.has(`${col}-${row}`),
      });
    }
  }
  const hexPath = (cx: number, cy: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return "M " + pts.join(" L ") + " Z";
  };
  const at = (key: string) => hexes.find((h) => h.key === key)!;
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      {hexes.map((h) => (
        <g key={h.key}>
          <path
            d={hexPath(h.x, h.y)}
            fill={h.suggested ? "#e0457b" : "#1c1b18"}
            fillOpacity={h.suggested ? 0.85 : 0.08}
            stroke={h.suggested ? "#e0457b" : "#1c1b18"}
            strokeWidth="1"
            strokeOpacity={h.suggested ? 1 : 0.25}
          />
          {h.suggested && <circle cx={h.x} cy={h.y} r="4" fill="#fff" />}
        </g>
      ))}
      <g stroke="#e0457b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" fill="none">
        <line x1={at("2-1").x} y1={at("2-1").y} x2={at("3-2").x} y2={at("3-2").y} />
        <line x1={at("3-2").x} y1={at("3-2").y} x2={at("4-1").x} y2={at("4-1").y} />
      </g>
      <g transform="translate(40, 250)">
        <rect width="180" height="28" rx="14" fill="#1c1b18" />
        <circle cx="14" cy="14" r="4" fill="#e0457b" />
        <text x="26" y="18" fontFamily="Geist Mono, monospace" fontSize="11" fill="#fff">SUGGESTED · 92% synergy</text>
      </g>
      <text x="360" y="290" textAnchor="end" fontFamily="Geist Mono, monospace" fontSize="9" fill="#8a8478" letterSpacing="0.18em">
        TEAM COMP · LLM ADVISOR
      </text>
    </svg>
  );
}

// 19 — Bison Chat: LLM router diagram, prompt fans out to 3 models.
export function BisonChat() {
  const models = [
    { label: "haiku", y: 80, selected: false },
    { label: "sonnet", y: 140, selected: true },
    { label: "opus", y: 200, selected: false },
  ];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <g transform="translate(40, 140)">
        <rect width="80" height="28" rx="4" fill="#1c2b5e" />
        <text x="40" y="18" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="10" fill="#fff">prompt</text>
      </g>
      <g transform="translate(170, 140)">
        <rect width="60" height="28" rx="4" fill="none" stroke="#1c2b5e" strokeWidth="1.5" />
        <text x="30" y="18" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="10" fill="#1c2b5e">router</text>
        <g transform="translate(30, -12)">
          <ellipse cx="0" cy="0" rx="14" ry="7" fill="#1c2b5e" />
          <ellipse cx="-9" cy="-3" rx="6" ry="5" fill="#1c2b5e" />
          <line x1="-12" y1="-7" x2="-15" y2="-12" stroke="#1c2b5e" strokeWidth="1.6" />
          <line x1="-7" y1="-7" x2="-9" y2="-12" stroke="#1c2b5e" strokeWidth="1.6" />
        </g>
      </g>
      {models.map((m) => (
        <g key={m.label}>
          <line
            x1="230" y1="154" x2="290" y2={m.y + 14}
            stroke="#1c2b5e"
            strokeWidth={m.selected ? 2.5 : 1}
            strokeOpacity={m.selected ? 0.9 : 0.3}
            strokeDasharray={m.selected ? "0" : "3 4"}
          />
          <g transform={`translate(290, ${m.y})`}>
            <rect width="90" height="28" rx="4" fill={m.selected ? "#1c2b5e" : "#fff"} stroke="#1c2b5e" strokeWidth="1.2" />
            <text x="45" y="18" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="10" fill={m.selected ? "#fff" : "#1c2b5e"}>
              {m.label}
            </text>
          </g>
          {m.selected && (
            <text x="385" y="158" fontFamily="Geist Mono, monospace" fontSize="14" fill="#1c2b5e">✓</text>
          )}
        </g>
      ))}
      <line x1="120" y1="154" x2="168" y2="154" stroke="#1c2b5e" strokeWidth="1.5" />
      <polygon points="166,154 162,151 162,157" fill="#1c2b5e" />
      <text x="200" y="290" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" fill="#1c2b5e" letterSpacing="0.18em">
        LLM PROXY · LIPSCOMB TEACHING DEMO
      </text>
    </svg>
  );
}

// 20 — Physics Museum: parabolic trajectory on a faint physics grid + equation
// label, with a tiny ramp + ball corner motif.
export function PhysicsMuseum() {
  const accent = "#7ba4ff";
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= 60; i++) {
    const x = 40 + i * 5.5;
    const t = i;
    const yPhys = -0.0035 * t * t + 0.21 * t;
    const y = 230 - yPhys * 110;
    pts.push([x, y]);
  }
  const path = "M " + pts.map((p) => p.join(",")).join(" L ");
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={40 + i * 32}
          x2={40 + i * 32}
          y1="20"
          y2="240"
          stroke={accent}
          strokeOpacity="0.08"
        />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1="40"
          x2="360"
          y1={20 + i * 36}
          y2={20 + i * 36}
          stroke={accent}
          strokeOpacity="0.08"
        />
      ))}
      <line x1="40" y1="230" x2="360" y2="230" stroke={accent} strokeOpacity="0.45" />
      <line x1="40" y1="20" x2="40" y2="230" stroke={accent} strokeOpacity="0.45" />
      {pts
        .filter((_, i) => i % 3 === 0)
        .map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill={accent} opacity="0.5" />
        ))}
      <path d={path} fill="none" stroke={accent} strokeWidth="2.5" />
      <circle cx="40" cy="230" r="4" fill={accent} />
      <g>
        <circle cx={pts[30][0]} cy={pts[30][1]} r="5" fill={accent} />
        <circle cx={pts[30][0]} cy={pts[30][1]} r="11" fill={accent} opacity="0.2" />
        <line
          x1={pts[30][0]}
          y1={pts[30][1] - 14}
          x2={pts[30][0]}
          y2={pts[30][1] - 28}
          stroke={accent}
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <text
          x={pts[30][0]}
          y={pts[30][1] - 32}
          textAnchor="middle"
          fontFamily="Geist Mono, monospace"
          fontSize="9"
          fill={accent}
        >
          apex
        </text>
      </g>
      <g transform="translate(310, 220)">
        <path d="M 0 18 L 36 0 L 36 18 Z" fill={accent} opacity="0.25" />
        <line x1="0" y1="18" x2="36" y2="18" stroke={accent} strokeOpacity="0.5" />
        <circle cx="32" cy="3" r="3" fill={accent} />
      </g>
      <g transform="translate(50, 38)">
        <rect width="172" height="22" rx="3" fill={accent} opacity="0.12" />
        <text x="10" y="15" fontFamily="Geist Mono, monospace" fontSize="11" fill={accent}>
          x = ½at² + v₀t + x₀
        </text>
      </g>
      <text
        x="40"
        y="270"
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill={accent}
        letterSpacing="0.18em"
      >
        EXHIBIT 01 · PROJECTILE
      </text>
      <text
        x="360"
        y="270"
        textAnchor="end"
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill={accent}
        opacity="0.55"
        letterSpacing="0.18em"
      >
        UNITY 6 · WEBGL
      </text>
    </svg>
  );
}

// 21 — Apex Finance: balance card, 6-month spend bars, transaction rows.
export function ApexFinance() {
  const accent = "#1f7a4b";
  const months = ["J", "F", "M", "A", "M", "J"];
  const heights = [42, 56, 38, 64, 50, 72];
  const rows: Array<{ merchant: string; amt: string; pos: boolean; faint?: boolean }> = [
    { merchant: "ACH · Robinhood Transfer", amt: "+$1,200.00", pos: true },
    { merchant: "Brick House Coffee · Nash", amt: "−$6.40", pos: false },
    { merchant: "Plaid · Bank Link", amt: "+$0.01", pos: true, faint: true },
    { merchant: "Whole Foods · Nashville", amt: "−$84.22", pos: false },
    { merchant: "Lipscomb Bookstore", amt: "−$140.00", pos: false },
  ];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <g transform="translate(30, 28)">
        <rect width="200" height="78" rx="6" fill={accent} />
        <text
          x="14"
          y="22"
          fontFamily="Geist Mono, monospace"
          fontSize="9"
          fill="#fff"
          opacity="0.7"
          letterSpacing="0.12em"
        >
          ▎AVAILABLE BALANCE
        </text>
        <text x="14" y="52" fontFamily="Geist Mono, monospace" fontSize="22" fill="#fff">
          $12,487.30
        </text>
        <text
          x="14"
          y="68"
          fontFamily="Geist Mono, monospace"
          fontSize="9"
          fill="#fff"
          opacity="0.7"
        >
          ▴ +$842 this month
        </text>
        <rect x="166" y="18" width="20" height="14" rx="2" fill="#fff" opacity="0.5" />
      </g>
      <g transform="translate(240, 28)">
        <text
          x="0"
          y="10"
          fontFamily="Geist Mono, monospace"
          fontSize="9"
          fill={accent}
          letterSpacing="0.1em"
        >
          ▎6-MO SPEND
        </text>
        {heights.map((h, i) => (
          <g key={i}>
            <rect
              x={i * 22}
              y={78 - h}
              width="14"
              height={h}
              rx="1.5"
              fill={accent}
              opacity={0.35 + i * 0.1}
            />
            <text
              x={i * 22 + 7}
              y="94"
              textAnchor="middle"
              fontFamily="Geist Mono, monospace"
              fontSize="9"
              fill={accent}
              opacity="0.5"
            >
              {months[i]}
            </text>
          </g>
        ))}
      </g>
      <g transform="translate(30, 132)">
        <text
          x="0"
          y="10"
          fontFamily="Geist Mono, monospace"
          fontSize="9"
          fill={accent}
          letterSpacing="0.1em"
        >
          ▎RECENT
        </text>
        {rows.map((t, i) => (
          <g key={i} transform={`translate(0, ${22 + i * 24})`}>
            <line x1="0" x2="340" y1="0" y2="0" stroke={accent} strokeOpacity="0.15" />
            <circle
              cx="8"
              cy="14"
              r="3"
              fill={t.pos ? accent : "#a4622a"}
              opacity={t.faint ? 0.4 : 1}
            />
            <text
              x="20"
              y="17"
              fontFamily="Inter, sans-serif"
              fontSize="11"
              fill="#1c1b18"
              opacity={t.faint ? 0.45 : 0.85}
            >
              {t.merchant}
            </text>
            <text
              x="340"
              y="17"
              textAnchor="end"
              fontFamily="Geist Mono, monospace"
              fontSize="11"
              fill={t.pos ? accent : "#a4622a"}
              opacity={t.faint ? 0.45 : 0.95}
            >
              {t.amt}
            </text>
          </g>
        ))}
      </g>
      <text
        x="200"
        y="290"
        textAnchor="middle"
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill={accent}
        letterSpacing="0.18em"
      >
        PLAID · DWOLLA · NEXT.JS 14
      </text>
    </svg>
  );
}

// 22 — LineUp: script page with one character's lines accented, spotlight cone,
// tiny play glyph at the bottom.
export function LineUp() {
  const accent = "#7853c4";
  const lines: Array<{ who: string; accent: boolean; width: number }> = [
    { who: "JULIET", accent: true, width: 160 },
    { who: "ROMEO", accent: false, width: 130 },
    { who: "ROMEO", accent: false, width: 174 },
    { who: "JULIET", accent: true, width: 142 },
    { who: "JULIET", accent: true, width: 196 },
    { who: "NURSE", accent: false, width: 120 },
    { who: "JULIET", accent: true, width: 156 },
    { who: "ROMEO", accent: false, width: 184 },
  ];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <defs>
        <linearGradient id="lu-spot" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.32" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M 200 0 L 80 280 L 320 280 Z" fill="url(#lu-spot)" />
      <line x1="180" y1="0" x2="180" y2="6" stroke={accent} strokeWidth="3" />
      <line x1="220" y1="0" x2="220" y2="6" stroke={accent} strokeWidth="3" />
      <g transform="translate(74, 28)">
        <rect width="252" height="244" rx="3" fill="#fff" stroke={accent} strokeOpacity="0.2" />
        <path d="M 240 0 L 252 0 L 252 12 Z" fill={accent} opacity="0.12" />
        {lines.map((line, i) => {
          const y = 32 + i * 24;
          const c = line.accent ? accent : "#1c1b18";
          const op = line.accent ? 1 : 0.18;
          return (
            <g key={i} transform={`translate(20, ${y})`}>
              <text
                x="0"
                y="0"
                fontFamily="Geist Mono, monospace"
                fontSize="9.5"
                fill={c}
                opacity={op * 0.9}
                letterSpacing="0.12em"
              >
                {line.who}
              </text>
              <rect x="0" y="6" width={line.width} height="3" rx="1.5" fill={c} opacity={op * 0.85} />
              <rect
                x="0"
                y="12"
                width={line.width - 30}
                height="3"
                rx="1.5"
                fill={c}
                opacity={op * 0.6}
              />
            </g>
          );
        })}
      </g>
      <g transform="translate(200, 270)">
        <circle r="14" fill="none" stroke={accent} strokeWidth="1.3" opacity="0.6" />
        <polygon points="-4,-6 6,0 -4,6" fill={accent} />
      </g>
    </svg>
  );
}

// 23 — Air Canvas: hand silhouette + dotted 3D stroke trail on a perspective grid.
export function AirCanvas() {
  const accent = "#2a6fc4";
  const horizLines = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const y = 200 + t * 80;
    const stretchX = 200 - t * 160;
    return (
      <line
        key={`gh${i}`}
        x1={200 - stretchX}
        y1={y}
        x2={200 + stretchX}
        y2={y}
        stroke={accent}
        strokeOpacity={0.16 + t * 0.15}
      />
    );
  });
  const vertLines = Array.from({ length: 13 }, (_, idx) => {
    const i = idx - 6;
    const x = 200 + i * 26;
    return (
      <line
        key={`gv${i}`}
        x1={x}
        y1="200"
        x2={200 + i * 6}
        y2="280"
        stroke={accent}
        strokeOpacity="0.18"
      />
    );
  });
  const trail: Array<{ x: number; y: number; r: number; opacity: number }> = [];
  for (let i = 0; i <= 26; i++) {
    const t = i / 26;
    const x = 110 + t * 220;
    const y = 170 - Math.sin(t * Math.PI) * 70 + Math.cos(t * Math.PI * 2) * 8;
    const depth = 0.4 + (1 - t) * 0.85;
    const r = 1.5 + depth * 4;
    trail.push({ x, y, r, opacity: depth });
  }
  const last = trail[trail.length - 1];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      {horizLines}
      {vertLines}
      <g transform="translate(48, 120)">
        <path
          d="M 0 20 L 0 64 Q 0 76 12 76 L 50 76 Q 62 76 62 64 L 62 30 Z"
          fill="#1c1b18"
          opacity="0.85"
        />
        <path d="M 0 30 Q -10 26, -14 14 L -10 8 Q -2 12, 2 22 Z" fill="#1c1b18" opacity="0.85" />
        <path d="M 14 30 L 14 -8 Q 22 -10, 26 -8 L 26 30 Z" fill="#1c1b18" opacity="0.85" />
        <circle cx="20" cy="-6" r="6" fill={accent} opacity="0.35" />
        <circle cx="20" cy="-6" r="2.5" fill={accent} />
        <path d="M 30 30 L 30 4 Q 38 2, 42 4 L 42 30 Z" fill="#1c1b18" opacity="0.5" />
        <path d="M 46 30 L 46 8 Q 53 6, 56 8 L 56 30 Z" fill="#1c1b18" opacity="0.45" />
        <path d="M 58 30 L 58 14 Q 64 12, 66 14 L 66 30 Z" fill="#1c1b18" opacity="0.4" />
      </g>
      {trail.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={accent} opacity={d.opacity} />
      ))}
      <g>
        <circle cx={last.x} cy={last.y} r={11} fill={accent} opacity="0.2" />
        <circle cx={last.x} cy={last.y} r={3.5} fill={accent} />
      </g>
      <g transform="translate(40, 36)">
        <circle r="4" fill={accent} />
        <circle r="9" fill={accent} opacity="0.2" />
        <text x="14" y="4" fontFamily="Geist Mono, monospace" fontSize="9.5" fill={accent}>
          LIVE · 3 peers
        </text>
      </g>
      <text
        x="200"
        y="290"
        textAnchor="middle"
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill={accent}
        letterSpacing="0.18em"
      >
        MEDIAPIPE · THREE.JS · SOCKET.IO
      </text>
    </svg>
  );
}

// 24 — Audio Visualizer (dark): frequency bars across the bottom, sine waveform
// mid-frame, mic glyph + 44.1 kHz · LOCAL label.
export function AudioVisualizer() {
  const accent = "#5ec8c2";
  const bars: number[] = [];
  for (let i = 0; i < 36; i++) {
    const seed = Math.sin(i * 1.7 + 3.1) * 0.5 + Math.sin(i * 0.4) * 0.5;
    const env = Math.sin((i / 35) * Math.PI) * 0.6 + 0.3;
    const h = Math.max(6, (seed * 0.5 + env) * 110);
    bars.push(h);
  }
  const wavePts: Array<[number, number]> = [];
  for (let i = 0; i <= 80; i++) {
    const x = 30 + i * 4.4;
    const y = 110 + Math.sin(i * 0.32) * 28 + Math.sin(i * 0.11) * 8;
    wavePts.push([x, y]);
  }
  const wavePath = "M " + wavePts.map((p) => p.join(",")).join(" L ");
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <defs>
        <linearGradient id="av-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="1" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <line
        x1="20"
        y1="110"
        x2="380"
        y2="110"
        stroke={accent}
        strokeOpacity="0.18"
        strokeDasharray="2 3"
      />
      <path d={wavePath} fill="none" stroke={accent} strokeWidth="2" opacity="0.85" />
      <path d={wavePath} fill="none" stroke={accent} strokeWidth="6" opacity="0.18" />
      {bars.map((h, i) => {
        const x = 30 + i * 10;
        const y = 240 - h;
        return <rect key={i} x={x} y={y} width="6" height={h} rx="1.5" fill="url(#av-bar)" />;
      })}
      <line x1="20" y1="240" x2="380" y2="240" stroke={accent} strokeOpacity="0.4" />
      <g transform="translate(32, 32)">
        <rect x="0" y="0" width="14" height="20" rx="7" fill="none" stroke={accent} strokeWidth="1.5" />
        <path
          d="M -3 16 Q -3 26, 7 26 Q 17 26, 17 16"
          fill="none"
          stroke={accent}
          strokeWidth="1.2"
        />
        <line x1="7" y1="26" x2="7" y2="32" stroke={accent} strokeWidth="1.2" />
        <line x1="2" y1="32" x2="12" y2="32" stroke={accent} strokeWidth="1.2" />
        <text
          x="26"
          y="14"
          fontFamily="Geist Mono, monospace"
          fontSize="9.5"
          fill={accent}
          letterSpacing="0.08em"
        >
          44.1 kHz
        </text>
        <text
          x="26"
          y="26"
          fontFamily="Geist Mono, monospace"
          fontSize="9.5"
          fill={accent}
          opacity="0.55"
          letterSpacing="0.08em"
        >
          LOCAL
        </text>
      </g>
      <g transform="translate(348, 38)" opacity="0.8">
        <circle r="6" fill="none" stroke={accent} />
        <circle r="10" fill="none" stroke={accent} opacity="0.5" />
        <circle r="14" fill="none" stroke={accent} opacity="0.25" />
      </g>
      <text
        x="200"
        y="276"
        textAnchor="middle"
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill={accent}
        letterSpacing="0.18em"
      >
        SVELTEKIT · WEB AUDIO API
      </text>
    </svg>
  );
}

// 25 — Olist Warehouse: pipeline boxes (Source → Snowflake → Marts → Charts)
// with a small star-schema diagram tucked underneath.
export function OlistWarehouse() {
  const accent = "#2a6fc4";
  const ink = "#1c1b18";
  // pipeline node positions
  const nodes = [
    { x: 22, y: 60, label: "CSV", sub: "raw" },
    { x: 110, y: 60, label: "RAW", sub: "load" },
    { x: 198, y: 60, label: "STG", sub: "dbt" },
    { x: 286, y: 60, label: "MART", sub: "star" },
  ];
  return (
    <svg viewBox="0 0 400 300" style={fill} aria-hidden="true">
      <text
        x="22"
        y="36"
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill={accent}
        letterSpacing="0.18em"
      >
        WAREHOUSE · STAR SCHEMA
      </text>
      {nodes.map((n, i) => (
        <g key={i}>
          <rect
            x={n.x}
            y={n.y}
            width="76"
            height="46"
            rx="4"
            fill="none"
            stroke={accent}
            strokeWidth="1.2"
            strokeOpacity="0.65"
          />
          <text
            x={n.x + 38}
            y={n.y + 22}
            textAnchor="middle"
            fontFamily="Geist Mono, monospace"
            fontSize="11"
            fill={ink}
            letterSpacing="0.06em"
          >
            {n.label}
          </text>
          <text
            x={n.x + 38}
            y={n.y + 36}
            textAnchor="middle"
            fontFamily="Geist Mono, monospace"
            fontSize="8"
            fill={accent}
            opacity="0.7"
            letterSpacing="0.1em"
          >
            {n.sub}
          </text>
          {i < nodes.length - 1 && (
            <g>
              <line
                x1={n.x + 76}
                y1={n.y + 23}
                x2={n.x + 82}
                y2={n.y + 23}
                stroke={accent}
                strokeWidth="1.4"
              />
              <polygon
                points={`${n.x + 82},${n.y + 19} ${n.x + 88},${n.y + 23} ${n.x + 82},${n.y + 27}`}
                fill={accent}
              />
            </g>
          )}
        </g>
      ))}
      {/* mini star schema below */}
      <g transform="translate(170, 180)">
        {/* center fact */}
        <rect x="-30" y="-14" width="60" height="28" rx="3" fill={accent} />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontFamily="Geist Mono, monospace"
          fontSize="9"
          fill="#fff"
          letterSpacing="0.06em"
        >
          fact_orders
        </text>
        {/* 5 dimension orbits */}
        {[
          { x: -110, y: -50, label: "dim_date" },
          { x: 80, y: -50, label: "dim_seller" },
          { x: 110, y: 30, label: "dim_product" },
          { x: -80, y: 60, label: "dim_customer" },
          { x: 0, y: 80, label: "dim_geography" },
        ].map((d, i) => (
          <g key={i}>
            <line x1="0" y1="0" x2={d.x} y2={d.y} stroke={accent} strokeOpacity="0.4" />
            <rect
              x={d.x - 36}
              y={d.y - 9}
              width="72"
              height="18"
              rx="3"
              fill="none"
              stroke={accent}
              strokeOpacity="0.7"
              strokeWidth="1"
            />
            <text
              x={d.x}
              y={d.y + 4}
              textAnchor="middle"
              fontFamily="Geist Mono, monospace"
              fontSize="9"
              fill={ink}
              opacity="0.85"
            >
              {d.label}
            </text>
          </g>
        ))}
      </g>
      <text
        x="200"
        y="290"
        textAnchor="middle"
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill={accent}
        letterSpacing="0.18em"
      >
        SNOWFLAKE · DBT · STAR SCHEMA
      </text>
    </svg>
  );
}
