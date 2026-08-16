"use client";

import { useCallback, useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  CaseStudyModal,
  type CaseStudyContent,
} from "./components/CaseStudyModal";
import { appleCaseStudy } from "./components/appleCaseStudy";
import { genkitCaseStudy } from "./components/genkitCaseStudy";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectRow } from "./components/ProjectRow";
import type { Project, ProjectVariant } from "./components/projects";
import styles from "./page.module.css";

type WorkPageClientProps = {
  rows: Project[][];
};

/** Start the next row after a short delay — don’t wait for the prior row to finish. */
const ROW_START_DELAY_MS = 380;
/** Let the first row paint hidden before revealing so it animates too. */
const FIRST_ROW_DELAY_MS = 40;

const CASE_STUDIES: Partial<Record<ProjectVariant, CaseStudyContent>> = {
  apple: appleCaseStudy,
  genkit: genkitCaseStudy,
};

export function WorkPageClient({ rows }: WorkPageClientProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [activeRow, setActiveRow] = useState(reducedMotion ? rows.length : -1);
  const [activeStudy, setActiveStudy] = useState<CaseStudyContent | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setActiveRow(rows.length);
      return;
    }

    setActiveRow(-1);
    const timers: number[] = [];

    for (let index = 0; index < rows.length; index += 1) {
      timers.push(
        window.setTimeout(() => {
          setActiveRow((current) => Math.max(current, index));
        }, FIRST_ROW_DELAY_MS + index * ROW_START_DELAY_MS),
      );
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [reducedMotion, rows.length]);

  const openStudy = useCallback((variant: ProjectVariant) => {
    const study = CASE_STUDIES[variant];
    if (study) {
      setActiveStudy(study);
      return;
    }
    setActiveStudy(null);
    window.requestAnimationFrame(() => {
      document
        .getElementById(`project-${variant}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  const closeModal = useCallback(() => setActiveStudy(null), []);

  return (
    <>
      <div className={styles.grid}>
        {rows.map((row, index) => (
          <ProjectRow
            key={row.map((item) => item.company).join("-")}
            active={activeRow >= index}
          >
            {row.map((project) => (
              <ProjectCard
                key={project.company}
                {...project}
                id={`project-${project.variant}`}
                onOpen={
                  CASE_STUDIES[project.variant]
                    ? () => openStudy(project.variant)
                    : undefined
                }
              />
            ))}
          </ProjectRow>
        ))}
      </div>
      <CaseStudyModal
        open={Boolean(activeStudy)}
        content={activeStudy}
        onClose={closeModal}
        onOpenProject={openStudy}
      />
    </>
  );
}
