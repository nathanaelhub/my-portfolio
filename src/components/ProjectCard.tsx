"use client";

import {
  AvatarGroup,
  Column,
  Flex,
  Heading,
  Media,
  SmartLink,
  Text,
} from "@once-ui-system/core";
import { getImagePath } from "@/utils/image";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  priority,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
}) => {
  return (
    <Flex
      fillWidth
      gap="l"
      direction="row"
      s={{ direction: "column" }}
      padding="m"
      radius="l"
      border="neutral-alpha-weak"
      background="surface"
    >
      {/* Image on the left - smaller size */}
      {images.length > 0 && (
        <Flex
          style={{ width: "280px", minWidth: "280px", flexShrink: 0 }}
          s={{ style: { width: "100%", minWidth: "100%" } }}
        >
          <SmartLink href={href} style={{ width: "100%" }}>
            <Media
              priority={priority}
              sizes="280px"
              radius="m"
              aspectRatio="1 / 1"
              src={getImagePath(images[0])}
              alt={title}
            />
          </SmartLink>
        </Flex>
      )}

      {/* Content on the right */}
      <Column flex={1} gap="m">
        {title && (
          <SmartLink href={href}>
            <Heading as="h2" wrap="balance" variant="heading-strong-l">
              {title}
            </Heading>
          </SmartLink>
        )}
        {avatars?.length > 0 && (
          <AvatarGroup
            avatars={avatars.map((avatar) => ({
              ...avatar,
              src: getImagePath(avatar.src),
            }))}
            size="s"
            reverse
          />
        )}
        {description?.trim() && (
          <Text
            wrap="balance"
            variant="body-default-s"
            onBackground="neutral-weak"
          >
            {description}
          </Text>
        )}
        <Flex gap="16" wrap>
          {content?.trim() && (
            <SmartLink
              suffixIcon="arrowRight"
              style={{ margin: "0", width: "fit-content" }}
              href={href}
            >
              <Text variant="body-default-s">Read case study</Text>
            </SmartLink>
          )}
          {link && (
            <SmartLink
              suffixIcon="arrowUpRightFromSquare"
              style={{ margin: "0", width: "fit-content" }}
              href={link}
            >
              <Text variant="body-default-s">View project</Text>
            </SmartLink>
          )}
        </Flex>
      </Column>
    </Flex>
  );
};
