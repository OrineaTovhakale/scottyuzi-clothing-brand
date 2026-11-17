// src/utils/vestDropLive.js
// Vest drop is permanently live — no timer, no daily reset.

export function isVestDropLive() {
  return true;
}

export const VEST_DROP_GO_LIVE = 0;

export function vestDropMsLeft() {
  return 0;
}

export function formatVestCountdown() {
  return null;
}
