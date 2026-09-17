// src/utils/stickersLive.js
// ONE switch for the ScottyUzi Stickers drop.
//
// GO_LIVE is a FIXED, absolute timestamp — Thursday 10 September 2026, 10:00 —
// written once below. It is NOT computed as "tomorrow" relative to whenever
// the page happens to load, so it can never slide forward and reappear.
// Once the clock passes it, isStickersLive() latches permanently via
// localStorage and stays true forever after, even offline / next visit.
//
// Manual override for testing: make isStickersLive() `return true;`
// To replay the countdown: localStorage.removeItem('stickersDropDone')

const GO_LIVE = new Date(2026, 8, 10, 10, 0, 0).getTime(); // month is 0-indexed: 8 = September

const KEY = 'stickersDropDone';

export function isStickersLive() {
  if (typeof window !== 'undefined' && localStorage.getItem(KEY) === 'true') return true;
  const live = Date.now() >= GO_LIVE;
  if (live && typeof window !== 'undefined') localStorage.setItem(KEY, 'true');
  return live;
}

export const STICKERS_GO_LIVE = GO_LIVE;