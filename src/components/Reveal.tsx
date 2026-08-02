"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import styles from "./Reveal.module.css";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  variant?: "up" | "fade" | "scaleUp";
  as?: "div" | "section" | "li" | "footer" | "ul" | "h2" | "p";
  style?: CSSProperties;
  /** When set, reveal is controlled (no independent IO). */
  active?: boolean;
};

export function Reveal({
  children,
  className,
  delayMs = 0,
  variant = "up",
  as: Tag = "div",
  style,
  active,
}: RevealProps) {
  const controlled = active !== undefined;
  const { ref, isInView, reducedMotion } = useInView<HTMLElement>({
    // Skip observing when controlled — still need reducedMotion from the hook
    threshold: controlled ? 0 : 0.15,
  });

  const visible = reducedMotion || (controlled ? Boolean(active) : isInView);

  return (
    <Tag
      ref={controlled ? undefined : (ref as never)}
      className={[
        styles.reveal,
        styles[variant],
        visible ? styles.visible : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...style,
        transitionDelay: reducedMotion || !visible ? "0ms" : `${delayMs}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
