import { Column, Meta, Schema } from "@once-ui-system/core";
import { baseURL, about, person, work } from "@/resources";
import { getPosts } from "@/utils/utils";
import { WorkExplorer, type WorkProject } from "@/components/work/WorkExplorer";

export const dynamic = "force-static";

export async function generateMetadata() {
  const metadata = Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `${baseURL}${person.avatar}`,
    path: work.path,
  });
  return {
    ...metadata,
    alternates: { canonical: `${baseURL}${work.path}` },
  };
}

function getWorkProjects(): WorkProject[] {
  return getPosts(["src", "app", "work", "projects"]).map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    summary: post.metadata.summary,
    link: post.metadata.link || "",
    tier: post.metadata.tier ?? "analysis",
    domains: post.metadata.domains ?? [],
    year: post.metadata.year ?? new Date(post.metadata.publishedAt).getFullYear(),
    metric: post.metadata.metric ?? "",
    isNew: post.metadata.isNew ?? false,
  }));
}

export default function Work() {
  const projects = getWorkProjects();

  return (
    <Column maxWidth="l" fillWidth paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={person.avatar}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <WorkExplorer projects={projects} />
    </Column>
  );
}
