"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./NavLinks.module.css";

const links = [
  { key: "work" as const, href: "/", label: "Work" },
  { key: "fun" as const, href: "/fun", label: "Fun" },
  { key: "about" as const, href: "/about", label: "About" },
];

type NavKey = (typeof links)[number]["key"];

type NavLinksProps = {
  active: NavKey;
};

export function NavLinks({ active }: NavLinksProps) {
  const [current, setCurrent] = useState(active);
  const [leaving, setLeaving] = useState<NavKey | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      setCurrent(active);
      return;
    }

    if (active === current) return;

    setLeaving(current);
    setCurrent(active);

    const timer = window.setTimeout(() => setLeaving(null), 280);
    return () => window.clearTimeout(timer);
  }, [active, current]);

  return (
    <nav className={styles.nav} aria-label="Primary">
      {links.map((link) => {
        const isActive = current === link.key;
        const isLeaving = leaving === link.key;

        return (
          <Link
            key={link.key}
            href={link.href}
            className={[
              styles.link,
              isActive ? styles.active : "",
              isLeaving ? styles.leaving : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
            <span className={styles.underline} aria-hidden />
          </Link>
        );
      })}
    </nav>
  );
}
