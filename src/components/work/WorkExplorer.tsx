"use client";

import { type CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProjectCover, accentFor } from "@/components/covers";
import styles from "./WorkExplorer.module.scss";

export interface WorkProject {
  slug: string;
  title: string;
  summary: string;
  link: string;
  tier: "featured" | "production" | "tools" | "analysis";
  domains: string[];
  year: number;
  metric: string;
  isNew: boolean;
}

interface WorkExplorerProps {
  projects: WorkProject[];
}

const DOMAIN_FILTERS: { id: string; label: string; test: (p: WorkProject) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "featured", label: "Featured", test: (p) => p.tier === "featured" },
  { id: "research", label: "Research", test: (p) => p.domains.includes("Research") },
  { id: "production", label: "Production ML", test: (p) => p.domains.includes("Production ML") },
  { id: "tools", label: "Tools", test: (p) => p.domains.includes("Tools") },
  { id: "systems", label: "Systems", test: (p) => p.domains.includes("Systems") },
  { id: "ml-foundations", label: "ML Foundations", test: (p) => p.domains.includes("ML Foundations") },
  { id: "analysis", label: "Analysis", test: (p) => p.domains.includes("Analysis") },
  { id: "healthcare", label: "Healthcare", test: (p) => p.domains.includes("Healthcare") },
  { id: "finance", label: "Finance", test: (p) => p.domains.includes("Finance") },
  { id: "sports", label: "Sports", test: (p) => p.domains.includes("Sports") },
];

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "domain", label: "By domain" },
];

const TIER_ORDER: Record<WorkProject["tier"], number> = {
  featured: 0,
  production: 1,
  tools: 2,
  analysis: 3,
};

function sortProjects(list: WorkProject[], mode: string): WorkProject[] {
  const arr = [...list];
  if (mode === "newest") {
    arr.sort((a, b) => b.year - a.year);
  } else if (mode === "domain") {
    arr.sort((a, b) => {
      const t = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
      return t !== 0 ? t : (a.domains[0] ?? "").localeCompare(b.domains[0] ?? "");
    });
  } else {
    arr.sort((a, b) => {
      const t = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
      return t !== 0 ? t : b.year - a.year;
    });
  }
  return arr;
}

function WorkCard({ p, size }: { p: WorkProject; size: "lg" | "md" }) {
  const big = size === "lg";
  return (
    <Link
      href={`/work/${p.slug}`}
      className={`${styles.card} ${big ? styles.cardLg : styles.cardMd}`}
      style={{ "--card-accent": accentFor(p.slug) } as CSSProperties}
    >
      <div className={styles.cover}>
        <ProjectCover slug={p.slug} tier={p.tier} isNew={p.isNew} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTag}>
          {p.domains.join(" · ")} · {p.year}
        </div>
        <h3 className={styles.cardTitle}>{p.title}</h3>
        {big && p.summary && <p className={styles.cardBlurb}>{p.summary}</p>}
        <div className={styles.cardFoot}>
          <span className={styles.cardMetric}>{p.metric}</span>
          <span className={styles.cardArrow}>↗</span>
        </div>
      </div>
    </Link>
  );
}

export function WorkExplorer({ projects }: WorkExplorerProps) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("featured");

  // Hydrate filter/sort from URL on mount (avoids useSearchParams, which
  // would suspend the whole subtree during static export).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const f = p.get("filter");
    const s = p.get("sort");
    if (f) setFilter(f);
    if (s) setSort(s);
  }, []);

  const syncUrl = useCallback((nextFilter: string, nextSort: string) => {
    const p = new URLSearchParams();
    if (nextFilter !== "all") p.set("filter", nextFilter);
    if (nextSort !== "featured") p.set("sort", nextSort);
    const q = p.toString();
    const url = q ? `${window.location.pathname}?${q}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, []);

  const onFilter = (id: string) => {
    setFilter(id);
    syncUrl(id, sort);
  };
  const onSort = (id: string) => {
    setSort(id);
    syncUrl(filter, id);
  };

  const activeFilter = DOMAIN_FILTERS.find((f) => f.id === filter) ?? DOMAIN_FILTERS[0];

  const sorted = useMemo(() => {
    const filtered = projects.filter(activeFilter.test);
    return sortProjects(filtered, sort);
  }, [projects, activeFilter, sort]);

  const featured = sorted.filter((p) => p.tier === "featured");
  const rest = sorted.filter((p) => p.tier !== "featured");
  const showFeaturedRow = filter === "all" && sort === "featured" && featured.length > 0;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroEyebrow}>
          <span className={styles.dot} />
          Open to roles · summer 2026 &nbsp;·&nbsp; Nashville, TN ↔ Saba, NL
        </div>
        <h1 className={styles.heroTitle}>
          Selected work, <em className={styles.heroItalic}>filtered.</em>
        </h1>
        <p className={styles.heroSub}>
          {projects.length} projects across research, production ML, tools, and analysis. Filter by
          what brought you here — each entry links to a deeper case study and the source repo.
        </p>
      </header>

      <div className={styles.controls}>
        <div className={styles.chips}>
          {DOMAIN_FILTERS.map((f) => {
            const count = projects.filter(f.test).length;
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                onClick={() => onFilter(f.id)}
              >
                {f.label}
                <span className={styles.chipCount}>{count}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.sort}>
          <span className={styles.sortLabel}>Sort</span>
          <div className={styles.sortGroup}>
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`${styles.sortBtn} ${sort === s.id ? styles.sortBtnActive : ""}`}
                onClick={() => onSort(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.resultLine}>
        <span className={styles.countPill}>
          Showing <strong>{sorted.length}</strong> of {projects.length}
        </span>
        {filter !== "all" && (
          <button type="button" className={styles.clearBtn} onClick={() => onFilter("all")}>
            Clear filter ✕
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className={styles.empty}>Nothing here yet — try another filter.</div>
      ) : showFeaturedRow ? (
        <>
          <div className={styles.sectLabel}>★ Featured · {featured.length}</div>
          <div className={`${styles.grid} ${styles.gridFeat}`}>
            {featured.map((p) => (
              <WorkCard key={p.slug} p={p} size="lg" />
            ))}
          </div>
          <div className={styles.sectLabel}>Index · {rest.length}</div>
          <div className={`${styles.grid} ${styles.gridIdx}`}>
            {rest.map((p) => (
              <WorkCard key={p.slug} p={p} size="md" />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={styles.sectLabel}>
            {filter !== "all" ? `${activeFilter.label} · ${sorted.length}` : `All · ${sorted.length}`}
          </div>
          <div className={`${styles.grid} ${styles.gridIdx}`}>
            {sorted.map((p) => (
              <WorkCard key={p.slug} p={p} size="md" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
