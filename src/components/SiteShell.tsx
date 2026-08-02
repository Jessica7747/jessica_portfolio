import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import styles from "./SiteShell.module.css";

type SiteShellProps = {
  active: "work" | "fun" | "about";
  previousAt?: string;
  children: ReactNode;
  contentClassName?: string;
};

export function SiteShell({
  active,
  previousAt,
  children,
  contentClassName,
}: SiteShellProps) {
  return (
    <div className={styles.page}>
      <Sidebar active={active} previousAt={previousAt} />
      <div className={styles.body}>
        <div
          className={[styles.content, contentClassName]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}
