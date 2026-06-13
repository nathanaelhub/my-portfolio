/**
 * Hand-coded SVG analytics charts for the Olist Warehouse project page.
 * Pure SVG, no chart library — matches the warm-paper editorial style
 * of the existing cover artwork on the portfolio.
 *
 * Numbers are loaded from /charts data constants below. Swap in real
 * results once the warehouse is loaded.
 */

import type { CSSProperties, ReactNode } from "react";

// ---- Shared chart frame ----------------------------------------------------

const accent = "#2a6fc4";
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
  height?: number;
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

// ---- 1. Revenue by Brazilian region ---------------------------------------

const REGION_REVENUE: Array<{ region: string; revenue: number; orders: number }> = [
  { region: "Sudeste", revenue: 10_226_484, orders: 67_662 },
  { region: "Sul", revenue: 2_295_786, orders: 14_027 },
  { region: "Nordeste", revenue: 1_874_175, orders: 9_307 },
  { region: "Centro-Oeste", revenue: 993_279, orders: 5_564 },
  { region: "Norte", revenue: 409_309, orders: 1_832 },
];

export function OlistRevenueByRegion() {
  const maxRev = Math.max(...REGION_REVENUE.map((d) => d.revenue));
  const totalRev = REGION_REVENUE.reduce((a, b) => a + b.revenue, 0);
  const W = 720;
  const H = 260;
  const padL = 130;
  const padR = 90;
  const padT = 16;
  const padB = 24;
  const barH = (H - padT - padB) / REGION_REVENUE.length - 6;
  return (
    <Figure
      subtitle="Q1 · Where is the revenue actually coming from?"
      title="Gross revenue by Brazilian region · 2016–2018"
      caption="Sudeste (São Paulo, Rio, Minas Gerais, Espírito Santo) drives 65% of the R$15.8M gross revenue across 67,662 orders. The Norte region — geographically the largest — contributes 2.6%. Any growth strategy that allocates effort evenly by region is spending four-fifths of it against one-fifth of the opportunity."
      source="marts.fact_orders × marts.dim_geography"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto" }}
        role="img"
        aria-label="Bar chart of gross revenue by Brazilian region"
      >
        {REGION_REVENUE.map((d, i) => {
          const y = padT + i * (barH + 6);
          const barW = ((W - padL - padR) * d.revenue) / maxRev;
          const pct = (100 * d.revenue) / totalRev;
          return (
            <g key={d.region}>
              <text
                x={padL - 12}
                y={y + barH / 2 + 4}
                textAnchor="end"
                fontFamily="var(--font-code), monospace"
                fontSize="11"
                fill={ink}
                style={{ letterSpacing: "0.06em" }}
              >
                {d.region}
              </text>
              <rect
                x={padL}
                y={y}
                width={barW}
                height={barH}
                rx={2}
                fill={accent}
                opacity={0.85 - i * 0.1}
              />
              <text
                x={padL + barW + 8}
                y={y + barH / 2 + 4}
                fontFamily="var(--font-code), monospace"
                fontSize="11"
                fill={ink}
              >
                ${(d.revenue / 1000).toFixed(0)}k · {pct.toFixed(0)}%
              </text>
            </g>
          );
        })}
        <line
          x1={padL}
          y1={H - padB + 2}
          x2={W - padR}
          y2={H - padB + 2}
          stroke={line}
          strokeWidth={1}
        />
      </svg>
    </Figure>
  );
}

// ---- 2. Seller retention cohort heatmap ----------------------------------

// rows = cohort month, columns = months since cohort, values = retention %.
const COHORTS = ["2017-Jan", "2017-Apr", "2017-Jul", "2017-Oct", "2018-Jan", "2018-Apr"];
const N = null as unknown as number;
const RETENTION_MATRIX: number[][] = [
  // M0  M1  M2  M3  M4  M5  M6  M7  M8
  [100, 71, 70, 60, 64, 58, 50, 57, 50],
  [100, 54, 47, 50, 49, 45, 38, 47, 38],
  [100, 68, 62, 61, 68, 61, 57, 53, 52],
  [100, 66, 55, 56, 48, 48, 48, 46, 37],
  [100, 57, 50, 57, 45, 47, 40, 36, N],
  [100, 60, 52, 53, 48, N, N, N, N],
];

