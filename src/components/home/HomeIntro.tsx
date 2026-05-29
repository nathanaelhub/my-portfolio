import type { CSSProperties, ComponentType } from "react";
import Link from "next/link";
import { coverMeta } from "@/components/covers";
import styles from "./HomeIntro.module.scss";

export interface HomeProject {
  slug: string;
  title: string;
  summary: string;
  domains: string[];
  year: number;
  tier: string;
  metric?: string;
}

export interface HomePost {
  slug: string;
  title: string;
  date: string;
  topic: string;
}

interface HomeIntroProps {
  projects: HomeProject[];
  totalCount: number;
  recentPosts: HomePost[];
  totalPosts: number;
}

const DOMAIN_TINTS: Record<string, { light: string; dark: string; accent: string }> = {
  Research: { light: "#f0f4ff", dark: "#1f2030", accent: "#2455ff" },
  "Production ML": { light: "#eef9ee", dark: "#1b2620", accent: "#3a8a4a" },
  Healthcare: { light: "#eef4f9", dark: "#1a2433", accent: "#2a6fc4" },
  Finance: { light: "#fff8e6", dark: "#251f12", accent: "#c98a00" },
  Sports: { light: "#fdecec", dark: "#2a1f1f", accent: "#c34f4f" },
  Hospitality: { light: "#eef9ee", dark: "#1b2620", accent: "#3a8a4a" },
  Tools: { light: "#f3eefb", dark: "#231f2e", accent: "#7853c4" },
  Analysis: { light: "#f5efe3", dark: "#26211a", accent: "#a4622a" },
  Tech: { light: "#eaeef7", dark: "#1c1f2e", accent: "#1c2b5e" },
};

function tintFor(p: HomeProject) {
  for (const d of p.domains) {
    if (DOMAIN_TINTS[d]) return DOMAIN_TINTS[d];
  }
  return DOMAIN_TINTS.Analysis;
}

function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function FeatCard({ p }: { p: HomeProject }) {
  const meta = coverMeta[p.slug];
  const Cover: ComponentType | undefined = meta?.Component;
  const tint = tintFor(p);
  const accent = meta?.accent ?? tint.accent;
  const tag = `${p.domains[0] ?? "Project"} · ${p.year}`;
  const style = {
    "--card-tint-light": tint.light,
    "--card-tint-dark": tint.dark,
    "--card-accent": accent,
  } as CSSProperties;

  return (
    <Link href={`/work/${p.slug}`} className={`${styles.card} ${styles.cardFeat}`} style={style}>
      <div className={styles.cardHead}>
        <div className={styles.cardTag}>{tag}</div>
        <div className={styles.cardTitle}>{p.title}</div>
        {p.summary && <div className={styles.cardBody}>{p.summary}</div>}
      </div>
      <div className={styles.cardFoot}>
        <span className={styles.cardMetric}>{p.metric || p.domains.join(" · ")}</span>
        <span className={styles.cardArrow}>→</span>
      </div>
      {Cover && (
        <div className={styles.cardCover}>
          <Cover />
        </div>
      )}
    </Link>
  );
}

function SmallCard({ p }: { p: HomeProject }) {
  const meta = coverMeta[p.slug];
  const Cover: ComponentType | undefined = meta?.Component;
  const tint = tintFor(p);
  const accent = meta?.accent ?? tint.accent;
  const tag = `${p.domains[0] ?? "Project"} · ${p.year}`;
  const style = {
    "--card-tint-light": tint.light,
    "--card-tint-dark": tint.dark,
    "--card-accent": accent,
  } as CSSProperties;

  return (
    <Link href={`/work/${p.slug}`} className={styles.card} style={style}>
      <div className={styles.cardHead}>
        <div className={styles.cardTag}>{tag}</div>
        <div className={styles.cardTitle}>{p.title}</div>
      </div>
      <div className={styles.cardFoot}>
        <span className={styles.cardMetric}>{p.metric || p.domains[0]}</span>
        <span className={styles.cardArrow}>→</span>
      </div>
      {Cover && (
        <div className={styles.cardCover}>
          <Cover />
        </div>
      )}
    </Link>
  );
}

function PostTeaser({ post }: { post: HomePost }) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.post}>
      <div className={styles.postMeta}>
        <span>{formatMonthYear(post.date)}</span>
        <span>·</span>
        <span>{post.topic}</span>
      </div>
      <div className={styles.postTitle}>{post.title}</div>
      <div className={styles.postArr}>Read essay →</div>
    </Link>
  );
}

export function HomeIntro({ projects, totalCount, recentPosts, totalPosts }: HomeIntroProps) {
  const feat = projects[0];
  const rest = projects.slice(1, 6);
  const remaining = Math.max(0, totalCount - 1 - rest.length);
  const justShipped = projects.find((p) => p.tier === "featured") ?? projects[0];

  return (
    <section className={styles.page}>
      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.pills}>
          {justShipped && (
            <span className={styles.pill}>
              <span className={`${styles.pillDot} ${styles.pillDotAccent}`} />
              Just shipped — {justShipped.title}
            </span>
          )}
        </div>
        <div className={styles.greeting}>Hello, I&apos;m</div>
        <h1 className={styles.displayName}>
          Nathanael
          <br />
          Johnson<span className={styles.accent}>.</span>
        </h1>
        <p className={styles.role}>
          <strong>Applied AI &amp; data-science engineer.</strong> I focus on the boring, decisive
          part of an ML project — evaluation, bias, deployment — across healthcare, finance, and
          sports. Currently based in Nashville, originally from Saba.
        </p>
        <div className={styles.heroCta}>
          <Link className={`${styles.btn} ${styles.btnPrimary}`} href="/work">
            See selected work →
          </Link>
          <Link className={styles.btn} href="/blog">
            Read the research →
          </Link>
        </div>
      </header>

      {/* Selected work */}
      <div className={styles.sectionHead} id="work">
        <span className={styles.sectionLabel}>Selected work</span>
        <div className={styles.chips}>
          <Link href="/work" className={`${styles.chip} ${styles.chipActive}`}>
            All
          </Link>
          <Link href="/work?filter=research" className={styles.chip}>
            Research
          </Link>
          <Link href="/work?filter=healthcare" className={styles.chip}>
            Healthcare
          </Link>
          <Link href="/work?filter=finance" className={styles.chip}>
            Finance
          </Link>
          <Link href="/work?filter=sports" className={styles.chip}>
            Sports
          </Link>
          <Link href="/work?filter=tools" className={styles.chip}>
            Tools
          </Link>
        </div>
      </div>

      <div className={styles.workGrid}>
        {feat && <FeatCard p={feat} />}
        {rest.map((p) => (
          <SmallCard key={p.slug} p={p} />
        ))}
        <Link href="/work" className={`${styles.card} ${styles.cardMore}`}>
          <div>
            <div className={styles.cardTagMute}>+ {remaining} more</div>
            <div className={styles.cardTitle}>See the full index</div>
          </div>
          <div className={styles.cardFoot}>
            <span className={styles.cardMetric}>2023 — {new Date().getFullYear()}</span>
            <span className={styles.cardArrow}>→</span>
          </div>
          <div className={styles.moreGlyph}>↗</div>
        </Link>
      </div>

      {/* Writing */}
      {recentPosts.length > 0 && (
        <>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>Recent writing</span>
            <Link href="/blog" className={styles.chip}>
              See all {totalPosts} →
            </Link>
          </div>
          <div className={styles.postRow}>
            {recentPosts.map((post) => (
              <PostTeaser key={post.slug} post={post} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
