import Image from "next/image";
import { NavLinks } from "./NavLinks";
import styles from "./Sidebar.module.css";

type SidebarProps = {
  active: "work" | "fun" | "about";
  previousAt?: string;
};

export function Sidebar({
  active,
  previousAt = "Previously at Apple, Google Genkit & Amazon Web Services.",
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.avatar}>
        <Image
          src="/images/logo.png"
          alt="Jessica Liu"
          width={75}
          height={75}
          className={styles.avatarImage}
          sizes="75px"
          quality={95}
          priority
        />
      </div>
      <p className={styles.bio}>
        <span>
          I&apos;m Jessica, a product designer on an adventure to design
          tomorrow&apos;s solutions today.{" "}
        </span>
        <span className={styles.bioMuted}>{previousAt}</span>
      </p>
      <NavLinks active={active} />
    </aside>
  );
}
