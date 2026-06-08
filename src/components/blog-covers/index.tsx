/**
 * Blog cover registry — maps each post slug to its cover artwork + palette.
 */
import type { ComponentType, CSSProperties } from "react";
import {
  AIEthicsCover,
  BeyondPValueCover,
  DatabaseConvCover,
  EthicalDecisionCover,
  NashvilleBlogCover,
  ThreeIdsCover,
} from "./CoverArt";

export interface BlogCoverMeta {
  Component: ComponentType;
  tint: string;
  accent: string;
}

export const blogCoverMeta: Record<string, BlogCoverMeta> = {
  "ai-ethics-journey": { Component: AIEthicsCover, tint: "#f9f1eb", accent: "#d97757" },
  "beyond-the-p-value": { Component: BeyondPValueCover, tint: "#fdf6ec", accent: "#a4622a" },
  "database-conversion-journey": { Component: DatabaseConvCover, tint: "#eef0f7", accent: "#2a4dbd" },
  "ethical-decision-making-data": { Component: EthicalDecisionCover, tint: "#f3f7f3", accent: "#3a8a4a" },
  "nashville-airbnb-analysis": { Component: NashvilleBlogCover, tint: "#eef4ee", accent: "#3a8a4a" },
  "three-ids-one-user": { Component: ThreeIdsCover, tint: "#eef4fb", accent: "#2a6fc4" },
};

const FALLBACK_ACCENT = "#d97757";

export function blogAccentFor(slug: string): string {
  return blogCoverMeta[slug]?.accent ?? FALLBACK_ACCENT;
}

interface BlogCoverProps {
  slug: string;
  /** Override the default 16:9 aspect (post hero uses 16:7). */
  aspectRatio?: string;
  radius?: number;
}

/**
 * Tinted frame wrapping a blog post's cover artwork.
 * Defaults to 16:9 for index cards; pass aspectRatio="16 / 7" for the post hero.
 */
export function BlogCover({ slug, aspectRatio = "16 / 9", radius = 5 }: BlogCoverProps) {
  const meta = blogCoverMeta[slug];
  const containerStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    aspectRatio,
    borderRadius: radius,
    overflow: "hidden",
    border: "1px solid var(--rd-line)",
    background: meta?.tint ?? "var(--rd-bone)",
  };
  if (!meta) return <div style={containerStyle} />;
  const { Component } = meta;
  return (
    <div style={containerStyle}>
      <Component />
    </div>
  );
}
