import type { CaseStudyContent } from "./CaseStudyPage";
import { appleCaseStudy } from "./appleCaseStudy";
import { genkitCaseStudy } from "./genkitCaseStudy";
import { spotifyCaseStudy } from "./spotifyCaseStudy";
import type { ProjectVariant } from "./projects";

export const CASE_STUDIES: Partial<Record<ProjectVariant, CaseStudyContent>> = {
  apple: appleCaseStudy,
  genkit: genkitCaseStudy,
  spotify: spotifyCaseStudy,
};

export function getCaseStudy(slug: string): CaseStudyContent | null {
  return CASE_STUDIES[slug as ProjectVariant] ?? null;
}

export function getCaseStudySlugs(): string[] {
  return Object.keys(CASE_STUDIES);
}
