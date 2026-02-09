import { Column, Skeleton } from "@once-ui-system/core";

export default function Loading() {
  return (
    <Column maxWidth="m" horizontal="center" gap="l" paddingTop="24" fillWidth>
      <Column maxWidth="s" gap="16" horizontal="center" align="center" fillWidth>
        <Skeleton shape="line" width="xs" height="s" />
        <Skeleton shape="line" width="xs" height="xs" />
        <Skeleton shape="line" width="m" height="l" />
      </Column>
      <Skeleton shape="block" width="l" height="xl" radius="l" />
      <Column maxWidth="s" gap="16" fillWidth>
        <Skeleton shape="line" width="l" height="xs" />
        <Skeleton shape="line" width="l" height="xs" />
        <Skeleton shape="line" width="m" height="xs" />
      </Column>
    </Column>
  );
}
