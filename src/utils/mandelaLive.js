// src/utils/mandelaLive.js
// ONE switch for the whole Mandela Day drop. Everything — new prices,
// the FC line-up, the promo code — stays OFF until 9:00 AM TODAY, then
// stays ON permanently (persisted, survives refresh/return).

const GO_LIVE = (() => {
  const t = new Date();
  t.setHours(9, 0, 0, 0);   // 9:00 AM today
  return t.getTime();
})();

const KEY = 'mandelaDropDone';

export function isMandelaLive() {
  if (typeof window !== 'undefined' && localStorage.getItem(KEY) === 'true') return true;
  const live = Date.now() >= GO_LIVE;
  if (live && typeof window !== 'undefined') localStorage.setItem(KEY, 'true');
  return live;
}

export const MANDELA_GO_LIVE = GO_LIVE;