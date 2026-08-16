"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LoopingVideo } from "./LoopingVideo";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  company: string;
  title: string;
  variant: "apple" | "genkit" | "aws" | "azure" | "copilot" | "spotify";
  id?: string;
  staggerMs?: number;
  revealed?: boolean;
  href?: string;
};

export function ProjectCard({
  company,
  title,
  variant,
  id,
  staggerMs = 0,
  revealed = false,
  href,
}: ProjectCardProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [revealSettled, setRevealSettled] = useState(false);

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

  const isVisible = revealed || reducedMotion;
  const motionActive = isVisible && !reducedMotion;

  const inner = (
    <>
      <div
        className={[styles.thumb, styles[variant]].filter(Boolean).join(" ")}
      >
        <div className={styles.media}>
          {variant === "apple" && (
            <>
              <Image
                src="/images/apple/video-poster.png"
                alt=""
                fill
                className={styles.bgImage}
                sizes="(max-width: 900px) 100vw, 42vw"
                priority
              />
              <LoopingVideo
                src="/videos/reminders-hero.mp4?v=7"
                poster="/images/apple/video-poster.png"
                active={motionActive}
                className={styles.coverVideo}
              />
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
    </>
  );

  const className = [
    styles.card,
    isVisible ? styles.visible : "",
    href ? styles.clickable : "",
  ]
    .filter(Boolean)
    .join(" ");

  const style = {
    transitionDelay:
      reducedMotion || revealSettled || !isVisible ? "0ms" : `${staggerMs}ms`,
  };

  if (href) {
    return (
      <Link id={id} href={href} className={className} style={style}>
        {inner}
      </Link>
    );
  }

  return (
    <article id={id} className={className} style={style}>
      {inner}
    </article>
  );
}
