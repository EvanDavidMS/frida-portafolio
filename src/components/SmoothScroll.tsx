"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/** Shared handle so overlays can pause smooth scrolling. */
export const lenisRef: { current: Lenis | null } = { current: null };

export const HEADER_OFFSET = 88;

export function lockScroll(locked: boolean) {
  if (lenisRef.current) {
    if (locked) lenisRef.current.stop();
    else lenisRef.current.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/** Glide to a section (or the top) with a duration that grows gently with distance. */
export function smoothScrollTo(target: string | number) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : null;
  if (typeof target === "string" && !el) return;
  const y = el ? el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET : (target as number);
  const distance = Math.abs(y - window.scrollY);
  const lenis = lenisRef.current;
  if (lenis) {
    lenis.scrollTo(Math.max(0, y), { duration: Math.min(2.6, 0.8 + distance / 3200), easing: easeInOutCubic });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, y), behavior: reduce ? "auto" : "smooth" });
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Anchor links are handled by PageTransition (Lenis + Next both scrolling caused a jump)
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12 });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);
  return null;
}
