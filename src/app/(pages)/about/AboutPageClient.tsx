"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { AboutIntro } from "./AboutIntro";
import { AboutSection } from "./AboutSection";
import styles from "./about.module.css";

type Item = {
  date: string;
  title: string;
  description: string;
};

type AboutPageClientProps = {
  experiences: Item[];
  communities: Item[];
};

/** Start the next section after a short delay — don’t wait for the prior one to finish. */
const SECTION_START_DELAY_MS = 380;
/** Let the intro paint hidden before revealing so it animates too. */
const FIRST_SECTION_DELAY_MS = 40;

export function AboutPageClient({
  experiences,
  communities,
}: AboutPageClientProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(reducedMotion ? 2 : -1);

  useEffect(() => {
    if (reducedMotion) {
      setStep(2);
      return;
    }

    setStep(-1);
    const timers = [0, 1, 2].map((index) =>
      window.setTimeout(
        () => setStep((s) => Math.max(s, index)),
        FIRST_SECTION_DELAY_MS + index * SECTION_START_DELAY_MS,
      ),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [reducedMotion]);

  return (
    <div className={styles.about}>
      <AboutIntro active={step >= 0} />
      <AboutSection
        title="Experiences"
        items={experiences}
        active={step >= 1}
      />
      <AboutSection
        title="Communities"
        items={communities}
        active={step >= 2}
      />
    </div>
  );
}
