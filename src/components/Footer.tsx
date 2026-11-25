import styles from "./Footer.module.css";

const links = [
  {
    href: "mailto:jl4229@cornell.edu",
    label: "Email",
    external: false,
  },
  {
    href: "https://x.com",
    label: "X",
    external: true,
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    external: true,
  },
] as const;

export function Footer() {
  return (
    <footer className={styles.footer} data-node-id="1:69">
      <div className={styles.links}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={styles.link}
            {...(link.external
              ? { target: "_blank", rel: "noreferrer" }
              : {})}
          >
            {link.label}
          </a>
        ))}
      </div>
      <span className={styles.copy}>Jessica Liu © 2026</span>
    </footer>
  );
}
