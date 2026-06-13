/**
 * Cover registry — maps each project slug to its cover artwork and palette.
 * tint / accent / dark values come from the design handoff (README §3).
 */
import type { ComponentType } from "react";
import {
  AirCanvas, Airline, ApexFinance, Attrition, AudioVisualizer, Backprop, Birds,
  BisonChat, Cars, CMlLibrary, Commentary, CppPhysics, F1, FraudGuard, GravitySim,
  HumeVoice, Internet, Letterboxd, LineUp, Lyft, MarvelRivals, MentalHealth,
  Nashville, NumpyNN, OlistWarehouse, PhysicsMuseum, Portfolio, PTAssist,
  Restaurant, RustTui, Saba,
} from "./CoverArt";

export interface CoverMeta {
  Component: ComponentType;
  tint: string;
  accent: string;
  dark?: boolean;
}

export const coverMeta: Record<string, CoverMeta> = {
  "mental-health-llm-evaluation": { Component: MentalHealth, tint: "#ffffff", accent: "#d97757" },
  "pt-assist": { Component: PTAssist, tint: "#eef4f9", accent: "#2a6fc4" },
  "ai-sports-commentary": { Component: Commentary, tint: "#faeede", accent: "#8a3a00" },
  "fraudguard-ai": { Component: FraudGuard, tint: "#fff0ee", accent: "#c43838" },
  "f1-race-predictor": { Component: F1, tint: "#1c1b18", accent: "#e84a4a", dark: true },
  "airline-revenue-optimization": { Component: Airline, tint: "#fdf6ec", accent: "#c98a00" },
  "portfolio-optimization-dashboard": { Component: Portfolio, tint: "#f0f2f6", accent: "#2a4dbd" },
  "hume-voice-demo": { Component: HumeVoice, tint: "#f1ecf6", accent: "#6e4ba8" },
  "letterboxd-random": { Component: Letterboxd, tint: "#1c1b18", accent: "#ff8000", dark: true },
  "saban-realty": { Component: Saba, tint: "#e8f1ee", accent: "#0f6b5e" },
  "marvel-rivals-assistant": { Component: MarvelRivals, tint: "#fde8ec", accent: "#e0457b" },
  "bison-chat": { Component: BisonChat, tint: "#eaeef7", accent: "#1c2b5e" },
  "nashville-airbnb-analysis": { Component: Nashville, tint: "#eef4ee", accent: "#3a8a4a" },
  "restaurant-review-analysis": { Component: Restaurant, tint: "#f5efe3", accent: "#a4622a" },
  "bird-data-analysis": { Component: Birds, tint: "#eef6f5", accent: "#2a8a8a" },
  "internet-usage-analysis": { Component: Internet, tint: "#1c1b18", accent: "#5ec8c2", dark: true },
  "car-sales-analysis": { Component: Cars, tint: "#ececec", accent: "#1c1b18" },
  "employee-attrition": { Component: Attrition, tint: "#f1ecf6", accent: "#6e4ba8" },
  "lyft-market-analysis": { Component: Lyft, tint: "#faecef", accent: "#e0457b" },
  "physics-museum": { Component: PhysicsMuseum, tint: "#eef4ff", accent: "#7ba4ff" },
  "apex-finance": { Component: ApexFinance, tint: "#eaf3ee", accent: "#1f7a4b" },
  "lineup": { Component: LineUp, tint: "#f3eefb", accent: "#7853c4" },
  "air-canvas": { Component: AirCanvas, tint: "#eef4f9", accent: "#2a6fc4" },
  "audio-visualizer": { Component: AudioVisualizer, tint: "#0f1d1d", accent: "#5ec8c2", dark: true },
  "olist-warehouse": { Component: OlistWarehouse, tint: "#eef4fb", accent: "#2a6fc4" },
  "gravity-sim": { Component: GravitySim, tint: "#14131c", accent: "#e8b84a", dark: true },
  "rust-tui-dashboard": { Component: RustTui, tint: "#1a1410", accent: "#e57324", dark: true },
  "backprop-from-scratch": { Component: Backprop, tint: "#fdf0ea", accent: "#c2563a" },
  "numpy-neural-network": { Component: NumpyNN, tint: "#efeff8", accent: "#5b4ac4" },
  "c-ml-library": { Component: CMlLibrary, tint: "#ececec", accent: "#0f6b5e" },
  "cpp-physics-engine": { Component: CppPhysics, tint: "#eef3f9", accent: "#d04545" },
};

const FALLBACK_ACCENT = "#d97757";

export function getCoverMeta(slug: string): CoverMeta | undefined {
  return coverMeta[slug];
}

/** Accent colour for a slug, with a terracotta fallback. */
export function accentFor(slug: string): string {
  return coverMeta[slug]?.accent ?? FALLBACK_ACCENT;
}

interface ProjectCoverProps {
  slug: string;
  /** "featured" → Featured ribbon; show "New" when isNew and not featured. */
  tier?: string;
  isNew?: boolean;
  /** card cover radius in px */
  radius?: number;
}

/** 4:3 tinted frame wrapping a project's cover artwork. */
export function ProjectCover({ slug, tier, isNew, radius = 5 }: ProjectCoverProps) {
  const meta = coverMeta[slug];
  if (!meta) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          borderRadius: radius,
          border: "1px solid var(--rd-line)",
          background: "var(--rd-bone)",
        }}
      />
    );
  }
  const { Component, tint, accent } = meta;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 3",
        borderRadius: radius,
        overflow: "hidden",
        border: "1px solid var(--rd-line)",
        background: tint,
      }}
    >
      <Component />
      {tier === "featured" && (
        <span
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: accent,
            color: "#fff",
            fontFamily: "var(--font-code), monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "3px 7px",
            borderRadius: 3,
          }}
        >
          Featured
        </span>
      )}
      {isNew && tier !== "featured" && (
        <span
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: accent,
            color: "#fff",
            fontFamily: "var(--font-code), monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "3px 7px",
            borderRadius: 3,
          }}
        >
          New
        </span>
      )}
    </div>
  );
}
