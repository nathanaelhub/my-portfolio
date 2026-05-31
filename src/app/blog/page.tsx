import { Column, Meta } from "@once-ui-system/core";
import { baseURL, blog, person } from "@/resources";
import { getPosts } from "@/utils/utils";
import { BlogIndexClient, type BlogPost } from "@/components/blog/BlogIndexClient";
import { BlogPostingSchema } from "@/components";

export const dynamic = "force-static";

export async function generateMetadata() {
  const metadata = Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `${baseURL}${person.avatar}`,
    path: blog.path,
  });
  return {
    ...metadata,
    alternates: { canonical: `${baseURL}${blog.path}` },
  };
}

function getBlogPosts(): BlogPost[] {
  return getPosts(["src", "app", "blog", "posts"])
    .map((post) => ({
      slug: post.slug,
      title: post.metadata.title,
      excerpt: post.metadata.excerpt || post.metadata.summary,
      date: post.metadata.publishedAt,
      readMins: post.metadata.readMins ?? 5,
      topic: post.metadata.topic || post.metadata.tag || "Notes",
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function Blog() {
  const posts = getBlogPosts();
  return (
    <Column maxWidth="l" fillWidth paddingTop="24">
      <BlogPostingSchema
        path={blog.path}
        title={blog.title}
        description={blog.description}
        image={person.avatar}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <BlogIndexClient posts={posts} />
    </Column>
  );
}
