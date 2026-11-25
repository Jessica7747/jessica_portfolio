"use client";

import { RotateCcw } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { paintFog, paintSpeckles } from "./paintFog";
import {
  formatLocalTime,
  formatStamp,
  pickScene,
  sceneById,
  type WindowScene,
} from "./windowScenes";
import styles from "./FogWindow.module.css";

const BRUSH_RADIUS = 19;
const TOUCH_BRUSH_RADIUS = 23;
const REFOG_DELAY_MS = 1400;
const REFOG_ALPHA = 0.012;
const REFOG_SPECKLE_ALPHA = 0.03;
const REFOG_FRAMES = 340;
const MAX_DPR = 2;

type Point = { x: number; y: number };
type Visit = { scene: WindowScene; stamp: string };

// Picked once per page load from the visitor's clock; `?window=<id>` previews a scene.
let visit: Visit | null = null;
function readVisit(): Visit {
  if (!visit) {
    const now = new Date();
    const override = sceneById(
      new URLSearchParams(window.location.search).get("window"),
    );
    visit = { scene: override ?? pickScene(now), stamp: formatStamp(now) };
  }
  return visit;
}
const subscribeNoop = () => () => {};
const readServerVisit = () => null;

// Ticks on each minute boundary so the stamp's clock stays on the visitor's time.
function subscribeMinute(onChange: () => void) {
  let timer = 0;
  const schedule = () => {
    timer = window.setTimeout(() => {
      onChange();
      schedule();
    }, 60_000 - (Date.now() % 60_000));
  };
  schedule();
  return () => window.clearTimeout(timer);
}
const readLocalTime = () => formatLocalTime(new Date());
const readServerTime = () => "";

