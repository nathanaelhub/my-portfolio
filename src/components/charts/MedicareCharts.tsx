/**
 * Hand-coded SVG analytics charts for the Medicare Cost & Quality project.
 * Pure SVG, warm-paper editorial style, matching OlistCharts.
 *
 * NUMBERS ARE REALISTIC PLACEHOLDERS until the CMS warehouse is loaded,
 * then swapped for the actual query results from sql_highlights/.
 */

import type { CSSProperties, ReactNode } from "react";

const accent = "#1f7a6b"; // clinical teal-green, distinct from Olist's blue
const ink = "var(--rd-ink)";
const mute = "var(--rd-mute)";
const faint = "var(--rd-faint)";
const line = "var(--rd-line)";
const bone = "var(--rd-bone)";

interface FigureProps {
  title: string;
  subtitle?: string;
  caption?: string;
  children: ReactNode;
  source?: string;
}

const figureStyle: CSSProperties = {
  margin: "32px -8px",
  padding: "20px 18px 16px",
  background: "var(--rd-paper)",
  border: `1px solid ${line}`,
  borderRadius: 6,
};
const headStyle: CSSProperties = {
  fontFamily: "var(--font-code), monospace",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: faint,
  marginBottom: 4,
};
const titleStyle: CSSProperties = {
  fontFamily: "var(--font-display), Fraunces, serif",
  fontWeight: 400,
  fontSize: 18,
  letterSpacing: "-0.01em",
  color: "var(--rd-ink)",
  margin: "0 0 14px",
};
const captionStyle: CSSProperties = {
  fontFamily: "var(--font-body), Geist, system-ui, sans-serif",
  fontSize: 12.5,
  color: mute,
  marginTop: 12,
  lineHeight: 1.5,
};
const sourceStyle: CSSProperties = {
  fontFamily: "var(--font-code), monospace",
  fontSize: 9,
  letterSpacing: "0.12em",
  color: faint,
  marginTop: 6,
};

function Figure({ title, subtitle, caption, children, source }: FigureProps) {
  return (
    <figure style={figureStyle}>
      {subtitle && <div style={headStyle}>{subtitle}</div>}
      <div style={titleStyle}>{title}</div>
      {children}
      {caption && <figcaption style={captionStyle}>{caption}</figcaption>}
      {source && <div style={sourceStyle}>SOURCE · {source}</div>}
    </figure>
  );
}

// ---- 1. Price variation for one DRG (470 — joint replacement) --------------

// Real figures from sql_highlights/01 (DY2024, n=1,212 hospitals).
const DRG470 = {
  min: 19_194,
  p10: 42_710,
  median: 79_947,
  p90: 167_283,
  max: 383_606,
  fold: 20.0,
  medicarePayP90P10: 1.7,
  nHospitals: 1_212,
};

export function MedicarePriceVariation() {
  const W = 720;
  const H = 150;
  const padL = 24;
  const padR = 24;
  const axisY = 92;
  const maxScale = 190_000; // clip the long tail; max labeled separately
  const x = (v: number) => padL + ((W - padL - padR) * Math.min(v, maxScale)) / maxScale;
  const ticks = [0, 50_000, 100_000, 150_000];
  return (
    <Figure
      subtitle="Q1 · Same procedure, different price"
      title="Average covered charge for DRG 470 (joint replacement) across 1,212 hospitals"
      caption={`The same routine knee/hip replacement: the cheapest hospital's average charge is about $${(DRG470.min / 1000).toFixed(0)}k, the median is $${(DRG470.median / 1000).toFixed(0)}k, and the most expensive tops $${(DRG470.max / 1000).toFixed(0)}k — a ${DRG470.fold}× spread from floor to ceiling. Meanwhile the actual Medicare payment varies only ~${DRG470.medicarePayP90P10}× across the very same hospitals. The "charge" is a list price almost decoupled from what the care costs or what anyone pays.`}
      source="sql_highlights/01_price_variation_one_drg.sql"
    >
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }} role="img" aria-label="Charge distribution for DRG 470">
        {/* axis */}
        <line x1={padL} y1={axisY} x2={W - padR} y2={axisY} stroke={line} />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} y1={axisY} x2={x(t)} y2={axisY + 5} stroke={faint} />
            <text x={x(t)} y={axisY + 18} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="9" fill={faint}>
              ${t / 1000}k
            </text>
          </g>
        ))}
        {/* p10–p90 range bar */}
        <rect x={x(DRG470.p10)} y={axisY - 26} width={x(DRG470.p90) - x(DRG470.p10)} height={20} rx={3} fill={accent} opacity={0.18} />
        {/* whiskers */}
        <line x1={x(DRG470.min)} y1={axisY - 16} x2={x(DRG470.p90)} y2={axisY - 16} stroke={accent} strokeOpacity={0.5} />
        {/* markers */}
        {[
          { v: DRG470.min, label: "min" },
          { v: DRG470.p10, label: "p10" },
          { v: DRG470.median, label: "median", big: true },
          { v: DRG470.p90, label: "p90" },
        ].map((m) => (
          <g key={m.label}>
            <line x1={x(m.v)} y1={axisY - 30} x2={x(m.v)} y2={axisY} stroke={accent} strokeWidth={m.big ? 2.5 : 1.2} />
            <text x={x(m.v)} y={axisY - 34} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="9" fill={m.big ? accent : mute}>
              {m.label}
            </text>
            <text x={x(m.v)} y={28} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="9" fill={ink} opacity={0.8}>
              ${(m.v / 1000).toFixed(0)}k
            </text>
          </g>
        ))}
        {/* max — off the clipped scale, drawn at the right edge with a break */}
        <g>
          <line x1={W - padR - 2} y1={axisY - 30} x2={W - padR - 2} y2={axisY} stroke={accent} strokeWidth={1.2} strokeDasharray="2 2" />
          <text x={W - padR - 2} y={axisY - 34} textAnchor="end" fontFamily="var(--font-code), monospace" fontSize="9" fill={mute}>
            max ${(DRG470.max / 1000).toFixed(0)}k →
          </text>
        </g>
      </svg>
    </Figure>
  );
}

