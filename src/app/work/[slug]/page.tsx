import { notFound } from "next/navigation";
import Link from "next/link";
import { Column, Meta } from "@once-ui-system/core";
import { Metadata } from "next";
import { slugify as transliterate } from "transliteration";
import { baseURL, about, person, work } from "@/resources";
import { getPosts } from "@/utils/utils";
import {
  BlogPostingSchema,
  BreadcrumbSchema,
  CustomMDX,
  ErrorBoundary,
  ScrollToHash,
} from "@/components";
import { ProjectCover, accentFor } from "@/components/covers";
import { Prose } from "@/components/reading/Prose";
import styles from "@/components/work/ProjectDetail.module.scss";

export const dynamic = "force-static";

const TIER_ORDER: Record<string, number> = { featured: 0, production: 1, tools: 2, analysis: 3 };
const STATUS_BY_TIER: Record<string, string> = {
  featured: "Demo-ready",
  production: "Shipped",
  tools: "Live",
  analysis: "Archived",
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getPosts(["src", "app", "work", "projects"]).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const post = getPosts(["src", "app", "work", "projects"]).find((p) => p.slug === slugPath);
  if (!post) return {};

  const ogImage = `${baseURL}${person.avatar}`;
  const metadata = Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: ogImage,
    path: `${work.path}/${post.slug}`,
  });
  return {
    ...metadata,
    alternates: { canonical: `${baseURL}${work.path}/${post.slug}` },
  };
}

function slugifyHeading(text: string): string {
  return transliterate(text.replace(/&/g, " and "), { lowercase: true, separator: "-" }).replace(
    /-{2,}/g,
    "-",
  );
}

/** Extract H2 headings from raw MDX content for the TOC. */
function extractH2s(content: string): { id: string; text: string }[] {
  const lines = content.split("\n");
  const out: { id: string; text: string }[] = [];
  let inFence = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      const text = m[1].replace(/[*_`]/g, "");
      out.push({ id: slugifyHeading(text), text });
    }
  }
  return out;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const allProjects = getPosts(["src", "app", "work", "projects"]).sort((a, b) => {
    const ta = TIER_ORDER[a.metadata.tier ?? "analysis"] ?? 9;
    const tb = TIER_ORDER[b.metadata.tier ?? "analysis"] ?? 9;
    if (ta !== tb) return ta - tb;
    return (b.metadata.year ?? 0) - (a.metadata.year ?? 0);
  });

  const idx = allProjects.findIndex((p) => p.slug === slugPath);
  if (idx === -1) notFound();
  const post = allProjects[idx];
  const prev = idx > 0 ? allProjects[idx - 1] : null;
  const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : null;

  const tier = post.metadata.tier ?? "analysis";
  const domains = post.metadata.domains ?? [];
  const year = post.metadata.year ?? new Date(post.metadata.publishedAt).getFullYear();
  const primaryDomain = domains[0] ?? "";
  const restDomains = domains.slice(1);
  const accent = accentFor(post.slug);

  const role = post.metadata.role ?? post.metadata.team?.[0]?.role;
  const collaborator = post.metadata.collaborator;
  const timeline = post.metadata.timeline ?? (year ? String(year) : undefined);
  const stack = post.metadata.stack;
  const status = post.metadata.status ?? STATUS_BY_TIER[tier];

  const metaCells: { k: string; v: string; accent?: boolean }[] = [];
  if (role) metaCells.push({ k: "Role", v: role });
  if (collaborator) metaCells.push({ k: "With", v: collaborator });
  if (timeline) metaCells.push({ k: "Timeline", v: timeline });
  if (stack) metaCells.push({ k: "Stack", v: stack });
  if (status) metaCells.push({ k: "Status", v: status, accent: true });

  const toc = extractH2s(post.content);

  return (
    <Column maxWidth="l" fillWidth paddingTop="24">
      <BlogPostingSchema
        path={`${work.path}/${post.slug}`}
        title={post.metadata.title}
        description={post.metadata.summary}
        datePublished={post.metadata.publishedAt}
        dateModified={post.metadata.publishedAt}
        image={person.avatar}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Work", href: work.path },
          { name: post.metadata.title, href: `${work.path}/${post.slug}` },
        ]}
      />

      <article className={styles.page}>
        <div className={styles.crumb}>
          <Link href={work.path}>← All work</Link>
          <span className={styles.crumbSep}>/</span>
          <span>{domains.join(" · ") || "Work"}</span>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbCurrent}>{post.metadata.title}</span>
        </div>

        <section className={styles.hero}>
          <div>
            <div className={styles.heroEyebrow}>
              {primaryDomain && <span style={{ color: accent }}>● {primaryDomain}</span>}
              {restDomains.map((d) => (
                <span key={d}>
                  <span style={{ color: "var(--rd-line)" }}>·</span> {d}
                </span>
              ))}
              <span>·</span>
              <span>{year}</span>
              {status && (
                <span className={styles.heroStatus}>
                  <span className={styles.statusDot} style={{ background: accent }} />
                  {status}
                </span>
              )}
            </div>
            <h1 className={styles.heroTitle}>{post.metadata.title}</h1>
            <p className={styles.heroDeck}>{post.metadata.summary}</p>
            <div className={styles.heroActions}>
              {post.metadata.link && (
                <a
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  href={post.metadata.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on GitHub ↗
                </a>
              )}
              {post.metadata.deck && (
                <a
                  className={styles.btn}
                  href={post.metadata.deck}
                  target="_blank"
                  rel="noreferrer"
                >
                  ▶ Walk through the deck
                </a>
              )}
              <a className={styles.btn} href="#writeup">
                Jump to writeup ↓
              </a>
            </div>
          </div>
          <div className={styles.heroCover}>
            <ProjectCover slug={post.slug} tier={tier} radius={6} />
          </div>
        </section>

        {metaCells.length > 0 && (
          <section
            className={styles.meta}
            style={{ gridTemplateColumns: `repeat(${metaCells.length}, 1fr)` }}
          >
            {metaCells.map((c) => (
              <div key={c.k} className={styles.metaCell}>
                <div className={styles.metaKey}>{c.k}</div>
                <div
                  className={`${styles.metaVal} ${c.accent ? styles.metaValAccent : ""}`}
                  style={c.accent ? { color: accent } : undefined}
                >
                  {c.v}
                </div>
              </div>
            ))}
          </section>
        )}

        <div className={styles.body} id="writeup">
          {toc.length > 0 ? (
            <aside className={styles.toc}>
              <div className={styles.tocLabel}>Contents</div>
              <ol className={styles.tocList}>
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
              {post.metadata.link && (
                <div className={styles.tocCta}>
                  <a
                    className={`${styles.btn} ${styles.btnGhost}`}
                    href={post.metadata.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Repo ↗
                  </a>
                </div>
              )}
            </aside>
          ) : (
            <div />
          )}
          <ErrorBoundary>
            <Prose>
              <CustomMDX source={post.content} />
            </Prose>
          </ErrorBoundary>
        </div>

        {(prev || next) && (
          <nav className={styles.prevNext}>
            {prev ? (
              <Link className={styles.prevNextLink} href={`/work/${prev.slug}`}>
                <div className={styles.prevNextLabel}>← Previous</div>
                <div className={styles.prevNextTitle}>{prev.metadata.title}</div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                className={`${styles.prevNextLink} ${styles.prevNextRight}`}
                href={`/work/${next.slug}`}
              >
                <div className={styles.prevNextLabel}>Next →</div>
                <div className={styles.prevNextTitle}>{next.metadata.title}</div>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>
      <ScrollToHash />
    </Column>
  );
}
