import { Avatar, Button, Column, Row, Text } from "@once-ui-system/core";
import { person, social } from "@/resources";
import { getImagePath } from "@/utils/image";

const authorBio =
  "Applied AI and Data Science professional specializing in healthcare AI, financial technology, and machine learning. Holds an M.S. in Applied AI and a B.S. in Data Science from Lipscomb University.";

const githubLink = social.find((s) => s.name === "GitHub")?.link;
const linkedinLink = social.find((s) => s.name === "LinkedIn")?.link;

export function AuthorCard() {
  return (
    <Row
      fillWidth
      gap="20"
      padding="24"
      border="neutral-alpha-weak"
      radius="l"
      background="neutral-alpha-weak"
      s={{ direction: "column", horizontal: "center", align: "center" }}
    >
      <Avatar src={getImagePath(person.avatar)} size="l" />
      <Column gap="4" flex={1} s={{ horizontal: "center", align: "center" }}>
        <Text variant="heading-strong-m">{person.name}</Text>
        <Text variant="body-default-s" onBackground="brand-weak">
          {person.role}
        </Text>
        <Text variant="body-default-s" onBackground="neutral-weak" marginTop="4">
          {authorBio}
        </Text>
        <Row gap="8" marginTop="12">
          {githubLink && (
            <Button
              href={githubLink}
              size="s"
              variant="secondary"
              prefixIcon="github"
              label="GitHub"
            />
          )}
          {linkedinLink && (
            <Button
              href={linkedinLink}
              size="s"
              variant="secondary"
              prefixIcon="linkedin"
              label="LinkedIn"
            />
          )}
        </Row>
      </Column>
    </Row>
  );
}
