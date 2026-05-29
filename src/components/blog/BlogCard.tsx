import type { CSSProperties } from "react";
import Link from "next/link";
import { BlogCover, blogAccentFor } from "@/components/blog-covers";
import styles from "./BlogIndex.module.scss";

export interface BlogCardData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMins: number;
  topic: string;
}

function formatDate(iso: string) {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={styles.card}
      style={{ "--card-accent": blogAccentFor(post.slug) } as CSSProperties}
    >
      <div className={styles.cardCover}>
        <BlogCover slug={post.slug} />
      </div>
      <div className={styles.cardMeta}>
        <span style={{ color: blogAccentFor(post.slug) }}>● {post.topic}</span>
        <span>{formatDate(post.date)}</span>
        <span>{post.readMins} min read</span>
      </div>
      <h2 className={styles.cardTitle}>{post.title}</h2>
      <p className={styles.cardExcerpt}>{post.excerpt}</p>
      <div className={styles.cardFoot}>
        <span>Read essay</span>
        <span className={styles.cardArrow}>→</span>
      </div>
    </Link>
  );
}
