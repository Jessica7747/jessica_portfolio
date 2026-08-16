import { SiteShell } from "@/components/SiteShell";
import { WorkPageClient } from "./WorkPageClient";
import { projectRows } from "./components/projects";
import styles from "./page.module.css";

export default function WorkPage() {
  return (
    <SiteShell
      active="work"
      previousAt="Previously at Apple, Google Genkit & Amazon Web Services."
      contentClassName={styles.workContent}
    >
      <WorkPageClient rows={projectRows} />
    </SiteShell>
  );
}
