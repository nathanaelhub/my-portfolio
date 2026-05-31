import { Column, Meta } from "@once-ui-system/core";
import { home, about, person, social, baseURL } from "@/resources";
import { Mailchimp, PersonSchema, WebPageSchema } from "@/components";
import { HomeIntro, type HomeProject, type HomePost } from "@/components/home/HomeIntro";
import { getPosts } from "@/utils/utils";

export const dynamic = "force-static";

export async function generateMetadata() {
  const metadata = Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
  return {
    ...metadata,
    alternates: { canonical: `${baseURL}${home.path === "/" ? "" : home.path}` },
  };
}

const TIER_ORDER: Record<string, number> = {
  featured: 0,
  production: 1,
  tools: 2,
  analysis: 3,
};

// Pin the marquee project to the top of the home grid.
const MARQUEE_SLUG = "mental-health-llm-evaluation";

function getHomeData(): {
  selected: HomeProject[];
  totalCount: number;
  recentPosts: HomePost[];
  totalPosts: number;
} {
  const projectsRaw = getPosts(["src", "app", "work", "projects"]);
  const projects: HomeProject[] = projectsRaw.map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    summary: post.metadata.summary,
    domains: post.metadata.domains ?? [],
    year: post.metadata.year ?? new Date(post.metadata.publishedAt).getFullYear(),
    tier: post.metadata.tier ?? "analysis",
    metric: post.metadata.metric,
  }));

  const selected = [...projects]
    .sort((a, b) => {
      if (a.slug === MARQUEE_SLUG) return -1;
      if (b.slug === MARQUEE_SLUG) return 1;
      const t = (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9);
      return t !== 0 ? t : b.year - a.year;
    })
    .slice(0, 6);

  const postsRaw = getPosts(["src", "app", "blog", "posts"]);
  const sortedPosts = [...postsRaw].sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  );
  const recentPosts: HomePost[] = sortedPosts.slice(0, 3).map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    date: post.metadata.publishedAt,
    topic: post.metadata.topic || post.metadata.tag || "Notes",
  }));

  return {
    selected,
    totalCount: projects.length,
    recentPosts,
    totalPosts: postsRaw.length,
  };
}

export default function Home() {
  const { selected, totalCount, recentPosts, totalPosts } = getHomeData();

  return (
    <Column maxWidth="l" paddingY="12" horizontal="center" fillWidth>
      <WebPageSchema
        path={home.path}
        title={home.title}
        description={home.description}
        image={person.avatar}
        sameAs={social.filter((s) => s.link && !s.link.startsWith("mailto:")).map((s) => s.link)}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <PersonSchema />

      <HomeIntro
        projects={selected}
        totalCount={totalCount}
        recentPosts={recentPosts}
        totalPosts={totalPosts}
      />

      <Mailchimp />
    </Column>
  );
}
