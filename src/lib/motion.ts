/** Shared editorial motion timing (ms). */
export const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
export const REVEAL_MS = 700;
export const INTRO_PARA_STAGGER_MS = 90;
export const INTRO_PARA_BASE_MS = 120;
export const ROW_CARD_STAGGER_MS = 100;
export const SECTION_TITLE_DELAY_MS = 120;
export const SECTION_ITEM_BASE_MS = 180;
export const SECTION_ITEM_STAGGER_MS = 80;

export function introDurationMs(paragraphCount: number) {
  const lastDelay =
    INTRO_PARA_BASE_MS + Math.max(0, paragraphCount - 1) * INTRO_PARA_STAGGER_MS;
  return lastDelay + REVEAL_MS + 40;
}

export function sectionDurationMs(itemCount: number) {
  const lastDelay =
    SECTION_ITEM_BASE_MS + Math.max(0, itemCount - 1) * SECTION_ITEM_STAGGER_MS;
  return Math.max(SECTION_TITLE_DELAY_MS, lastDelay) + REVEAL_MS + 40;
}

export function rowDurationMs(cardCount: number) {
  const lastDelay = Math.max(0, cardCount - 1) * ROW_CARD_STAGGER_MS;
  return lastDelay + REVEAL_MS + 40;
}
