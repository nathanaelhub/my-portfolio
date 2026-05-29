"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BlogCard } from "./BlogCard";
import styles from "./BlogIndex.module.scss";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMins: number;
  topic: string;
}

interface BlogIndexProps {
  posts: BlogPost[];
}

const TOPICS = ["All", "Ethics", "Statistics", "Engineering", "Analysis"];

function topicId(topic: string) {
  return topic.toLowerCase();
}

export function BlogIndexClient({ posts }: BlogIndexProps) {
  const [activeTopic, setActiveTopic] = useState<string>("all");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("topic");
    if (t) setActiveTopic(t.toLowerCase());
  }, []);

  const syncUrl = useCallback((id: string) => {
    const p = new URLSearchParams();
    if (id !== "all") p.set("topic", id);
    const q = p.toString();
    const url = q ? `${window.location.pathname}?${q}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, []);

  const onTopic = (id: string) => {
    setActiveTopic(id);
    syncUrl(id);
  };

  const filtered = useMemo(() => {
    if (activeTopic === "all") return posts;
    return posts.filter((p) => p.topic.toLowerCase() === activeTopic);
  }, [posts, activeTopic]);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroEyebrow}>
          <span className={styles.dot} />
          {posts.length} posts · Updated monthly
        </div>
        <h1 className={styles.heroTitle}>
          Notes from the <em className={styles.heroItalic}>middle</em> of the work.
        </h1>
        <p className={styles.heroSub}>
          Things I&apos;ve learned applying AI and data science to real problems — written when
          the lesson is still fresh, not after it&apos;s been smoothed into a conclusion.
        </p>
      </header>

      <div className={styles.controls}>
        <div className={styles.chips}>
          {TOPICS.map((t) => {
            const id = topicId(t);
            const count = t === "All" ? posts.length : posts.filter((p) => p.topic === t).length;
            const active = activeTopic === id;
            return (
              <button
                key={t}
                type="button"
                className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                onClick={() => onTopic(id)}
              >
                {t}
                <span className={styles.chipCount}>{count}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.rss}>
          <span className={styles.rssLabel}>RSS</span>
          <a className={styles.rssLink} href="/api/rss">
            /feed.xml ↗
          </a>
        </div>
      </div>

      <div className={styles.resultLine}>
        <span className={styles.countPill}>
          Showing <strong>{filtered.length}</strong> of {posts.length}
        </span>
      </div>

      <div className={styles.sectLabel}>Latest · {filtered.length}</div>
      {filtered.length === 0 ? (
        <div className={styles.empty}>Nothing here yet — try another topic.</div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
