"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import type { NavItem } from "./Header";
import { LocaleSwitch } from "./LocaleSwitch";
import { Heart } from "./Ornaments";
import { lockScroll } from "./SmoothScroll";

const expo = [0.16, 1, 0.3, 1] as const;
const ORIGIN = "calc(100% - 2.6rem) 2.35rem";

/** Two lines that morph into an X. */
function Burger({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-5" aria-hidden="true">
      <motion.span
        className="absolute left-0 top-0 h-[2.5px] w-full rounded-full bg-current"
        animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.35, ease: expo }}
      />
      <motion.span
        className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-current"
        animate={open ? { y: -5.5, rotate: -45, width: "100%" } : { y: 0, rotate: 0, width: "70%" }}
        transition={{ duration: 0.35, ease: expo }}
      />
    </span>
  );
}

export function MobileMenu({
  lang,
  dict,
  items,
  active,
  onCv,
  artstation,
  open,
  setOpen,
}: {
  lang: Locale;
  dict: Dictionary["nav"];
  items: NavItem[];
  active: string | null;
  onCv: boolean;
  artstation: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(
    (restoreFocus = true) => {
      lockScroll(false);
      setOpen(false);
      if (restoreFocus) toggleRef.current?.focus();
    },
    [setOpen],
  );

  // Esc closes, Tab stays inside, close if the viewport grows to desktop
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = [...panelRef.current.querySelectorAll<HTMLElement>("a, button")];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onResize = () => mq.matches && close(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, [open, close]);

  useEffect(() => () => lockScroll(false), []);

  const links = [
    ...items.map((i) => ({ ...i, current: active === i.id })),
    { id: "cv", href: localePath(lang, "/cv"), label: dict.cvLong, current: onCv },
  ];

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => {
          lockScroll(true);
          setOpen(true);
        }}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={dict.open}
        className="ml-1.5 grid h-11 w-11 place-items-center rounded-full bg-berry text-white transition-transform active:scale-90 md:hidden"
      >
        <Burger open={false} />
      </button>

      {isClient &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={dict.menu}
                className="checker checker-pink checker-drift fixed inset-0 z-[var(--z-modal)] flex flex-col overflow-y-auto"
                initial={{ clipPath: `circle(0% at ${ORIGIN})` }}
                animate={{ clipPath: `circle(150% at ${ORIGIN})`, transition: { duration: 0.75, ease: expo } }}
                exit={{ clipPath: `circle(0% at ${ORIGIN})`, transition: { duration: 0.5, ease: [0.7, 0, 0.84, 0] } }}
              >
                {/* Top bar mirrors the header so the X sits exactly where the burger was */}
                <div className="flex items-center justify-between px-7 pt-5">
                  <Link href={localePath(lang)} onClick={() => close(false)} className="flex items-center gap-2" aria-label={dict.home}>
                    <Heart className="h-7 w-7" />
                    <span className="font-display text-xl text-berry">
                      Frida<span className="text-hot">.</span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => close()}
                    aria-label={dict.close}
                    className="grid h-11 w-11 place-items-center rounded-full bg-white text-berry shadow-[0_3px_0_var(--color-berry)] transition-transform active:scale-90"
                  >
                    <Burger open />
                  </button>
                </div>

                <ul className="mt-10 flex flex-col gap-2 px-6">
                  {links.map((l, i) => (
                    <motion.li
                      key={l.id}
                      initial={{ opacity: 0, y: 40, rotate: -4, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, rotate: 0, filter: "blur(0px)", transition: { delay: 0.18 + i * 0.06, duration: 0.6, ease: expo } }}
                      exit={{ opacity: 0, y: 20, transition: { duration: 0.15 } }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => close(false)}
                        aria-current={l.current ? "page" : undefined}
                        className={`group flex items-center justify-between rounded-2xl px-5 py-3.5 transition-colors ${
                          l.current ? "bg-white text-berry" : "bg-white/55 text-berry active:bg-white"
                        }`}
                      >
                        <span className="font-display text-[clamp(2rem,9vw,2.75rem)] leading-none">{l.label}</span>
                        {l.current ? (
                          <Heart className="h-7 w-7" />
                        ) : (
                          <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-berry text-lg transition-transform group-active:-rotate-45">
                            →
                          </span>
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  className="mt-8 flex flex-wrap items-center justify-between gap-4 px-7"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5, ease: expo } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-hand text-2xl text-berry">{dict.language}</span>
                    <div onClick={() => close(false)}>
                      <LocaleSwitch lang={lang} aria={dict.switchAria} />
                    </div>
                  </div>
                  <a
                    href={artstation}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full bg-hot px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_0_var(--color-berry)]"
                  >
                    ArtStation ↗
                  </a>
                </motion.div>

                {/* Characters peeking from the bottom */}
                <div className="pointer-events-none relative mt-auto h-40 shrink-0 overflow-hidden">
                  <motion.div
                    className="absolute -bottom-6 left-6 w-28"
                    initial={{ y: 120, rotate: -20 }}
                    animate={{ y: 0, rotate: -8, transition: { delay: 0.45, type: "spring", stiffness: 180, damping: 16 } }}
                    exit={{ y: 120, transition: { duration: 0.2 } }}
                  >
                    <Image src="/img/sticker-honey.webp" alt="" width={435} height={639} className="sticker" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-8 right-8 w-28"
                    initial={{ y: 120, rotate: 20 }}
                    animate={{ y: 0, rotate: 8, transition: { delay: 0.55, type: "spring", stiffness: 180, damping: 16 } }}
                    exit={{ y: 120, transition: { duration: 0.2 } }}
                  >
                    <Image src="/img/sticker-sage.webp" alt="" width={432} height={581} className="sticker" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