// ---- 2. Markup by service line ---------------------------------------------

// Real figures from sql_highlights/02 (discharge-weighted, DY2024).
const MARKUP: Array<{ line: string; markup: number }> = [
  { line: "Nervous system", markup: 6.4 },
  { line: "Digestive", markup: 6.4 },
  { line: "Musculoskeletal", markup: 6.3 },
  { line: "Kidney/urinary", markup: 6.25 },
  { line: "Circulatory", markup: 6.06 },
  { line: "Respiratory", markup: 5.99 },
  { line: "Transplants", markup: 5.64 },
];

export function MedicareMarkup() {
  const maxM = Math.max(...MARKUP.map((d) => d.markup));
  const W = 720;
  const H = 240;
  const padL = 140;
  const padR = 56;
  const padT = 8;
  const padB = 20;
  const rowH = (H - padT - padB) / MARKUP.length;
  return (
    <Figure
      subtitle="Q2 · The markup gap"
      title="Hospital charge ÷ Medicare payment, by service line (discharge-weighted)"
      caption="Every bar is how many times higher the average billed charge is than what Medicare actually pays for that service line. The striking part is the consistency: from nervous-system procedures down to transplants, the markup sits in a tight ~5.6–6.4× band. The list price isn't tracking the complexity or cost of the care — it's a roughly fixed multiple applied across the board. Discharge-weighted, so a high-volume DRG counts more than a rare one — the rollup a real analyst builds, not a naïve average of averages."
      source="sql_highlights/02_markup_by_service_line.sql"
    >
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }} role="img" aria-label="Markup ratio by service line">
        {MARKUP.map((d, i) => {
          const y = padT + i * rowH;
          const w = ((W - padL - padR) * d.markup) / maxM;
          return (
            <g key={d.line}>
              <text x={padL - 12} y={y + rowH / 2 + 4} textAnchor="end" fontFamily="var(--font-code), monospace" fontSize="11" fill={ink}>
                {d.line}
              </text>
              <rect x={padL} y={y + 4} width={w} height={rowH - 10} rx={2} fill={accent} opacity={0.85 - i * 0.07} />
              <text x={padL + w + 8} y={y + rowH / 2 + 4} fontFamily="var(--font-code), monospace" fontSize="11" fill={ink}>
                {d.markup.toFixed(1)}×
              </text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

// ---- 3. Cost vs quality (the two-fact join) --------------------------------

// Real figures from sql_highlights/03 (n=2,789 hospitals, DY2024).
const COST_QUALITY: Array<{ quintile: string; pay: number; readmit: number }> = [
  { quintile: "Q1 (lowest paid)", pay: 8_410, readmit: 1.0069 },
  { quintile: "Q2", pay: 10_216, readmit: 1.0061 },
  { quintile: "Q3", pay: 11_805, readmit: 1.0006 },
  { quintile: "Q4", pay: 14_140, readmit: 0.9912 },
  { quintile: "Q5 (highest paid)", pay: 21_939, readmit: 0.9942 },
];
const COST_QUALITY_R = -0.081; // correlation across all hospitals

export function MedicareCostVsQuality() {
  const W = 720;
  const H = 250;
  const padL = 56;
  const padR = 130;
  const padT = 20;
  const padB = 50;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  // readmit ratio axis: center on 1.0, +/- 0.03 band
  const lo = 0.97;
  const hi = 1.03;
  const yOf = (r: number) => padT + plotH - (plotH * (r - lo)) / (hi - lo);
  const xOf = (i: number) => padL + (plotW * (i + 0.5)) / COST_QUALITY.length;
  return (
    <Figure
      subtitle="Q3 · Does spending buy quality?  (the two-fact join)"
      title="30-day excess-readmission ratio by hospital Medicare-payment quintile"
      caption={`2,789 hospitals bucketed into five groups by what Medicare pays them per discharge (cost fact), plotted against their average 30-day excess-readmission ratio (quality fact), joined on the shared provider dimension. There's a faint downward tilt — the best-paid quintile (avg $21.9k/discharge) readmits slightly below expectation while the lowest ($8.4k) sits slightly above — but it's barely there: the correlation is r = ${COST_QUALITY_R}, meaning hospital payment explains well under 1% of the variance in readmissions. A ratio of 1.0 is "exactly as expected after risk adjustment." Paying a hospital 2.6× more buys, at most, a rounding error of better outcomes. This is the answer payers keep arriving at.`}
      source="sql_highlights/03_cost_vs_quality.sql"
    >
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }} role="img" aria-label="Cost versus quality by payment quintile">
        {/* y gridlines */}
        {[0.98, 0.99, 1.0, 1.01, 1.02].map((r) => (
          <g key={r}>
            <line x1={padL} y1={yOf(r)} x2={padL + plotW} y2={yOf(r)} stroke={line} strokeOpacity={r === 1.0 ? 0.9 : 0.4} strokeDasharray={r === 1.0 ? undefined : "2 3"} />
            <text x={padL - 8} y={yOf(r) + 3} textAnchor="end" fontFamily="var(--font-code), monospace" fontSize="9" fill={faint}>
              {r.toFixed(2)}
            </text>
          </g>
        ))}
        {/* "expected" label on the 1.0 line */}
        <text x={padL + plotW} y={yOf(1.0) - 5} textAnchor="end" fontFamily="var(--font-code), monospace" fontSize="9" fill={mute}>
          1.00 = risk-adjusted expectation
        </text>
        {/* connecting line */}
        <polyline
          points={COST_QUALITY.map((d, i) => `${xOf(i)},${yOf(d.readmit)}`).join(" ")}
          fill="none"
          stroke={accent}
          strokeWidth={1.5}
          strokeOpacity={0.5}
        />
        {/* points */}
        {COST_QUALITY.map((d, i) => (
          <g key={d.quintile}>
            <circle cx={xOf(i)} cy={yOf(d.readmit)} r={5} fill={accent} />
            <text x={xOf(i)} y={H - padB + 16} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="8.5" fill={mute}>
              {d.quintile.split(" ")[0]}
            </text>
            <text x={xOf(i)} y={H - padB + 28} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="8" fill={faint}>
              ${(d.pay / 1000).toFixed(1)}k
            </text>
          </g>
        ))}
        {/* y axis title */}
        <text x={16} y={padT + plotH / 2} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="9" fill={faint} transform={`rotate(-90 16 ${padT + plotH / 2})`}>
          EXCESS READMIT RATIO
        </text>
      </svg>
    </Figure>
  );
}

// ---- 4. Architecture diagram -----------------------------------------------

export function MedicareArchitecture() {
  const W = 720;
  const H = 200;
  return (
    <Figure
      subtitle="Pipeline"
      title="Two public CMS extracts → Snowflake → a two-fact star"
      caption="The inpatient charges file resolves from the CMS DCAT catalog (so it never points at a stale release URL); HRRP pages through the Provider Data Catalog API. No credentials — the CMS endpoints are open. Both land in RAW, get cast in STG, and conform into MARTS where the two facts meet through dim_provider."
    >
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }} role="img" aria-label="Architecture diagram">
        {[
          { x: 14, y: 30, label: "CMS DCAT", sub: "inpatient" },
          { x: 14, y: 110, label: "Provider API", sub: "HRRP" },
          { x: 170, y: 70, label: "Snowflake", sub: "RAW", node: true },
          { x: 320, y: 70, label: "Snowflake", sub: "STG · dbt", node: true },
          { x: 480, y: 70, label: "MARTS", sub: "2 facts", node: true },
          { x: 624, y: 70, label: "Portfolio", sub: "charts" },
        ].map((n, i) => (
          <g key={i} transform={`translate(${n.x}, ${n.y})`}>
            <rect width={108} height={56} rx={6} fill={n.node ? bone : "var(--rd-paper)"} stroke={accent} strokeOpacity={0.5} strokeWidth={1.2} />
            <text x={54} y={24} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="10.5" fill={ink} style={{ letterSpacing: "0.06em" }}>
              {n.label}
            </text>
            <text x={54} y={40} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="8.5" fill={mute} style={{ letterSpacing: "0.08em" }}>
              {n.sub}
            </text>
          </g>
        ))}
        {/* arrows: two sources merge into RAW, then linear */}
        {[
          { x1: 122, y1: 58, x2: 170, y2: 90 },
          { x1: 122, y1: 138, x2: 170, y2: 106 },
          { x1: 278, y1: 98, x2: 320, y2: 98 },
          { x1: 428, y1: 98, x2: 480, y2: 98 },
          { x1: 588, y1: 98, x2: 624, y2: 98, dashed: true },
        ].map((e, i) => (
          <g key={i}>
            <line x1={e.x1} y1={e.y1} x2={e.x2 - 6} y2={e.y2} stroke={accent} strokeWidth={1.4} strokeDasharray={e.dashed ? "3 3" : undefined} />
            <polygon points={`${e.x2 - 6},${e.y2 - 4} ${e.x2},${e.y2} ${e.x2 - 6},${e.y2 + 4}`} fill={accent} />
          </g>
        ))}
      </svg>
    </Figure>
  );
}

