"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  projects,
  type Project,
  type ProjectVariant,
} from "@/app/(pages)/components/projects";
import styles from "./NavLinks.module.css";

const links = [
  { key: "work" as const, href: "/", label: "Work" },
  { key: "fun" as const, href: "/fun", label: "Fun" },
  { key: "about" as const, href: "/about", label: "About" },
];

const CASE_STUDY_SLUGS = new Set<ProjectVariant>(["apple", "genkit", "spotify"]);

type NavKey = (typeof links)[number]["key"];

type WorkNavLeaf = {
  label: string;
  variant: ProjectVariant;
};

type HighlightBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type NavLinksProps = {
  active: NavKey;
};

function projectHref(variant: ProjectVariant) {
  return CASE_STUDY_SLUGS.has(variant)
    ? `/work/${variant}`
    : `/#project-${variant}`;
}

function navLabel(project: Project): string {
  if (project.variant === "genkit") return "Google";
  if (project.variant === "azure") return "Microsoft Azure";
  if (project.variant === "copilot") return "Microsoft Copilot for Sales";
  return project.company;
}

const workNav: WorkNavLeaf[] = projects.map((project) => ({
  label: navLabel(project),
  variant: project.variant,
}));

function measureItem(menu: HTMLElement, item: HTMLElement): HighlightBox {
  return {
    x: item.offsetLeft,
    y: item.offsetTop,
    width: item.offsetWidth,
    height: item.offsetHeight,
  };
}

function AppleMark() {
  return (
    <svg
      className={styles.workLogoSvg}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"
      />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg
      className={styles.workLogoSvg}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg
      className={styles.workLogoSvg}
      viewBox="0 0 23 23"
      aria-hidden
      focusable="false"
    >
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M12 1h10v10H12z" />
      <path fill="#00A4EF" d="M1 12h10v10H1z" />
      <path fill="#FFB900" d="M12 12h10v10H12z" />
    </svg>
  );
}

function SpotifyMark() {
  return (
    <svg
      className={styles.workLogoSvg}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <path
        fill="#1DB954"
        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
      />
    </svg>
  );
}

function companyLogo(variant: ProjectVariant): ReactNode {
  switch (variant) {
    case "apple":
      return <AppleMark />;
    case "genkit":
      return <GoogleMark />;
    case "aws":
      return (
        <Image
          src="/images/aws-logo.png"
          alt=""
          width={18}
          height={18}
          className={styles.workLogoImage}
        />
      );
    case "azure":
    case "copilot":
      return <MicrosoftMark />;
    case "spotify":
      return <SpotifyMark />;
    default:
      return null;
  }
}

function WorkNavLink({
  item,
  pathname,
  onHighlight,
}: {
  item: WorkNavLeaf;
  pathname: string;
  onHighlight: (el: HTMLElement) => void;
}) {
  const href = projectHref(item.variant);
  const isProjectActive = pathname === `/work/${item.variant}`;
  const logo = companyLogo(item.variant);

  return (
    <Link
      href={href}
      title={item.label}
      className={[
        styles.workItem,
        isProjectActive ? styles.workItemActive : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-current={isProjectActive ? "page" : undefined}
      onMouseEnter={(event) => onHighlight(event.currentTarget)}
      onFocus={(event) => onHighlight(event.currentTarget)}
    >
      {logo ? <span className={styles.workLogo}>{logo}</span> : null}
      <span className={styles.workLabel}>{item.label}</span>
    </Link>
  );
}

export function NavLinks({ active }: NavLinksProps) {
  const pathname = usePathname();
  const projectsOpen = pathname.startsWith("/work/");
  const workActive =
    active === "work" || pathname === "/" || projectsOpen;

  const menuRef = useRef<HTMLDivElement>(null);
  const highlightTargetRef = useRef<HTMLElement | null>(null);
  const [highlight, setHighlight] = useState<HighlightBox | null>(null);
  const [highlightVisible, setHighlightVisible] = useState(false);

  const moveHighlightTo = useCallback((el: HTMLElement) => {
    const menu = menuRef.current;
    if (!menu) return;
    highlightTargetRef.current = el;
    setHighlight(measureItem(menu, el));
    setHighlightVisible(true);
  }, []);

  const syncHighlightToActive = useCallback(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const activeItem = menu.querySelector<HTMLElement>(
      `.${styles.workItem}[aria-current="page"]`,
    );
    if (activeItem) {
      highlightTargetRef.current = activeItem;
      setHighlight(measureItem(menu, activeItem));
      setHighlightVisible(true);
      return;
    }
    highlightTargetRef.current = null;
    setHighlightVisible(false);
  }, []);

  const remeasureCurrentTarget = useCallback(() => {
    const menu = menuRef.current;
    const target = highlightTargetRef.current;
    if (!menu || !target || !menu.contains(target)) return;
    setHighlight(measureItem(menu, target));
  }, []);

  const handleMenuLeave = useCallback(() => {
    syncHighlightToActive();
  }, [syncHighlightToActive]);

  useLayoutEffect(() => {
    if (!projectsOpen) {
      highlightTargetRef.current = null;
      setHighlight(null);
      setHighlightVisible(false);
      return;
    }
    syncHighlightToActive();
  }, [pathname, projectsOpen, syncHighlightToActive]);

  useLayoutEffect(() => {
    if (!projectsOpen) return;
    const menu = menuRef.current;
    if (!menu || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      remeasureCurrentTarget();
    });
    observer.observe(menu);
    return () => observer.disconnect();
  }, [projectsOpen, remeasureCurrentTarget]);
  return (
    <nav className={styles.nav} aria-label="Primary">
      {links.map((link) => {
        if (link.key === "work") {
          return (
            <div key={link.key} className={styles.workGroup}>
              <Link
                href={link.href}
                className={[styles.link, workActive ? styles.active : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={workActive ? "page" : undefined}
              >
                {link.label}
              </Link>
              {projectsOpen ? (
                <div
                  ref={menuRef}
                  className={styles.workMenu}
                  onMouseLeave={handleMenuLeave}
                  onBlur={(event) => {
                    if (
                      !event.currentTarget.contains(
                        event.relatedTarget as Node | null,
                      )
                    ) {
                      handleMenuLeave();
                    }
                  }}
                >
                  <div
                    className={[
                      styles.workHighlight,
                      highlightVisible ? styles.workHighlightVisible : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={
                      highlight
                        ? {
                            width: highlight.width,
                            height: highlight.height,
                            transform: `translate(${highlight.x}px, ${highlight.y}px)`,
                          }
                        : undefined
                    }
                    aria-hidden
                  />
                  {workNav.map((item) => (
                    <WorkNavLink
                      key={item.variant}
                      item={item}
                      pathname={pathname}
                      onHighlight={moveHighlightTo}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        }

        const isActive = active === link.key;

        return (
          <Link
            key={link.key}
            href={link.href}
            className={[styles.link, isActive ? styles.active : ""]
              .filter(Boolean)
              .join(" ")}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
