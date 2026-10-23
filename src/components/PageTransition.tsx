"use client";

import { usePathname, useRouter } from "next/navigation";
import { animate } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Heart } from "./Ornaments";
import { lenisRef, smoothScrollTo } from "./SmoothScroll";

type Labels = Record<Locale, Dictionary["transition"]>;
type Mode = { kind: "page" } | { kind: "lang"; to: Locale };

const ease = [0.76, 0, 0.24, 1] as const;
const layers = [
  { id: 1, color: "var(--color-petal)" },
  { id: 2, color: "var(--color-pink)" },
  { id: 3, color: "var(--color-hot)" },
];

const firstSegment = (path: string) => path.split("/")[1] ?? "";

/**
 * Intercepts internal link clicks: blob panels sweep up to cover the page, the route changes underneath,
 * then the panels lift away. Switching language shows a greeting in the new language.
 */
export function PageTransition({ labels }: { labels: Labels }) {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const target = useRef<string | null>(null);
  const busy = useRef(false);
  const [intro, setIntro] = useState(true);
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<Mode>({ kind: "page" });

  const panels = () => [...(root.current?.querySelectorAll<HTMLElement>(".pt-panel") ?? [])];

  const cover = useCallback(async () => {
    setIntro(false);
    const els = panels();
    const content = root.current?.querySelector<HTMLElement>(".pt-content");
    if (content) content.style.opacity = "0";
    await Promise.all(
      els.map((el, i) => animate(el, { transform: ["translateY(110%)", "translateY(0%)"] }, { duration: 0.62, ease, delay: i * 0.07 })),
    );
    if (content) {
      await animate(
        content,
        { opacity: [0, 1], transform: ["scale(0.85)", "scale(1)"], filter: ["blur(6px)", "blur(0px)"] },
        { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      );
    }
  }, []);

  const reveal = useCallback(async () => {
    const els = panels().reverse();
    await Promise.all(
      els.map((el, i) => animate(el, { transform: ["translateY(0%)", "translateY(-110%)"] }, { duration: 0.75, ease, delay: i * 0.08 })),
    );
    setActive(false);
    busy.current = false;
  }, []);

  // Intercept clicks on internal links (capture phase, before Next's <Link> navigates)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      // Same page: glide to the section (or the top) instead of jumping or replaying the transition
      if (url.pathname === window.location.pathname) {
        e.preventDefault();
        // next tick: lets an open mobile menu unlock scrolling first
        window.setTimeout(() => smoothScrollTo(url.hash ? decodeURIComponent(url.hash) : 0), 0);
        window.history.replaceState(window.history.state, "", url.hash || url.pathname);
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      e.preventDefault();
      if (busy.current) return;
      busy.current = true;

      const from = firstSegment(window.location.pathname);
      const to = firstSegment(url.pathname);
      setMode(to !== from && (to === "es" || to === "en") ? { kind: "lang", to } : { kind: "page" });
      setActive(true);
      target.current = url.pathname;

      cover().then(() => {
        if (!url.hash) {
          lenisRef.current?.scrollTo(0, { immediate: true });
          window.scrollTo(0, 0);
        }
        router.push(url.pathname + url.search + url.hash);
      });

      // Never leave the page covered if navigation stalls
      window.setTimeout(() => {
        if (target.current) {
          target.current = null;
          reveal();
        }
      }, 6000);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [cover, reveal, router]);

  // The new route has rendered underneath: lift the panels
  useEffect(() => {
    if (!target.current || pathname !== target.current) return;
    target.current = null;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => void reveal()));
    return () => cancelAnimationFrame(id);
  }, [pathname, reveal]);

  const label = mode.kind === "lang" ? labels[mode.to] : null;

  return (
    <div ref={root} className={`pt-root ${intro ? "pt-intro" : ""}`} data-active={active} aria-hidden="true">
      {layers.map((l) => (
        <div
          key={l.id}
          className="pt-panel"
          data-layer={l.id}
          style={{ background: l.color }}
          onAnimationEnd={l.id === 1 ? () => setIntro(false) : undefined}
        >
          {l.id === 3 && (
            <div className="pt-content">
              {label ? (
                <>
                  <span className="font-display text-[clamp(3.5rem,12vw,7rem)] leading-none" style={{ textShadow: "0 5px 0 var(--color-berry)" }}>
                    {label.greeting}
                  </span>
                  <span className="flex items-center gap-2 font-hand text-3xl md:text-4xl">
                    <Heart className="h-7 w-7" color="white" /> {label.language}
                  </span>
                </>
              ) : (
                <>
                  <Heart className="pt-beat h-16 w-16 md:h-20 md:w-20" color="white" />
                  <span className="font-display text-4xl md:text-5xl" style={{ textShadow: "0 4px 0 var(--color-berry)" }}>
                    Frida<span className="text-butter">.</span>
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
