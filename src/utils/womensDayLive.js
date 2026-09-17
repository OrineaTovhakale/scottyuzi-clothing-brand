// src/utils/womensDayLive.js
// ONE switch for the One For One Thursday — Women's Day Edition sale.
// Everything (new products, sale prices, free beanie) stays locked until
// 10:00 AM TODAY, then unlocks permanently.
// Manual override: make isWomensDayLive() `return true;`

const GO_LIVE = (() => {
  const t = new Date();
  t.setHours(10, 0, 0, 0);
  return t.getTime();
})();

const KEY = 'womensDaySaleDone';

export function isWomensDayLive() {
  if (typeof window !== 'undefined' && localStorage.getItem(KEY) === 'true') return true;
  const live = Date.now() >= GO_LIVE;
  if (live && typeof window !== 'undefined') localStorage.setItem(KEY, 'true');
  return live;
}

export const WOMENS_DAY_GO_LIVE = GO_LIVE;