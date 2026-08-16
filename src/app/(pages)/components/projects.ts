export type ProjectVariant =
  | "apple"
  | "genkit"
  | "aws"
  | "azure"
  | "copilot"
  | "spotify";

export type Project = {
  company: string;
  title: string;
  variant: ProjectVariant;
};

export const projects: Project[] = [
  {
    company: "Apple",
    title: "Reminders",
    variant: "apple",
  },
  {
    company: "Google Genkit",
    title: "Developer Evaluation Automation",
    variant: "genkit",
  },
  {
    company: "Amazon Web Services",
    title: "Responsible AI Campaign",
    variant: "aws",
  },
  {
    company: "Microsoft Azure Data",
    title: "AI Agents in Databases",
    variant: "azure",
  },
  {
    company: "Microsoft Copilot for Sales",
    title: "AI-Driven B2B Sales Tools",
    variant: "copilot",
  },
  {
    company: "Spotify",
    title: "Multilingual Music Experiences",
    variant: "spotify",
  },
];

export const projectRows = [
  projects.slice(0, 2),
  projects.slice(2, 4),
  projects.slice(4, 6),
];

export function getSuggestedProjects(currentId: string, limit = 2): Project[] {
  return projects
    .filter((project) => project.variant !== currentId)
    .slice(0, limit);
}
