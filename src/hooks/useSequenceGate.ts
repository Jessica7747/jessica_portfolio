"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/** Runs onComplete once after `durationMs` when `active` becomes true. */
export function useSequenceGate(
  active: boolean,
  durationMs: number,
  onComplete?: () => void,
) {
  const reducedMotion = usePrefersReducedMotion();
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active || doneRef.current) return;

    const complete = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onCompleteRef.current?.();
    };

    if (reducedMotion) {
      complete();
      return;
    }

    const timer = window.setTimeout(complete, durationMs);
    return () => window.clearTimeout(timer);
  }, [active, durationMs, reducedMotion]);

  return reducedMotion;
}
