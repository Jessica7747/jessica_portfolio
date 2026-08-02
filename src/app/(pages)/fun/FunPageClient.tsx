"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./fun.module.css";

const leftColumn = [
  { height: 410, key: "left-0" },
  { height: 592, key: "left-1" },
  { height: 410, key: "left-2" },
  { height: 410, key: "left-3" },
];

const rightColumn = [
  { height: 800, key: "right-0" },
  { height: 410, key: "right-1" },
  { height: 676, key: "right-2" },
];

/** Pair left/right into visual rows (masonry columns, animated as rows). */
const rows = Array.from(
  { length: Math.max(leftColumn.length, rightColumn.length) },
  (_, index) => ({
    left: leftColumn[index] ?? null,
    right: rightColumn[index] ?? null,
  }),
);

/** Start next row after a short delay — do not wait for prior row to finish. */
const STATUS_DELAY_MS = 40;
const FIRST_ROW_DELAY_MS = 80;
const ROW_START_DELAY_MS = 380;
const IN_ROW_STAGGER_MS = 100;

export function FunPageClient() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeRow, setActiveRow] = useState(reducedMotion ? rows.length : -1);
  const [statusVisible, setStatusVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setStatusVisible(true);
      setActiveRow(rows.length);
      return;
    }

    setStatusVisible(false);
    setActiveRow(-1);

    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => setStatusVisible(true), STATUS_DELAY_MS),
    );

    rows.forEach((_, index) => {
      timers.push(
        window.setTimeout(
          () => setActiveRow((current) => Math.max(current, index)),
          FIRST_ROW_DELAY_MS + index * ROW_START_DELAY_MS,
        ),
      );
    });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [reducedMotion]);

  return (
    <div className={styles.fun}>
      <p
        className={[
          styles.status,
          statusVisible ? styles.revealVisible : styles.reveal,
        ].join(" ")}
      >
        Tinkering in process...
      </p>
      <div className={styles.masonry}>
        <div className={styles.column}>
          {leftColumn.map((item, index) => {
            const active = reducedMotion || activeRow >= index;
            return (
              <div
                key={item.key}
                className={[
                  styles.block,
                  active ? styles.revealVisible : styles.reveal,
                ].join(" ")}
                style={{ height: item.height }}
              />
            );
          })}
        </div>
        <div className={styles.column}>
          {rightColumn.map((item, index) => {
            const active = reducedMotion || activeRow >= index;
            return (
              <div
                key={item.key}
                className={[
                  styles.block,
                  active ? styles.revealVisible : styles.reveal,
                ].join(" ")}
                style={{
                  height: item.height,
                  transitionDelay:
                    reducedMotion || !active
                      ? "0ms"
                      : `${IN_ROW_STAGGER_MS}ms`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
