import { SiteShell } from "@/components/SiteShell";
import { AboutPageClient } from "./AboutPageClient";

const experiences = [
  {
    date: "2026",
    title: "Apple",
    description: "Product Design Intern, Reminders",
  },
  {
    date: "2025",
    title: "Google Genkit",
    description: "Project Lead for a team to design developer tool",
  },
  {
    date: "2025",
    title: "Amazon Web Services",
    description:
      "Responsible AI campaign on aws.com and a prompt engineering tool",
  },
  {
    date: "2025",
    title: "Microsoft Copilot for Sales",
    description: "Copilot-powered compliance automation",
  },
  {
    date: "2024",
    title: "Arctas",
    description: "SMBs government contract platform",
  },
  {
    date: "2023",
    title: "AllGrow",
    description: "Nonprofit edtech platform based in Romina",
  },
];

const communities = [
  {
    date: "2025 -",
    title: "Figma, Campus Leader @ Cornell",
    description: "Hands-on workshops on new Figma product launches",
  },
  {
    date: "2023 -",
    title: "Design Consulting at Cornell",
    description:
      "New member educator & project lead for Cornell's first design consultancy",
  },
  {
    date: "2025",
    title: "Notion, Campus Leader @ Cornell",
    description: "Taught productivity tooling",
  },
  {
    date: "2024 -",
    title: "Digital Tech & Innovation",
    description: "Shipped products to Cornell campus",
  },
];

export default function AboutPage() {
  return (
    <SiteShell active="about">
      <AboutPageClient
        experiences={experiences}
        communities={communities}
      />
    </SiteShell>
  );
}
