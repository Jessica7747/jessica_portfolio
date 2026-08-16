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
import { getSuggestedProjects, type Project } from "./projects";
import styles from "./CaseStudyModal.module.css";

export type CaseStudyContent = {
  id: string;
  title: string;
  heroSrc: string;
  heroVideoSrc?: string;
  heroLogoSrc?: string;
  role: string;
  timeline: string;
  skills: string;
  team: string;
  impact: string;
  ndaMailto?: string;
  reflectionLead: ReactNode;
  lessonsIntro: string;
  lessons: { title: string; body: string }[];
  photos: { src: string; alt: string; wide?: boolean }[];
  reflectionClose: string;
};

type CaseStudyModalProps = {
  open: boolean;
  content: CaseStudyContent | null;
  onClose: () => void;
};

const CLOSE_MS = 280;
const STAGGER_MS = 90;
const STAGGER_BASE_MS = 120;

const SUGGESTED_MEDIA: Record<
  Project["variant"],
  { type: "image" | "logo"; src: string; logoClass?: string }
> = {
  apple: { type: "image", src: "/images/apple/video-poster.png" },
  genkit: {
    type: "logo",
    src: "/images/genkit-logo.png",
    logoClass: "suggestLogoWide",
  },
  aws: { type: "logo", src: "/images/aws-logo.png" },
  azure: { type: "image", src: "/images/azure-bg.png" },
  copilot: { type: "image", src: "/images/copilot.png" },
  spotify: {
    type: "logo",
    src: "/images/spotify-logo.png",
    logoClass: "suggestLogoSpotify",
  },
};

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
  as?: "div" | "h2" | "p";
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

export function CaseStudyModal({ open, content, onClose }: CaseStudyModalProps) {
  const reducedMotion = usePrefersReducedMotion();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contentIn, setContentIn] = useState(false);

  useEffect(() => {
    if (open && content) {
      setMounted(true);
      setVisible(false);
      setContentIn(false);
      const frame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setVisible(true);
          setContentIn(true);
        });
      });
      return () => window.cancelAnimationFrame(frame);
    }

    setVisible(false);
    setContentIn(false);

    if (reducedMotion) {
      setMounted(false);
      return;
    }

    const timer = window.setTimeout(() => setMounted(false), CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [open, content, reducedMotion]);

  useEffect(() => {
    if (!mounted) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, onClose]);

  if (!mounted || !content) return null;

  const mailto = content.ndaMailto ?? "mailto:jl4229@cornell.edu";
  const show = reducedMotion || contentIn;
  const suggested = getSuggestedProjects(content.id);
  let step = 0;

  const openSuggested = (variant: Project["variant"]) => {
    onClose();
    window.requestAnimationFrame(() => {
      const target = document.getElementById(`project-${variant}`);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <div className={styles.overlay} role="presentation">
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className={[styles.dialog, visible ? styles.dialogVisible : ""]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.top}>
          <div className={styles.headerRow}>
            <RevealBlock active={show} index={step++} as="h2" className={styles.title}>
              <span id={titleId}>{content.title}</span>
            </RevealBlock>
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close"
            >
              <span aria-hidden>×</span>
            </button>
          </div>
          {/*
            Keep the video OUTSIDE opacity/transform reveals — those break
            Chromium video compositing and show a blank white frame.
          */}
          <div className={styles.hero} onClick={onClose} role="presentation">
            {content.heroVideoSrc ? (
              <LoopingVideo
                src={`${content.heroVideoSrc}?v=7`}
                poster={content.heroSrc}
                active={visible}
              />
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
              <p className={styles.metaLabel}>Team</p>
              <p className={styles.metaValue}>{content.team}</p>
            </div>
          </RevealBlock>

          <RevealBlock active={show} index={step++} className={styles.split}>
            <p className={styles.splitLabel}>Impact</p>
            <p className={styles.splitCopy}>{content.impact}</p>
          </RevealBlock>

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

          <div className={styles.split}>
            <RevealBlock active={show} index={step} as="p" className={styles.splitLabel}>
              Reflection
            </RevealBlock>
            <div className={styles.reflection}>
              <RevealBlock active={show} index={step++} as="p" className={styles.reflectionLead}>
                {content.reflectionLead}
              </RevealBlock>
              <RevealBlock active={show} index={step++} as="p">
                {content.lessonsIntro}
              </RevealBlock>
              {content.lessons.map((lesson) => (
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
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className={styles.photoImage}
                        sizes="(max-width: 900px) 100vw, 40vw"
                      />
                    </div>
                  ))}
                </div>
              </RevealBlock>
              <RevealBlock active={show} index={step++} as="p">
                {content.reflectionClose}
              </RevealBlock>
            </div>
          </div>

          <RevealBlock active={show} index={step++} className={styles.split}>
            <p className={styles.splitLabel}>More work</p>
            <div className={styles.suggested}>
              {suggested.map((project) => {
                const media = SUGGESTED_MEDIA[project.variant];
                return (
                  <button
                    key={project.variant}
                    type="button"
                    className={styles.suggestedCard}
                    onClick={() => openSuggested(project.variant)}
                  >
                    <div
                      className={[
                        styles.suggestedThumb,
                        styles[`suggest-${project.variant}`],
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {media.type === "image" ? (
                        <Image
                          src={media.src}
                          alt=""
                          fill
                          className={styles.suggestedImage}
                          sizes="(max-width: 900px) 45vw, 400px"
                        />
                      ) : (
                        <div
                          className={[
                            styles.suggestedLogo,
                            media.logoClass ? styles[media.logoClass] : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <Image
                            src={media.src}
                            alt=""
                            fill
                            className={styles.suggestedLogoImage}
                            sizes="140px"
                          />
                        </div>
                      )}
                    </div>
                    <p className={styles.suggestedCaption}>
                      <span>{project.company}</span>
                      <span className={styles.suggestedCaptionMuted}>
                        {" "}
                        · {project.title}
                      </span>
                    </p>
                  </button>
                );
              })}
            </div>
          </RevealBlock>
        </div>
      </div>
    </div>
  );
}
