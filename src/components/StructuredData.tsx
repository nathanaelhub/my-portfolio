import Script from "next/script";
import { person, social } from "@/resources";
import { baseURL } from "@/resources";

const sameAsLinks = social
  .filter((s) => s.link && !s.link.startsWith("mailto:"))
  .map((s) => s.link);

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
  return (
    <Script
      id="schema-person"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${baseURL}${item.href}`,
    })),
  };

  return (
    <Script
      id={`schema-breadcrumb-${items.length}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
