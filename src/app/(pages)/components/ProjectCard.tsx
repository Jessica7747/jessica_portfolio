"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  company: string;
  title: string;
  variant: "apple" | "genkit" | "aws" | "azure" | "copilot" | "spotify";
  staggerMs?: number;
  revealed?: boolean;
  onOpen?: () => void;
};

export function ProjectCard({
  company,
  title,
  variant,
  staggerMs = 0,
  revealed = false,
  onOpen,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [revealSettled, setRevealSettled] = useState(false);
  const [hover, setHover] = useState({ active: false, x: 0, imgX: 0 });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setRevealSettled(true);
      return;
    }
    if (!revealed) {
      setRevealSettled(false);
      return;
    }
    const timer = window.setTimeout(
      () => setRevealSettled(true),
      staggerMs + 720,
    );
    return () => window.clearTimeout(timer);
  }, [revealed, reducedMotion, staggerMs]);

  const onMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (reducedMotion) return;
      if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

      const node = cardRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      const shift = (ratio - 0.5) * 8;
      setHover({
        active: true,
        x: Math.max(-4, Math.min(4, shift)),
        imgX: Math.max(-3, Math.min(3, -shift * 0.5)),
      });
    },
    [reducedMotion],
  );

  const onEnter = () => {
    if (reducedMotion) return;
    setHover((prev) => ({ ...prev, active: true }));
  };

  const onLeave = () => {
    setHover({ active: false, x: 0, imgX: 0 });
  };

  const isVisible = revealed || reducedMotion;
  const canTrack = !reducedMotion && hover.active && isVisible;

  return (
    <article
      ref={cardRef}
      className={[
        styles.card,
        isVisible ? styles.visible : "",
        hover.active && !reducedMotion ? styles.hovered : "",
        onOpen ? styles.clickable : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        transitionDelay:
          reducedMotion || revealSettled || !isVisible
            ? "0ms"
            : `${staggerMs}ms`,
      }}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onOpen}
      onKeyDown={
        onOpen
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen();
              }
            }
          : undefined
      }
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      <div
        className={[styles.thumb, styles[variant]].filter(Boolean).join(" ")}
        style={{
          transform: canTrack
            ? `translate3d(${hover.x}px, -2px, 0) scale(1.025)`
            : hover.active && !reducedMotion
              ? "translate3d(0, -2px, 0) scale(1.025)"
              : undefined,
        }}
      >
        <div
          className={styles.media}
          style={{
            transform: canTrack
              ? `translate3d(${hover.imgX}px, 0, 0) scale(1.02)`
              : undefined,
          }}
        >
          {variant === "apple" && (
            <>
              <Image
                src="/images/apple-bg.png"
                alt=""
                fill
                className={styles.bgImage}
                sizes="(max-width: 900px) 100vw, 42vw"
                priority
              />
              <div className={styles.overlay} />
              <div className={styles.logoWrap}>
                <Image
                  src="/images/reminders-icon.png"
                  alt=""
                  width={73}
                  height={73}
                  className={styles.logo}
                />
              </div>
            </>
          )}

          {variant === "genkit" && (
            <div className={`${styles.logoWrap} ${styles.logoWide}`}>
              <Image
                src="/images/genkit-logo.png"
                alt=""
                width={156}
                height={82}
                className={styles.logo}
              />
            </div>
          )}

          {variant === "aws" && (
            <div className={styles.logoWrap}>
              <Image
                src="/images/aws-logo.png"
                alt=""
                width={76}
                height={76}
                className={styles.logo}
              />
            </div>
          )}

          {variant === "azure" && (
            <Image
              src="/images/azure-bg.png"
              alt=""
              fill
              className={styles.bgImage}
              sizes="(max-width: 900px) 100vw, 42vw"
            />
          )}

          {variant === "copilot" && (
            <Image
              src="/images/copilot.png"
              alt=""
              fill
              className={styles.bgImage}
              sizes="(max-width: 900px) 100vw, 42vw"
            />
          )}

          {variant === "spotify" && (
            <div className={`${styles.logoWrap} ${styles.logoSpotify}`}>
              <Image
                src="/images/spotify-logo.png"
                alt=""
                width={122}
                height={41}
                className={styles.logo}
              />
            </div>
          )}
        </div>
      </div>
      <p className={styles.caption} suppressHydrationWarning>
        <span>{company}</span>
        <span className={styles.captionMuted}> · {title}</span>
      </p>
    </article>
  );
}
