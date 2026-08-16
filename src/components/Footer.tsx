import Image from "next/image";
import styles from "./Footer.module.css";

const links = [
  {
    href: "mailto:jl4229@cornell.edu",
    label: "Email",
    icon: "/images/social/mail.png",
    external: false,
  },
  {
    href: "https://x.com",
    label: "X",
    icon: "/images/social/x.png",
    external: true,
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    icon: "/images/social/linkedin.png",
    external: true,
  },
] as const;

export function Footer() {
  return (
    <footer className={styles.footer} data-node-id="1:69">
      <div className={styles.icons}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={styles.iconLink}
            aria-label={link.label}
            {...(link.external
              ? { target: "_blank", rel: "noreferrer" }
              : {})}
          >
            <Image
              src={link.icon}
              alt=""
              width={28}
              height={28}
              className={styles.icon}
            />
          </a>
        ))}
      </div>
      <span className={styles.copy}>Jessica Liu © 2026</span>
    </footer>
  );
}
