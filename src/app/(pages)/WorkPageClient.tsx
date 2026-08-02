"use client";

import { useCallback, useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { appleCaseStudy } from "./components/appleCaseStudy";
import { CaseStudyModal } from "./components/CaseStudyModal";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectRow } from "./components/ProjectRow";
import styles from "./page.module.css";

type Project = {
  company: string;
  title: string;
  variant: "apple" | "genkit" | "aws" | "azure" | "copilot" | "spotify";
};

type WorkPageClientProps = {
  rows: Project[][];
};

/** Start the next row after a short delay — don’t wait for the prior row to finish. */
const ROW_START_DELAY_MS = 380;
/** Let the first row paint hidden before revealing so it animates too. */
const FIRST_ROW_DELAY_MS = 40;

export function WorkPageClient({ rows }: WorkPageClientProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [activeRow, setActiveRow] = useState(reducedMotion ? rows.length : -1);
  const [modalOpen, setModalOpen] = useState(false);

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

  const openApple = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

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
                onOpen={project.variant === "apple" ? openApple : undefined}
              />
            ))}
          </ProjectRow>
        ))}
      </div>
      <CaseStudyModal
        open={modalOpen}
        content={appleCaseStudy}
        onClose={closeModal}
      />
    </>
  );
}
