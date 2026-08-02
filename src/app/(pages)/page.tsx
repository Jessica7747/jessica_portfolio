import { SiteShell } from "@/components/SiteShell";
import { WorkPageClient } from "./WorkPageClient";
import styles from "./page.module.css";

const projects = [
  {
    company: "Apple",
    title: "Reminders",
    variant: "apple" as const,
  },
  {
    company: "Google Genkit",
    title: "Developer Evaluation Automation",
    variant: "genkit" as const,
  },
  {
    company: "Amazon Web Services",
    title: "Responsible AI Campaign",
    variant: "aws" as const,
  },
  {
    company: "Microsoft Azure Data",
    title: "AI Agents in Databases",
    variant: "azure" as const,
  },
  {
    company: "Microsoft Copilot for Sales",
    title: "AI-Driven B2B Sales Tools",
    variant: "copilot" as const,
  },
  {
    company: "Spotify",
    title: "Multilingual Music Experiences",
    variant: "spotify" as const,
  },
];

const rows = [
  projects.slice(0, 2),
  projects.slice(2, 4),
  projects.slice(4, 6),
];

export default function WorkPage() {
  return (
    <SiteShell
      active="work"
      previousAt="Previously at Apple, Google Genkit & Amazon Web Services."
      contentClassName={styles.workContent}
    >
      <WorkPageClient rows={rows} />
    </SiteShell>
  );
}
