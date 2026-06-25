import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type ProjectTier = "featured" | "production" | "tools" | "analysis";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
  tier?: ProjectTier;
  domains?: string[];
  year?: number;
  metric?: string;
  isNew?: boolean;
  deck?: string;
  // Blog-only
  topic?: string;
  excerpt?: string;
  readMins?: number;
  // Project case-study meta strip
  role?: string;
  collaborator?: string;
  timeline?: string;
  stack?: string;
  status?: string;
};

import { notFound } from "next/navigation";

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    notFound();
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    publishedAt: data.publishedAt,
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || [],
    team: data.team || [],
    link: data.link || "",
    tier: data.tier || undefined,
    domains: data.domains || [],
    year: data.year || undefined,
    metric: data.metric || "",
    isNew: data.isNew || false,
    deck: data.deck || undefined,
    topic: data.topic || undefined,
    excerpt: data.excerpt || "",
    readMins: data.readMins || undefined,
    role: data.role || undefined,
    collaborator: data.collaborator || undefined,
    timeline: data.timeline || undefined,
    stack: data.stack || undefined,
    status: data.status || undefined,
  };

  return { metadata, content };
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir);
}