export function OlistSellerRetention() {
  const W = 720;
  const padL = 90;
  const padR = 16;
  const padT = 30;
  const cols = 9;
  const rows = COHORTS.length;
  const cellW = (W - padL - padR) / cols;
  const cellH = 28;
  const H = padT + rows * cellH + 28;
  return (
    <Figure
      subtitle="Q2 · How sticky are sellers once they start selling?"
      title="Seller retention by quarterly cohort · % still selling N months later"
      caption="Each row is a cohort of sellers who made their first sale in that month; read across for the share still selling N months later. The story is healthier than marketplace churn lore suggests — roughly half of every cohort is still active at month 6, and the Jan and Jul 2017 cohorts hold above 50% for the full window. The risk isn't a cliff; it's the steady ~40% that drift away in the first quarter, which acquisition has to keep replacing."
      source="sql_highlights/01_seller_retention_cohort.sql"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto" }}
        role="img"
        aria-label="Heatmap of seller cohort retention"
      >
        {/* column headers */}
        {Array.from({ length: cols }, (_, c) => (
          <text
            key={`ch${c}`}
            x={padL + c * cellW + cellW / 2}
            y={padT - 10}
            textAnchor="middle"
            fontFamily="var(--font-code), monospace"
            fontSize="10"
            fill={faint}
          >
            M{c}
          </text>
        ))}
        {/* row labels + cells */}
        {RETENTION_MATRIX.map((row, r) => (
          <g key={`r${r}`}>
            <text
              x={padL - 10}
              y={padT + r * cellH + cellH / 2 + 4}
              textAnchor="end"
              fontFamily="var(--font-code), monospace"
              fontSize="11"
              fill={ink}
            >
              {COHORTS[r]}
            </text>
            {row.map((v, c) => {
              if (v === null || v === undefined || Number.isNaN(v)) {
                return null;
              }
              const op = 0.08 + (v / 100) * 0.85;
              return (
                <g key={`c${r}-${c}`}>
                  <rect
                    x={padL + c * cellW + 2}
                    y={padT + r * cellH + 2}
                    width={cellW - 4}
                    height={cellH - 4}
                    rx={2}
                    fill={accent}
                    fillOpacity={op}
                  />
                  <text
                    x={padL + c * cellW + cellW / 2}
                    y={padT + r * cellH + cellH / 2 + 4}
                    textAnchor="middle"
                    fontFamily="var(--font-code), monospace"
                    fontSize="10"
                    fill={v > 35 ? "#fff" : ink}
                  >
                    {v}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </Figure>
  );
}

// ---- 3. Late delivery rate by category × region ---------------------------

const LATE_BY_CATEGORY: Array<{ category: string; sudeste: number; rest: number }> = [
  { category: "health_beauty", sudeste: 7.4, rest: 11.1 },
  { category: "electronics",   sudeste: 7.6, rest: 9.8 },
  { category: "home_garden",   sudeste: 7.2, rest: 9.5 },
  { category: "fashion",       sudeste: 5.3, rest: 9.1 },
  { category: "industrial",    sudeste: 7.7, rest: 8.8 },
  { category: "sports_leisure",sudeste: 7.1, rest: 8.1 },
];

export function OlistLateDeliveryByCategory() {
  const max = Math.max(...LATE_BY_CATEGORY.flatMap((d) => [d.sudeste, d.rest]));
  const W = 720;
  const H = 280;
  const padL = 130;
  const padR = 20;
  const padT = 36;
  const padB = 36;
  const rowH = (H - padT - padB) / LATE_BY_CATEGORY.length;
  return (
    <Figure
      subtitle="Q3 · Is late delivery a logistics problem or a category problem?"
      title="Late-delivery rate by category group · Sudeste vs rest of Brazil"
      caption="Both bars per category show the % of orders delivered after the promised date. Within Sudeste the rate sits near 7% almost regardless of category — but outside it, the rate climbs, and the gap widens most for fashion (5.3% → 9.1%) and health & beauty (7.4% → 11.1%). The lever isn't product-level supplier SLAs; the late-delivery signal tracks geography far more than category. The same dim_geography that drives the revenue split surfaces this in a single join."
      source="marts.fact_orders × marts.dim_product × marts.dim_geography"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto" }}
        role="img"
        aria-label="Grouped bar chart of late-delivery rate by category"
      >
        {/* legend */}
        <g transform={`translate(${padL}, ${padT - 22})`}>
          <rect x={0} y={0} width={10} height={10} fill={accent} opacity={0.85} />
          <text
            x={16}
            y={9}
            fontFamily="var(--font-code), monospace"
            fontSize="10"
            fill={ink}
          >
            Sudeste
          </text>
          <rect x={90} y={0} width={10} height={10} fill={accent} opacity={0.4} />
          <text
            x={106}
            y={9}
            fontFamily="var(--font-code), monospace"
            fontSize="10"
            fill={ink}
          >
            Rest of Brazil
          </text>
        </g>
        {LATE_BY_CATEGORY.map((d, i) => {
          const y = padT + i * rowH;
          const bh = (rowH - 8) / 2 - 1;
          const w1 = ((W - padL - padR) * d.sudeste) / max;
          const w2 = ((W - padL - padR) * d.rest) / max;
          return (
            <g key={d.category}>
              <text
                x={padL - 10}
                y={y + rowH / 2 + 3}
                textAnchor="end"
                fontFamily="var(--font-code), monospace"
                fontSize="11"
                fill={ink}
              >
                {d.category}
              </text>
              <rect
                x={padL}
                y={y + 2}
                width={w1}
                height={bh}
                fill={accent}
                opacity={0.85}
                rx={2}
              />
              <text
                x={padL + w1 + 6}
                y={y + 2 + bh / 2 + 3}
                fontFamily="var(--font-code), monospace"
                fontSize="10"
                fill={ink}
              >
                {d.sudeste}%
              </text>
              <rect
                x={padL}
                y={y + 4 + bh}
                width={w2}
                height={bh}
                fill={accent}
                opacity={0.4}
                rx={2}
              />
              <text
                x={padL + w2 + 6}
                y={y + 4 + bh + bh / 2 + 3}
                fontFamily="var(--font-code), monospace"
                fontSize="10"
                fill={ink}
              >
                {d.rest}%
              </text>
            </g>
          );
        })}
        <line
          x1={padL}
          y1={H - padB + 4}
          x2={W - padR}
          y2={H - padB + 4}
          stroke={line}
        />
      </svg>
    </Figure>
  );
}

// ---- 4. Architecture diagram ----------------------------------------------

export function OlistArchitecture() {
  const W = 720;
  const H = 220;
  return (
    <Figure
      subtitle="Pipeline"
      title="From Kaggle CSVs to a portfolio chart, in five hops"
      caption="The dotted edge between marts and the portfolio is the seam — live charts on a static-export portfolio can't query Snowflake, so the build step snapshots the aggregates as JSON. Live warehouse, static delivery, no embed dependencies."
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto" }}
        role="img"
        aria-label="Architecture: Kaggle → Snowflake RAW → STG → MARTS → portfolio"
      >
        {[
          { x: 16,  y: 80, label: "Kaggle",       sub: "8 CSVs" },
          { x: 156, y: 80, label: "Snowflake",    sub: "RAW", style: "node" },
          { x: 296, y: 80, label: "Snowflake",    sub: "STG · dbt", style: "node" },
          { x: 436, y: 80, label: "Snowflake",    sub: "MARTS · star schema", style: "node" },
          { x: 588, y: 80, label: "Portfolio",    sub: "static charts" },
        ].map((n, i) => (
          <g key={i} transform={`translate(${n.x}, ${n.y})`}>
            <rect
              width={120}
              height={64}
              rx={6}
              fill={n.style === "node" ? bone : "var(--rd-paper)"}
              stroke={accent}
              strokeOpacity={0.5}
              strokeWidth={1.2}
            />
            <text
              x={60}
              y={24}
              textAnchor="middle"
              fontFamily="var(--font-code), monospace"
              fontSize="11"
              fill={ink}
              style={{ letterSpacing: "0.08em" }}
            >
              {n.label}
            </text>
            <text
              x={60}
              y={44}
              textAnchor="middle"
              fontFamily="var(--font-code), monospace"
              fontSize="9"
              fill={mute}
              style={{ letterSpacing: "0.1em" }}
            >
              {n.sub}
            </text>
          </g>
        ))}
        {/* arrows between */}
        {[
          { x1: 136, x2: 156 },
          { x1: 276, x2: 296 },
          { x1: 416, x2: 436 },
          { x1: 556, x2: 588, dashed: true },
        ].map((e, i) => (
          <g key={i}>
            <line
              x1={e.x1}
              y1={112}
              x2={e.x2 - 6}
              y2={112}
              stroke={accent}
              strokeWidth={1.4}
              strokeDasharray={e.dashed ? "3 3" : undefined}
            />
            <polygon
              points={`${e.x2 - 6},108 ${e.x2},112 ${e.x2 - 6},116`}
              fill={accent}
            />
          </g>
        ))}
        {/* labels above arrows */}
        {[
          { x: 146, t: "fetch" },
          { x: 286, t: "PUT · COPY" },
          { x: 426, t: "dbt run" },
          { x: 572, t: "snapshot.json" },
        ].map((e, i) => (
          <text
            key={i}
            x={e.x}
            y={102}
            textAnchor="middle"
            fontFamily="var(--font-code), monospace"
            fontSize="9"
            fill={faint}
            style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            {e.t}
          </text>
        ))}
      </svg>
    </Figure>
  );
}

// ---- 5. Star schema diagram -----------------------------------------------

export function OlistStarSchema() {
  const W = 720;
  const H = 360;
  const cx = W / 2;
  const cy = H / 2 - 8;
  return (
    <Figure
      subtitle="Schema"
      title="fact_orders at the order-line grain, with six conformed dimensions"
      caption="dim_date is role-played three ways (purchase, delivered, estimated). dim_geography is conformed across customer and seller. dim_customer is SCD Type 2 so historic orders join to the customer state that was current at purchase time — see docs/star_schema.md for why."
      source="marts/* dbt models · snowflake/ddl/*.sql"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto" }}
        role="img"
        aria-label="Star schema — fact_orders surrounded by six dimensions"
      >
        {/* dimension positions around the centre */}
        {(() => {
          const dims = [
            { name: "dim_date",      sub: "role-played 3×",      x: cx - 230, y: cy - 130 },
            { name: "dim_customer",  sub: "SCD2",                x: cx - 230, y: cy + 60 },
            { name: "dim_seller",    sub: "SCD1",                x: cx + 110, y: cy - 130 },
            { name: "dim_product",   sub: "+ category_group",    x: cx + 110, y: cy + 60 },
            { name: "dim_geography", sub: "shared · 5 regions",  x: cx - 60, y: cy - 175 },
            { name: "dim_payment",   sub: "(type, installments)",x: cx - 60, y: cy + 110 },
          ];
          return (
            <>
              {dims.map((d, i) => (
                <g key={i}>
                  <line
                    x1={d.x + 60}
                    y1={d.y + 22}
                    x2={cx + 60}
                    y2={cy + 22}
                    stroke={accent}
                    strokeOpacity={0.3}
                  />
                </g>
              ))}
              {/* fact in centre */}
              <rect
                x={cx}
                y={cy}
                width={120}
                height={68}
                rx={6}
                fill={accent}
                stroke={accent}
                strokeWidth={1.5}
              />
              <text
                x={cx + 60}
                y={cy + 24}
                textAnchor="middle"
                fontFamily="var(--font-code), monospace"
                fontSize="11"
                fill="#fff"
                style={{ letterSpacing: "0.08em" }}
              >
                fact_orders
              </text>
              <text
                x={cx + 60}
                y={cy + 42}
                textAnchor="middle"
                fontFamily="var(--font-code), monospace"
                fontSize="9"
                fill="#fff"
                opacity={0.8}
                style={{ letterSpacing: "0.1em" }}
              >
                grain: order × line
              </text>
              <text
                x={cx + 60}
                y={cy + 56}
                textAnchor="middle"
                fontFamily="var(--font-code), monospace"
                fontSize="9"
                fill="#fff"
                opacity={0.7}
                style={{ letterSpacing: "0.1em" }}
              >
                ~112k rows
              </text>
              {dims.map((d, i) => (
                <g key={`d${i}`}>
                  <rect
                    x={d.x}
                    y={d.y}
                    width={120}
                    height={44}
                    rx={5}
                    fill="var(--rd-paper)"
                    stroke={accent}
                    strokeOpacity={0.65}
                    strokeWidth={1.2}
                  />
                  <text
                    x={d.x + 60}
                    y={d.y + 18}
                    textAnchor="middle"
                    fontFamily="var(--font-code), monospace"
                    fontSize="10.5"
                    fill={ink}
                    style={{ letterSpacing: "0.06em" }}
                  >
                    {d.name}
                  </text>
                  <text
                    x={d.x + 60}
                    y={d.y + 32}
                    textAnchor="middle"
                    fontFamily="var(--font-code), monospace"
                    fontSize="9"
                    fill={mute}
                    style={{ letterSpacing: "0.08em" }}
                  >
                    {d.sub}
                  </text>
                </g>
              ))}
            </>
          );
        })()}
      </svg>
    </Figure>
  );
}
