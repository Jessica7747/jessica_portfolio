"use client";

import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import styles from "./about.module.css";

const paragraphs = [
  "Hi, thanks for visiting my little corner on the internet!",
  "I'm Jessica Gexi Liu, a junior at Cornell University studying Information Science with concentrations in UX Design and Data Science.",
  "I grew up between Fuzhou, China and Brooklyn, NY as an English learner. Before language felt natural, I learned through the world around me. Picture books where color and illustration carried the story before the words. That's where my relationship with design quietly began, noticing how it can shape experiences and tell stories effortlessly.",
  "At Cornell, I found product design as a language for that instinct. A way to turn noticing into making and to scale creative impact beyond a single moment or person. I love getting my hands on different projects and staying curious about new tools and ways of building.",
  "When I'm not in Figma, I teach English to second language learners, take long walks around Williamsburg, watch the sunset at the piers, and build Legos.",
  "Always happy to chat or collaborate!",
];

type AboutIntroProps = {
  active: boolean;
};

export function AboutIntro({ active }: AboutIntroProps) {
  return (
    <section className={styles.intro}>
      <Reveal active={active} variant="up" className={styles.photoReveal}>
        <div className={styles.photo}>
          <Image
            src="/images/about-portrait.png"
            alt="Jessica Liu"
            fill
            className={styles.photoImage}
            sizes="304px"
            priority
          />
        </div>
      </Reveal>
      <div className={styles.bio}>
        {paragraphs.map((text, index) => (
          <Reveal
            key={text.slice(0, 24)}
            active={active}
            variant="up"
            delayMs={120 + index * 90}
            as="p"
          >
            {text}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
