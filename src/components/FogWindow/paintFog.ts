type Tone = "day" | "night";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function coverRect(srcW: number, srcH: number, dstW: number, dstH: number) {
  const scale = Math.max(dstW / srcW, dstH / srcH);
  const sw = dstW / scale;
  const sh = dstH / scale;
  return { sx: (srcW - sw) / 2, sy: (srcH - sh) / 2, sw, sh };
}

/**
 * Paints the condensation layer: the scene heavily out of focus, a frosted
 * haze, droplets, clear beads and drip trails. Transparent pixels show the
 * sharper photo underneath, so trails and beads read as clearer glass.
 * Blur comes from downsampling because canvas `filter` isn't in every Safari.
 */
export function paintFog(
  image: HTMLImageElement,
  width: number,
  height: number,
  dpr: number,
  tone: Tone,
  seedKey: string,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const rand = mulberry32(hash(seedKey));
  const { sx, sy, sw, sh } = coverRect(
    image.naturalWidth,
    image.naturalHeight,
    width,
    height,
  );

  const small = document.createElement("canvas");
  small.width = Math.max(8, Math.round(width / 22));
  small.height = Math.max(6, Math.round(height / 22));
  const smallCtx = small.getContext("2d");
  if (smallCtx) {
    smallCtx.imageSmoothingQuality = "high";
    smallCtx.drawImage(image, sx, sy, sw, sh, 0, 0, small.width, small.height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(small, 0, 0, width, height);

  const haze = ctx.createLinearGradient(0, 0, 0, height);
  if (tone === "day") {
    haze.addColorStop(0, "rgba(238, 242, 246, 0.58)");
    haze.addColorStop(1, "rgba(226, 232, 238, 0.4)");
  } else {
    haze.addColorStop(0, "rgba(196, 206, 222, 0.22)");
    haze.addColorStop(1, "rgba(196, 206, 222, 0.08)");
  }
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, width, height);

  const area = width * height;
  const unit = dpr * dpr;

  const fine = Math.round(area / (420 * unit));
  for (let i = 0; i < fine; i += 1) {
    const r = (0.5 + rand() ** 3 * 2.2) * dpr;
    const x = rand() * width;
    const y = rand() * height;
    ctx.beginPath();
    ctx.arc(x, y + r * 0.35, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + rand() * 0.2})`;
    ctx.fill();
  }

  ctx.globalCompositeOperation = "destination-out";

  const trails = Math.max(1, Math.round(width / (520 * dpr)));
  for (let i = 0; i < trails; i += 1) {
    let x = rand() * width;
    let y = rand() * height * 0.45;
    const end = y + height * (0.08 + rand() * 0.14);
    const lineWidth = (0.9 + rand() * 1.1) * dpr;
    ctx.lineCap = "round";
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.moveTo(x, y);
    while (y < end) {
      y += 4 * dpr;
      x += (rand() - 0.5) * 1.4 * dpr;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, lineWidth * 1.6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fill();
  }

  const beads = Math.round(area / (5200 * unit));
  const highlights: Array<[number, number, number]> = [];
  for (let i = 0; i < beads; i += 1) {
    const r = (1.6 + rand() ** 2 * 4.2) * dpr;
    const x = rand() * width;
    const y = rand() * height;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, ${0.45 + rand() * 0.3})`;
    ctx.fill();
    highlights.push([x, y, r]);
  }

  ctx.globalCompositeOperation = "source-over";
  for (const [x, y, r] of highlights) {
    ctx.beginPath();
    ctx.arc(x, y, r * 0.92, Math.PI * 1.05, Math.PI * 1.6);
    ctx.lineWidth = Math.max(0.8, r * 0.28);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.stroke();
  }

  return canvas;
}

/** Fog cut down to scattered droplets; layered during re-fog so condensation re-beads unevenly. */
export function paintSpeckles(fog: HTMLCanvasElement, dpr: number, seedKey: string) {
  const { width, height } = fog;
  const unit = dpr * dpr;
  const count = Math.round((width * height) / (1100 * unit));
  const variants: HTMLCanvasElement[] = [];

  for (let v = 0; v < 3; v += 1) {
    const rand = mulberry32(hash(`${seedKey}:speckle:${v}`));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    ctx.fillStyle = "#000";
    for (let i = 0; i < count; i += 1) {
      ctx.beginPath();
      ctx.arc(
        rand() * width,
        rand() * height,
        (0.8 + rand() ** 3 * 3.2) * dpr,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(fog, 0, 0);
    variants.push(canvas);
  }

  return variants;
}
