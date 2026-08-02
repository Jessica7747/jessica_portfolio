"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./CaseStudyModal.module.css";

type LoopingVideoProps = {
  src: string;
  poster: string;
  active: boolean;
};

/**
 * Modal hero video — autoplay + continuous loop.
 * Chromium often stalls near EOF or drops autoplay; we keep a rAF pump.
 */
export function LoopingVideo({ src, poster, active }: LoopingVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let alive = true;
    let raf = 0;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.playsInline = true;
    video.loop = true;
    video.preload = "auto";

    if (!active || reducedMotion) {
      video.pause();
      return;
    }

    const kick = () => {
      if (!alive) return;
      const d = video.duration;
      if (Number.isFinite(d) && d > 0 && video.currentTime >= d - 0.08) {
        try {
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
      if (video.paused || video.ended) {
        void video.play().catch(() => undefined);
      }
    };

    const pump = () => {
      if (!alive) return;
      kick();
      raf = window.requestAnimationFrame(pump);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") kick();
    };

    video.addEventListener("ended", kick);
    video.addEventListener("stalled", kick);
    video.addEventListener("waiting", kick);
    document.addEventListener("visibilitychange", onVisibility);

    kick();
    raf = window.requestAnimationFrame(pump);

    return () => {
      alive = false;
      window.cancelAnimationFrame(raf);
      video.removeEventListener("ended", kick);
      video.removeEventListener("stalled", kick);
      video.removeEventListener("waiting", kick);
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
    };
  }, [src, active, reducedMotion]);

  return (
    <video
      ref={ref}
      className={styles.heroVideo}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
    />
  );
}
