// src/components/ScrollToTop.jsx
// Resets scroll to the top on every navigation — instantly (snaps, never animates),
// and on the location `key` too, so product → product (same /product path) also resets.
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, key } = useLocation();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    // Force an instant jump even if global CSS sets scroll-behavior: smooth
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    // restore whatever the page had after the jump
    requestAnimationFrame(() => { html.style.scrollBehavior = prev; });
  }, [pathname, key]);

  return null;
}