"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { LoopingVideo } from "./LoopingVideo";
import styles from "./CaseStudyPage.module.css";

export type CaseStudySection = {
  title: string;
  body: ReactNode;
};

export type CaseStudyContent = {
  id: string;
  title: string;
  heroSrc: string;
  heroVideoSrc?: string;
  heroLogoSrc?: string;
  /** Logo-centered hero (e.g. Genkit) vs full-bleed media. */
  heroMode?: "media" | "logo";
  role: string;
  timeline: string;
  skills: string;
  teamLabel?: string;
  team: string;
  impact: string;
  showNda?: boolean;
  ndaMailto?: string;
  /** Process narrative sections (Genkit-style). */
  sections?: CaseStudySection[];
  /** Apple-style reflection block. */
  reflectionLead?: ReactNode;
  lessonsIntro?: string;
  lessons?: { title: string; body: string }[];
  photos?: { src: string; alt: string; caption?: string; wide?: boolean }[];
  reflectionClose?: string;
};

type CaseStudyPageProps = {
  content: CaseStudyContent;
};

const STAGGER_MS = 90;
const STAGGER_BASE_MS = 120;

function RevealBlock({
  active,
  index,
  className,
  children,
  as: Tag = "div",
}: {
  active: boolean;
  index: number;
  className?: string;
  children: ReactNode;
  as?: "div" | "h1" | "h2" | "p";
}) {
  const style = {
    transitionDelay: active ? `${STAGGER_BASE_MS + index * STAGGER_MS}ms` : "0ms",
  } as CSSProperties;

  return (
    <Tag
      className={[styles.reveal, active ? styles.revealIn : "", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {children}
    </Tag>
  );
}

export function CaseStudyPage({ content }: CaseStudyPageProps) {
  const reducedMotion = usePrefersReducedMotion();
  const titleId = useId();
  const [contentIn, setContentIn] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setContentIn(true);
      return;
    }
    setContentIn(false);
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setContentIn(true));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [content.id, reducedMotion]);

  const mailto = content.ndaMailto ?? "mailto:jl4229@cornell.edu";
  const show = reducedMotion || contentIn;
  const showNda = content.showNda !== false;
  const hasReflection =
    Boolean(content.reflectionLead) ||
    Boolean(content.lessons?.length) ||
    Boolean(content.photos?.length) ||
    Boolean(content.reflectionClose);
  let step = 0;

  return (
    <article className={styles.page} aria-labelledby={titleId}>
      <div className={styles.top}>
        <div className={styles.headerRow}>
          <h1 id={titleId} className={styles.title}>
            {content.title}
          </h1>
        </div>
        <div className={styles.hero}>
          {content.heroVideoSrc ? (
            <LoopingVideo
              src={`${content.heroVideoSrc}?v=7`}
              poster={content.heroSrc}
              active={show}
            />
          ) : content.heroMode === "logo" && content.heroLogoSrc ? (
            <div className={styles.heroLogoStage}>
              <div className={styles.heroLogoMark}>
                <Image
                  src={content.heroLogoSrc}
                  alt=""
                  fill
                  className={styles.heroLogoImage}
                  sizes="220px"
                  priority
                />
              </div>
            </div>
          ) : (
            <Image
              src={content.heroSrc}
              alt=""
              fill
              className={styles.heroImage}
              sizes="(max-width: 900px) 100vw, 1112px"
              priority
            />
          )}
        </div>
      </div>

      <div className={styles.body}>
        <RevealBlock active={show} index={step++} className={styles.meta}>
          <div className={styles.metaItem}>
            <p className={styles.metaLabel}>Role</p>
            <p className={styles.metaValue}>{content.role}</p>
          </div>
          <div className={styles.metaItem}>
            <p className={styles.metaLabel}>Timeline</p>
            <p className={styles.metaValue}>{content.timeline}</p>
          </div>
          <div className={styles.metaItem}>
            <p className={styles.metaLabel}>Skills</p>
            <p className={styles.metaValue}>{content.skills}</p>
          </div>
          <div className={styles.metaItem}>
            <p className={styles.metaLabel}>{content.teamLabel ?? "Team"}</p>
            <p className={styles.metaValue}>{content.team}</p>
          </div>
        </RevealBlock>

        <RevealBlock active={show} index={step++} className={styles.split}>
          <p className={styles.splitLabel}>Impact</p>
          <p className={styles.splitCopy}>{content.impact}</p>
        </RevealBlock>

        {showNda && (
          <RevealBlock active={show} index={step++} className={styles.nda}>
            <span className={styles.ndaIcon} aria-hidden>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.25 9.5V7.2a3.75 3.75 0 1 1 7.5 0v2.3h1.9c1.27 0 2.3 1.03 2.3 2.3v8.2c0 1.27-1.03 2.3-2.3 2.3H6.35c-1.27 0-2.3-1.03-2.3-2.3v-8.2c0-1.27 1.03-2.3 2.3-2.3h1.9Zm2.1 0h3.3V7.2a1.65 1.65 0 0 0-3.3 0v2.3Z"
                />
              </svg>
            </span>
            <p className={styles.ndaText}>
              Project details remain under NDA. Please reach out{" "}
              <a href={mailto}>here</a> to learn more about my experience.
            </p>
          </RevealBlock>
        )}

        {content.sections?.map((section) => (
          <RevealBlock
            key={section.title}
            active={show}
            index={step++}
            className={styles.split}
          >
            <p className={styles.splitLabel}>{section.title}</p>
            <p className={styles.splitCopy}>{section.body}</p>
          </RevealBlock>
        ))}

        {hasReflection && (
          <div className={styles.split}>
            <RevealBlock
              active={show}
              index={step}
              as="p"
              className={styles.splitLabel}
            >
              Reflection
            </RevealBlock>
            <div className={styles.reflection}>
              {content.reflectionLead && (
                <RevealBlock
                  active={show}
                  index={step++}
                  as="p"
                  className={styles.reflectionLead}
                >
                  {content.reflectionLead}
                </RevealBlock>
              )}
              {content.lessonsIntro && (
                <RevealBlock active={show} index={step++} as="p">
                  {content.lessonsIntro}
                </RevealBlock>
              )}
              {content.lessons?.map((lesson) => (
                <RevealBlock
                  key={lesson.title}
                  active={show}
                  index={step++}
                  className={styles.lesson}
                >
                  <p className={styles.lessonTitle}>{lesson.title}</p>
                  <p className={styles.lessonBody}>{lesson.body}</p>
                </RevealBlock>
              ))}
              {content.photos && content.photos.length > 0 && (
                <RevealBlock active={show} index={step++}>
                  <div className={styles.photos}>
                    {content.photos.map((photo) => (
                      <div
                        key={photo.src}
                        className={[
                          styles.photo,
                          photo.wide ? styles.photoWide : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        tabIndex={photo.caption ? 0 : undefined}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className={styles.photoImage}
                          sizes="(max-width: 900px) 100vw, 40vw"
                        />
                        {photo.caption && (
                          <span className={styles.photoCaption}>
                            {photo.caption}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </RevealBlock>
              )}
              {content.reflectionClose && (
                <RevealBlock active={show} index={step++} as="p">
                  {content.reflectionClose}
                </RevealBlock>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