// ---- 5. Two-fact star schema diagram ---------------------------------------

export function MedicareStarSchema() {
  const W = 720;
  const H = 300;
  return (
    <Figure
      subtitle="Schema"
      title="Two facts at different grains, conformed through dim_provider"
      caption="fact_inpatient_charges (hospital × DRG) holds the cost side; fact_readmissions (hospital × condition) holds the quality side. They share dim_provider — keyed on the CCN that appears in both CMS files — which is the only reason cost and quality can be compared at the same hospital. A dbt relationships test enforces that join so a future CMS release can't silently break it."
      source="docs/star_schema.md"
    >
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }} role="img" aria-label="Two-fact star schema">
        {/* dims top row */}
        {[
          { x: 150, y: 20, name: "dim_geography", sub: "state · region" },
          { x: 430, y: 20, name: "dim_drg", sub: "service_line" },
        ].map((d, i) => (
          <g key={i}>
            <rect x={d.x} y={d.y} width={140} height={40} rx={5} fill="var(--rd-paper)" stroke={accent} strokeOpacity={0.6} strokeWidth={1.2} />
            <text x={d.x + 70} y={d.y + 17} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="10" fill={ink}>{d.name}</text>
            <text x={d.x + 70} y={d.y + 31} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="8.5" fill={mute}>{d.sub}</text>
          </g>
        ))}
        {/* two facts */}
        <g>
          <rect x={70} y={120} width={180} height={66} rx={6} fill={accent} fillOpacity={0.12} stroke={accent} strokeWidth={1.4} />
          <text x={160} y={144} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="10.5" fill={ink}>fact_readmissions</text>
          <text x={160} y={160} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="8.5" fill={mute}>grain: hospital × condition</text>
          <text x={160} y={174} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="8.5" fill={mute}>excess_readmit_ratio</text>
        </g>
        <g>
          <rect x={470} y={120} width={180} height={66} rx={6} fill={accent} fillOpacity={0.12} stroke={accent} strokeWidth={1.4} />
          <text x={560} y={144} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="10.5" fill={ink}>fact_inpatient_charges</text>
          <text x={560} y={160} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="8.5" fill={mute}>grain: hospital × DRG</text>
          <text x={560} y={174} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="8.5" fill={mute}>charge · medicare_pay</text>
        </g>
        {/* shared provider dim, centered bottom */}
        <g>
          <rect x={285} y={240} width={150} height={48} rx={6} fill={accent} stroke={accent} strokeWidth={1.5} />
          <text x={360} y={262} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="10.5" fill="#fff">dim_provider</text>
          <text x={360} y={278} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="8.5" fill="#fff" opacity={0.85}>ccn ← conformed key</text>
        </g>
        {/* connectors: both facts → dim_provider */}
        <line x1={160} y1={186} x2={320} y2={240} stroke={accent} strokeOpacity={0.55} strokeWidth={1.3} />
        <line x1={560} y1={186} x2={400} y2={240} stroke={accent} strokeOpacity={0.55} strokeWidth={1.3} />
        {/* dims → facts */}
        <line x1={220} y1={60} x2={160} y2={120} stroke={accent} strokeOpacity={0.35} />
        <line x1={500} y1={60} x2={560} y2={120} stroke={accent} strokeOpacity={0.35} />
        <line x1={220} y1={60} x2={540} y2={120} stroke={accent} strokeOpacity={0.18} />
        {/* the join callout */}
        <text x={360} y={216} textAnchor="middle" fontFamily="var(--font-code), monospace" fontSize="9" fill={accent} style={{ letterSpacing: "0.1em" }}>
          ↑ the join that makes cost-vs-quality possible ↑
        </text>
      </svg>
    </Figure>
  );
}
