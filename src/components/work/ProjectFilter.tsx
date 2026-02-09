"use client";

import { useState } from "react";
import { Column, Row, ToggleButton } from "@once-ui-system/core";
import { ProjectCard } from "@/components";

interface ProjectData {
  slug: string;
  title: string;
  summary: string;
  images: string[];
  content: string;
  tag?: string;
  team: { avatar: string }[];
  link: string;
}

interface ProjectFilterProps {
  projects: ProjectData[];
}

export function ProjectFilter({ projects }: ProjectFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = Array.from(
    new Set(projects.map((p) => p.tag).filter(Boolean))
  ).sort() as string[];

  const filtered = activeTag
    ? projects.filter((p) => p.tag === activeTag)
    : projects;

  return (
    <Column fillWidth gap="xl">
      {tags.length > 1 && (
        <Row gap="8" horizontal="center" wrap paddingX="l">
          <ToggleButton
            size="s"
            label="All"
            selected={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {tags.map((tag) => (
            <ToggleButton
              key={tag}
              size="s"
              label={tag}
              selected={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))}
        </Row>
      )}
      <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
        {filtered.map((project, index) => (
          <ProjectCard
            priority={index < 2}
            key={project.slug}
            href={`/work/${project.slug}`}
            images={project.images}
            title={project.title}
            description={project.summary}
            content={project.content}
            avatars={project.team?.map((member) => ({ src: member.avatar })) || []}
            link={project.link}
          />
        ))}
      </Column>
    </Column>
  );
}
