import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer} data-node-id="1:69">
      <a href="mailto:jl4229@cornell.edu">Email</a>
      <a href="https://twitter.com" target="_blank" rel="noreferrer">
        Twitter
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noreferrer">
        Linkedin
      </a>
      <span>Jessica Liu © 2026</span>
    </footer>
  );
}