export function FogWindow() {
  const reducedMotion = usePrefersReducedMotion();
  const current = useSyncExternalStore(subscribeNoop, readVisit, readServerVisit);
  const scene = current?.scene ?? null;
  const stamp = current?.stamp ?? "";
  const localTime = useSyncExternalStore(subscribeMinute, readLocalTime, readServerTime);
  const [readyId, setReadyId] = useState<string | null>(null);
  const ready = scene !== null && readyId === scene.id;

  const glassRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brushRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fogRef = useRef<HTMLCanvasElement | null>(null);
  const speckleRef = useRef<HTMLCanvasElement[]>([]);
  const brushRadiusRef = useRef(BRUSH_RADIUS);
  const dprRef = useRef(1);
  const lastPointRef = useRef<Point | null>(null);
  const lastStrokeAtRef = useRef(0);
  const refogRef = useRef({ alpha: REFOG_ALPHA, frames: 0 });
  const rafRef = useRef(0);
  const reducedRef = useRef(reducedMotion);

  useEffect(() => {
    reducedRef.current = reducedMotion;
  }, [reducedMotion]);

  const drawFullFog = useCallback(() => {
    const canvas = canvasRef.current;
    const fog = fogRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !fog || !ctx) return;
    ctx.globalCompositeOperation = "copy";
    ctx.globalAlpha = 1;
    ctx.drawImage(fog, 0, 0);
    ctx.globalCompositeOperation = "source-over";
  }, []);

  const rebuildFog = useCallback(() => {
    const glass = glassRef.current;
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!glass || !canvas || !image || !scene) return;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.max(1, Math.round(glass.clientWidth * dpr));
    const height = Math.max(1, Math.round(glass.clientHeight * dpr));
    dprRef.current = dpr;
    canvas.width = width;
    canvas.height = height;
    const fog = paintFog(image, width, height, dpr, scene.tone, scene.id);
    fogRef.current = fog;
    speckleRef.current = paintSpeckles(fog, dpr, scene.id);
    drawFullFog();
    setReadyId(scene.id);
  }, [drawFullFog, scene]);

  useEffect(() => {
    if (!scene) return;
    const image = new window.Image();
    image.decoding = "async";
    image.src = scene.src;
    image.onload = () => {
      imageRef.current = image;
      rebuildFog();
    };
    return () => {
      image.onload = null;
    };
  }, [scene, rebuildFog]);

  useEffect(() => {
    const glass = glassRef.current;
    if (!glass) return;
    let last = { w: 0, h: 0 };
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (Math.abs(width - last.w) < 1 && Math.abs(height - last.h) < 1) return;
      last = { w: width, h: height };
      rebuildFog();
    });
    observer.observe(glass);
    return () => observer.disconnect();
  }, [rebuildFog]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Once strokes stop, droplets re-bead first (speckle layers), then the haze
  // fills in evenly, so a wipe doesn't fade back as a hard-edged ghost.
  const startRefog = useCallback(
    (alpha: number, frames: number) => {
      refogRef.current = { alpha, frames };
      if (rafRef.current) return;

      const step = () => {
        rafRef.current = 0;
        const canvas = canvasRef.current;
        const fog = fogRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !fog || !ctx) return;
        const refog = refogRef.current;

        if (performance.now() - lastStrokeAtRef.current >= REFOG_DELAY_MS) {
          ctx.globalCompositeOperation = "source-over";
          const speckles = speckleRef.current;
          if (speckles.length) {
            ctx.globalAlpha = REFOG_SPECKLE_ALPHA;
            ctx.drawImage(speckles[refog.frames % speckles.length], 0, 0);
          }
          ctx.globalAlpha = refog.alpha;
          ctx.drawImage(fog, 0, 0);
          ctx.globalAlpha = 1;
          refog.frames -= 1;
          if (refog.frames <= 0) {
            drawFullFog();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [drawFullFog],
  );

  const wipeTo = useCallback((point: Point) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = dprRef.current;
    const from = lastPointRef.current ?? point;
    const dx = point.x - from.x;
    const dy = point.y - from.y;
    const distance = Math.hypot(dx, dy);
    const base = brushRadiusRef.current;
    const steps = Math.max(1, Math.ceil(distance / (base * 0.25)));
    // Fast strokes press lighter, like a finger skimming the glass.
    const radius = base * dpr * (1 - Math.min(0.3, distance / 260));

    ctx.globalCompositeOperation = "destination-out";
    for (let i = 1; i <= steps; i += 1) {
      const x = (from.x + (dx * i) / steps) * dpr;
      const y = (from.y + (dy * i) / steps) * dpr;
      const dab = ctx.createRadialGradient(x, y, 0, x, y, radius);
      dab.addColorStop(0, "rgba(0, 0, 0, 0.9)");
      dab.addColorStop(0.5, "rgba(0, 0, 0, 0.7)");
      dab.addColorStop(0.8, "rgba(0, 0, 0, 0.25)");
      dab.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = dab;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    lastPointRef.current = point;
    lastStrokeAtRef.current = performance.now();
  }, []);

  const localPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const moveBrush = (point: Point | null) => {
    const brush = brushRef.current;
    if (!brush) return;
    if (!point) {
      brush.style.opacity = "0";
      return;
    }
    brush.style.opacity = "1";
    brush.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ready) return;
    const isMouse = event.pointerType === "mouse";
    brushRadiusRef.current = isMouse ? BRUSH_RADIUS : TOUCH_BRUSH_RADIUS;
    if (isMouse) moveBrush(localPoint(event));
    if (!isMouse && event.buttons === 0) return;

    const events = event.nativeEvent.getCoalescedEvents?.() ?? [];
    const rect = event.currentTarget.getBoundingClientRect();
    if (events.length > 1) {
      for (const e of events) {
        wipeTo({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    } else {
      wipeTo(localPoint(event));
    }
    if (!reducedRef.current) startRefog(REFOG_ALPHA, REFOG_FRAMES);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === "mouse") return;
    lastPointRef.current = localPoint(event);
    handlePointerMove(event);
  };

  const handlePointerLeave = () => {
    lastPointRef.current = null;
    moveBrush(null);
  };

  const handleRefog = () => {
    lastStrokeAtRef.current = 0;
    if (reducedRef.current) {
      drawFullFog();
      return;
    }
    startRefog(0.09, 40);
  };

  return (
    <section
      className={styles.window}
      data-tone={scene?.tone ?? "day"}
      data-ready={ready || undefined}
      aria-label={
        scene
          ? `A fogged window looking out at ${scene.place}, shot on iPhone. Move your pointer or finger over it to wipe the fog.`
          : "A fogged window"
      }
    >
      <div ref={glassRef} className={styles.glass}>
        {scene ? (
          <Image
            key={scene.id}
            src={scene.src}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 1100px) 100vw, 80vw"
            className={styles.photo}
          />
        ) : null}
        <canvas
          ref={canvasRef}
          className={styles.fog}
          aria-hidden
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={() => {
            lastPointRef.current = null;
          }}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerLeave}
        />
        <div className={styles.grain} aria-hidden />
        <div className={styles.scrim} aria-hidden />
        <div ref={brushRef} className={styles.brush} aria-hidden />
      </div>

      <div className={styles.top}>
        {stamp ? (
          <span className={styles.stamp} aria-hidden>
            <span>{stamp}</span>
            <span>{localTime}</span>
          </span>
        ) : null}
        <button
          type="button"
          className={styles.refog}
          onClick={handleRefog}
          aria-label="Re-fog the window"
          title="Re-fog"
        >
          <RotateCcw size={16} strokeWidth={1.75} aria-hidden />
        </button>
      </div>

      <div className={styles.bottom}>
        <span className={styles.prompt} aria-hidden>
          <span className={styles.promptHover}>Hover to wipe the fog</span>
          <span className={styles.promptTouch}>Drag to wipe the fog</span>
        </span>
        {scene ? (
          <div className={styles.caption}>
            <span className={styles.place}>{scene.place}</span>
            <span className={styles.credit}>Shot on iPhone</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
