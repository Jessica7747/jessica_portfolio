export type WindowScene = {
  id: string;
  place: string;
  src: string;
  tone: "day" | "night";
};

const scenes = {
  mountTam: {
    id: "mount-tam",
    place: "Mount Tam, CA",
    src: "/images/window/mount-tam.jpg",
    tone: "night",
  },
  kerryPark: {
    id: "kerry-park",
    place: "Kerry Park, Seattle",
    src: "/images/window/kerry-park.jpg",
    tone: "day",
  },
  colchuck: {
    id: "colchuck-lake",
    place: "Colchuck Lake, WA",
    src: "/images/window/colchuck-lake.jpg",
    tone: "day",
  },
  laguna: {
    id: "laguna-beach",
    place: "Laguna Beach, CA",
    src: "/images/window/laguna-beach.jpg",
    tone: "day",
  },
  sunsetPark: {
    id: "sunset-park",
    place: "Sunset Park, Brooklyn",
    src: "/images/window/sunset-park.jpg",
    tone: "night",
  },
  montreal: {
    id: "montreal-winter",
    place: "Montreal, QC",
    src: "/images/window/montreal-winter.jpg",
    tone: "night",
  },
  nyc: {
    id: "nyc-night",
    place: "New York, NY",
    src: "/images/window/nyc-night.jpg",
    tone: "night",
  },
  tahoe: {
    id: "lake-tahoe-stars",
    place: "Lake Tahoe, CA",
    src: "/images/window/lake-tahoe-stars.jpg",
    tone: "night",
  },
  bean: {
    id: "the-bean",
    place: "Cloud Gate, Chicago",
    src: "/images/window/the-bean.jpg",
    tone: "night",
  },
} satisfies Record<string, WindowScene>;

const nightScenes = [scenes.nyc, scenes.tahoe, scenes.bean];

export const windowScenes: WindowScene[] = Object.values(scenes);

/** Local-hour schedule; night rotates by day so repeat visitors see all three. */
export function pickScene(now: Date): WindowScene {
  const hour = now.getHours();
  if (hour >= 5 && hour < 8) return scenes.mountTam;
  if (hour >= 8 && hour < 11) return scenes.kerryPark;
  if (hour >= 11 && hour < 14) return scenes.colchuck;
  if (hour >= 14 && hour < 17) return scenes.laguna;
  if (hour >= 17 && hour < 20) return scenes.sunsetPark;
  if (hour >= 20 && hour < 22) return scenes.montreal;

  const startOfYear = new Date(now.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((now.getTime() - startOfYear) / 86_400_000);
  return nightScenes[dayOfYear % nightScenes.length];
}

export function sceneById(id: string | null): WindowScene | undefined {
  return id ? windowScenes.find((scene) => scene.id === id) : undefined;
}

/** Film-camera style date stamp, e.g. `11 25 '26`. */
export function formatStamp(now: Date): string {
  const year = String(now.getFullYear()).slice(-2);
  return `${now.getMonth() + 1} ${now.getDate()} '${year}`;
}

export function formatLocalTime(now: Date): string {
  return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
