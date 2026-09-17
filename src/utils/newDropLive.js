// src/utils/newDropLive.js
// ONE switch for the new-season drop. The new products, the New Drops rail,
// the Zip Set slider and the collection "New Drops" groups stay hidden until
// 10:00 AM TOMORROW, then unlock permanently (survives refresh/return).
// Manual override: make isNewDropLive() `return true;`

const GO_LIVE = (() => {
  const t = new Date();
  t.setHours(10, 0, 0, 0);   // 10:00 AM tomorrow
  return t.getTime();
})();

const KEY = 'newDropDone';

export function isNewDropLive() {
  if (typeof window !== 'undefined' && localStorage.getItem(KEY) === 'true') return true;
  const live = Date.now() >= GO_LIVE;
  if (live && typeof window !== 'undefined') localStorage.setItem(KEY, 'true');
  return live;
}

export const NEW_DROP_GO_LIVE = GO_LIVE;