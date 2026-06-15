import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import { slugify as transliterate } from "transliteration";

import {
  Heading,
  HeadingLink,
  Text,
  InlineCode,
  CodeBlock,
  Accordion,
  AccordionGroup,
  Table,
  Feedback,
  Button,
  Card,
  Grid,
  Row,
  Column,
  Icon,
  Media,
  SmartLink,
} from "@once-ui-system/core";

// Project-specific custom MDX components.
import {
  OlistArchitecture,
  OlistStarSchema,
  OlistRevenueByRegion,
  OlistSellerRetention,
  OlistLateDeliveryByCategory,
} from "@/components/charts/OlistCharts";
import {
  MedicareArchitecture,
  MedicareStarSchema,
  MedicarePriceVariation,
  MedicareMarkup,
  MedicareCostVsQuality,
} from "@/components/charts/MedicareCharts";

/**
 * MDX renderer for long-form pages (blog posts + project case studies).
 * Maps standard markdown tags to plain semantic HTML so the .prose
 * stylesheet (see `Prose.module.scss`) can drive typography.
 * Headings keep slug ids so the in-page TOC can anchor to them.
 */

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: AnchorProps) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function flattenText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (React.isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return flattenText(props.children ?? "");
  }
  return "";
}

function slugify(value: ReactNode): string {
  const text = flattenText(value).replace(/&/g, " and ");
  return transliterate(text, { lowercase: true, separator: "-" }).replace(/-{2,}/g, "-");
}

function createHeading(tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const Heading = ({ children, ...rest }: { children?: ReactNode }) => {
    const id = slugify(children);
    return React.createElement(tag, { id, ...rest }, children);
  };
  Heading.displayName = `Prose${tag.toUpperCase()}`;
  return Heading;
}

function createCodeBlock(props: { children?: React.ReactElement<{ className?: string; children?: string }> }) {
  const child = props.children;
  if (child && child.props && child.props.className) {
    const { className, children } = child.props;
    const language = className.replace("language-", "");
    const label = language.charAt(0).toUpperCase() + language.slice(1);
    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codes={[{ code: children ?? "", language, label }] as never}
        copyButton={true}
      />
    );
  }
  return <pre {...props} />;
}

function createImage({ alt, src, ...rest }: { alt?: string; src: string } & Record<string, unknown>) {
  if (!src) return null;
  return (
    <Media
      marginTop="8"
      marginBottom="16"
      enlarge
      radius="m"
      border="neutral-alpha-medium"
      sizes="(max-width: 960px) 100vw, 960px"
      alt={alt}
      src={src}
      {...rest}
    />
  );
}

const components = {
  // Headings — plain semantic tags with slug ids so TOC/anchor links work.
  h1: createHeading("h1") as never,
  h2: createHeading("h2") as never,
  h3: createHeading("h3") as never,
  h4: createHeading("h4") as never,
  h5: createHeading("h5") as never,
  h6: createHeading("h6") as never,
  // Inline + block elements stay plain so .prose styles win.
  a: CustomLink as never,
  code: InlineCode as never,
  pre: createCodeBlock as never,
  img: createImage as never,
  // Once UI primitives still callable from MDX as named components.
  Heading,
  HeadingLink,
  Text,
  CodeBlock,
  InlineCode,
  Accordion,
  AccordionGroup,
  Table,
  Feedback,
  Button,
  Card,
  Grid,
  Row,
  Column,
  Icon,
  Media,
  SmartLink,
  // Olist Warehouse project charts.
  OlistArchitecture,
  OlistStarSchema,
  OlistRevenueByRegion,
  OlistSellerRetention,
  OlistLateDeliveryByCategory,
  // Medicare Cost & Quality project charts.
  MedicareArchitecture,
  MedicareStarSchema,
  MedicarePriceVariation,
  MedicareMarkup,
  MedicareCostVsQuality,
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
};

export function CustomMDX(props: CustomMDXProps) {
  return <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />;
}
