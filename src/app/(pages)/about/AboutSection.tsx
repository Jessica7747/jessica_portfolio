"use client";

import Image from "next/image";
import styles from "./about.module.css";
import motion from "./AboutSection.module.css";

type Item = {
  date: string;
  title: string;
  description: string;
};

type AboutSectionProps = {
  title: string;
  items: Item[];
  active: boolean;
};

export function AboutSection({ title, items, active }: AboutSectionProps) {
  return (
    <div className={motion.group}>
      <div
        className={[motion.divider, active ? motion.dividerVisible : ""]
          .filter(Boolean)
          .join(" ")}
        aria-hidden
      >
        <Image src="/images/divider.svg" alt="" width={992} height={1} />
      </div>

      <section
        className={[
          styles.section,
          motion.section,
          active ? motion.visible : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <h2
          className={[styles.sectionTitle, motion.title]
            .filter(Boolean)
            .join(" ")}
        >
          {title}
        </h2>
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li
              key={item.title}
              className={[styles.item, motion.item].filter(Boolean).join(" ")}
              style={{
                transitionDelay: active ? `${180 + index * 80}ms` : "0ms",
              }}
            >
              <span className={styles.date}>{item.date}</span>
              <div className={styles.itemBody}>
                <p className={styles.itemTitle}>{item.title}</p>
                <p className={styles.itemDesc}>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
