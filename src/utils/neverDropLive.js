// src/utils/neverDropLive.js
// ONE switch for the Never 2Fly 2Pray + FC Purple drop.
//
// GO_LIVE is a FIXED, absolute timestamp — Thursday 17 September 2026, 09:00 —
// written once below. It is NOT computed as "today" relative to whenever
// the page happens to load, so it can never slide forward and reappear.
// Once the clock passes it, isNeverDropLive() latches permanently via
// localStorage and stays true forever after, even offline / next visit.
//
// Manual override for testing: make isNeverDropLive() `return true;`
// To replay the countdown: localStorage.removeItem('neverDropDone')

const GO_LIVE = new Date(2026, 8, 17, 9, 0, 0).getTime(); // month is 0-indexed: 8 = September

const KEY = 'neverDropDone';

export function isNeverDropLive() {
  if (typeof window !== 'undefined' && localStorage.getItem(KEY) === 'true') return true;
  const live = Date.now() >= GO_LIVE;
  if (live && typeof window !== 'undefined') localStorage.setItem(KEY, 'true');
  return live;
}

export const NEVER_DROP_GO_LIVE = GO_LIVE;
