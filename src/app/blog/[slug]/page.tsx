import { notFound } from "next/navigation";
import Link from "next/link";
import { Column, Meta } from "@once-ui-system/core";
import { Metadata } from "next";
import { baseURL, about, blog, person } from "@/resources";
import { getPosts } from "@/utils/utils";
import {
  BlogPostingSchema,
  BreadcrumbSchema,
  CustomMDX,
  ErrorBoundary,
  ScrollToHash,
} from "@/components";
import { BlogCover, blogAccentFor } from "@/components/blog-covers";
import { BlogCard, type BlogCardData } from "@/components/blog/BlogCard";
import { Prose } from "@/components/reading/Prose";
import styles from "@/components/blog/BlogPost.module.scss";

export const dynamic = "force-static";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getPosts(["src", "app", "blog", "posts"]).map((post) => ({ slug: post.slug }));
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

  const post = getPosts(["src", "app", "blog", "posts"]).find((p) => p.slug === slugPath);
  if (!post) return {};

  const ogImage = `${baseURL}${person.avatar}`;
  const metadata = Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: ogImage,
    path: `${blog.path}/${post.slug}`,
  });
  return {
    ...metadata,
    alternates: { canonical: `${baseURL}${blog.path}/${post.slug}` },
  };
}

function formatDate(iso: string) {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const allPosts = getPosts(["src", "app", "blog", "posts"]).sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  );
  const post = allPosts.find((p) => p.slug === slugPath);
  if (!post) notFound();

  const topic = post.metadata.topic || post.metadata.tag || "Notes";
  const readMins = post.metadata.readMins ?? 5;
  const excerpt = post.metadata.excerpt || post.metadata.summary;
  const accent = blogAccentFor(post.slug);

  const related: BlogCardData[] = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2)
    .map((p) => ({
      slug: p.slug,
      title: p.metadata.title,
      excerpt: p.metadata.excerpt || p.metadata.summary,
      date: p.metadata.publishedAt,
      readMins: p.metadata.readMins ?? 5,
      topic: p.metadata.topic || p.metadata.tag || "Notes",
    }));

  return (
    <Column maxWidth="l" fillWidth paddingTop="24">
      <BlogPostingSchema
        path={`${blog.path}/${post.slug}`}
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
          { name: "Writing", href: blog.path },
          { name: post.metadata.title, href: `${blog.path}/${post.slug}` },
        ]}
      />

      <article className={styles.page}>
        <div className={styles.crumb}>
          <Link href={blog.path}>← All writing</Link>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbCurrent}>{topic}</span>
        </div>

        <div className={styles.postHero}>
          <BlogCover slug={post.slug} aspectRatio="16 / 7" radius={0} />
        </div>

        <header className={styles.head}>
          <div className={styles.eyebrow}>
            <span style={{ color: accent }}>● {topic}</span>
            <span>{formatDate(post.metadata.publishedAt)}</span>
            <span>·</span>
            <span>{readMins} min read</span>
          </div>
          <h1 className={styles.title}>{post.metadata.title}</h1>
          <p className={styles.deck}>{excerpt}</p>
          <div className={styles.byline}>
            <div className={styles.monogram}>nj</div>
            <div>
              <div className={styles.bylineName}>{person.name}</div>
              <div className={styles.bylineSub}>MS Applied AI · Nashville, TN</div>
            </div>
            <div className={styles.bylineActions}>
              <a
                className={styles.bylineBtn}
                href={`mailto:${person.email}?subject=${encodeURIComponent(post.metadata.title)}`}
              >
                Share
              </a>
            </div>
          </div>
        </header>

        <div className={styles.body}>
          <ErrorBoundary>
            <Prose>
              <CustomMDX source={post.content} />
            </Prose>
          </ErrorBoundary>
        </div>

        <div className={styles.endBlock}>
          <div className={styles.endRule} />
          <div className={styles.endText}>
            <em>Thanks for reading.</em> If anything here pushed your thinking — or pushed back on
            it — I&apos;d love a note: <a href={`mailto:${person.email}`}>{person.email}</a>.
          </div>
        </div>

        {related.length > 0 && (
          <>
            <div className={styles.sectLabel}>Continue reading</div>
            <div className={styles.grid}>
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </>
        )}
      </article>
      <ScrollToHash />
    </Column>
  );
}
