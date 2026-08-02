"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

/** Fires `onComplete` once after `durationMs` when `active` becomes true. */
export function useWhenComplete(
  active: boolean,
  durationMs: number,
  onComplete?: () => void,
) {
  const reducedMotion = useReducedMotion();
  const done = useRef(false);

  useEffect(() => {
    if (!active || !onComplete || done.current) return;

    if (reducedMotion) {
      done.current = true;
      onComplete();
      return;
    }

    const timer = window.setTimeout(() => {
      done.current = true;
      onComplete();
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [active, durationMs, onComplete, reducedMotion]);
}
