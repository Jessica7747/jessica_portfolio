"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./ProjectRow.module.css";

type ProjectRowProps = {
  children: ReactNode;
  active: boolean;
};

type CardProps = {
  revealed?: boolean;
  staggerMs?: number;
};

export function ProjectRow({ children, active }: ProjectRowProps) {
  return (
    <div
      className={[styles.row, active ? styles.rowActive : ""]
        .filter(Boolean)
        .join(" ")}
      data-row-active={active ? "true" : "false"}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        return cloneElement(child as ReactElement<CardProps>, {
          revealed: active,
          // Horizontal in-row stagger only
          staggerMs: index * 100,
        });
      })}
    </div>
  );
}
