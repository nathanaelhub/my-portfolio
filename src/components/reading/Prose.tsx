import type { ReactNode } from "react";
import styles from "./Prose.module.scss";

/** Wraps MDX content with the shared long-form typography. */
export function Prose({ children }: { children: ReactNode }) {
  return <article className={styles.prose}>{children}</article>;
}

export { styles as proseStyles };
