import { baseURL, person, social } from "@/resources";

/**
 * SSR-rendered JSON-LD schema components. Each renders a plain
 * `<script type="application/ld+json">` tag so static-HTML scanners
 * (Schema validator, social link previews, Googlebot's initial fetch)
 * see the structured data without needing JS execution.
 *
 * Replaces Once UI's `<Schema>` component, which mounts on hydration
 * and is invisible to crawlers reading the raw HTML.
 */

const sameAsLinks = social
  .filter((s) => s.link && !s.link.startsWith("mailto:"))
  .map((s) => s.link);

function LdScript({ id, data }: { id: string; data: object }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ----- Person ---------------------------------------------------------------

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
  url: baseURL,
  sameAs: sameAsLinks,
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Lipscomb University",
      department: "Applied Artificial Intelligence",
    },
  ],
  knowsAbout: [
    "Machine Learning",
    "Artificial Intelligence",
    "Data Science",
    "Healthcare AI",
    "Python",
    "NLP",
  ],
  image: `${baseURL}${person.avatar}`,
  description:
    "Applied AI and Data Science professional specializing in healthcare AI, financial technology, and machine learning.",
};

export function PersonSchema() {
  return <LdScript id="schema-person" data={personSchema} />;
}

// ----- Breadcrumb -----------------------------------------------------------

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${baseURL}${item.href}`,
    })),
  };
  return <LdScript id={`schema-breadcrumb-${items.length}`} data={data} />;
}

// ----- WebPage --------------------------------------------------------------

interface AuthorRef {
  name: string;
  url: string;
  image: string;
}

interface WebPageSchemaProps {
  path: string;
  title: string;
  description: string;
  image?: string;
  author?: AuthorRef;
  sameAs?: string[];
}

export function WebPageSchema({
  path,
  title,
  description,
  image,
  author,
  sameAs,
}: WebPageSchemaProps) {
  const url = `${baseURL}${path === "/" ? "" : path}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    name: title,
    headline: title,
    description,
  };
  if (image) data.image = image.startsWith("http") ? image : `${baseURL}${image}`;
  if (author) data.author = { "@type": "Person", ...author };
  if (sameAs?.length) data.sameAs = sameAs;
  return <LdScript id={`schema-webpage-${path}`} data={data} />;
}

// ----- BlogPosting ----------------------------------------------------------

interface BlogPostingSchemaProps {
  path: string;
  title: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: AuthorRef;
}

export function BlogPostingSchema({
  path,
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
}: BlogPostingSchemaProps) {
  const url = `${baseURL}${path}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: title,
    name: title,
    description,
    url,
  };
  if (image) data.image = image.startsWith("http") ? image : `${baseURL}${image}`;
  if (datePublished) data.datePublished = datePublished;
  if (dateModified) data.dateModified = dateModified;
  if (author) {
    data.author = { "@type": "Person", ...author };
    data.publisher = { "@type": "Person", ...author };
  }
  return <LdScript id={`schema-blogposting-${path}`} data={data} />;
}
