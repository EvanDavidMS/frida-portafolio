"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { lockScroll } from "./SmoothScroll";
import { fill } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";

const spring = { type: "spring", stiffness: 300, damping: 34 } as const;

export function Gallery({
  images,
  title,
  ratio = 16 / 9,
  t,
}: {
  images: string[];
  title: string;
  ratio?: number;
  t: Dictionary["gallery"];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [dir, setDir] = useState(0);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const step = useCallback(
    (d: number) => {
      setDir(d);
      setOpen((i) => (i === null ? i : (i + d + images.length) % images.length));
    },
    [images.length],
  );

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    lockScroll(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
    // only re-bind when the dialog opens/closes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open === null, close, step]);

  return (
    <>
      <ul className={`grid gap-5 ${images.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "max-w-md"}`}>
        {images.map((src, i) => (
          <li key={src} className="reveal-up">
            <motion.button
              type="button"
              layoutId={src}
              transition={spring}
              onClick={(e) => {
                lastTrigger.current = e.currentTarget;
                setDir(0);
                setOpen(i);
              }}
              className="group sticker-card block w-full cursor-zoom-in p-2 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:-rotate-1"
              aria-label={fill(t.enlarge, { i: i + 1, title })}
            >
              <span className="relative block overflow-hidden rounded-[8px] bg-blush" style={{ aspectRatio: ratio }}>
                <Image
                  src={src}
                  alt={fill(t.alt, { i: i + 1, title })}
                  fill
                  sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-[scale] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
              </span>
            </motion.button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={fill(t.dialog, { i: open + 1, n: images.length, title })}
            className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 md:p-10"
            onClick={close}
          >
            <motion.div
              className="absolute inset-0 bg-ink/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            />
            <motion.div
              layoutId={dir !== 0 ? undefined : images[open]}
              transition={spring}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white p-2"
              style={{ aspectRatio: ratio, maxHeight: "82vh" }}
              onClick={(e) => e.stopPropagation()}
              drag={images.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) step(1);
                else if (info.offset.x > 80) step(-1);
              }}
            >
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div
                  key={open}
                  custom={dir}
                  className="absolute inset-2"
                  initial={{ opacity: 0, x: dir * 60, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: dir * -60, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image src={images[open]} alt={fill(t.alt, { i: open + 1, title })} fill sizes="90vw" className="rounded-xl object-contain" draggable={false} />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="contents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl font-bold text-berry transition-transform hover:rotate-90"
                aria-label={t.close}
              >
                ×
              </button>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      step(-1);
                    }}
                    className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-hot text-2xl font-bold text-white transition-transform hover:-translate-x-1"
                    aria-label={t.prev}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      step(1);
                    }}
                    className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-hot text-2xl font-bold text-white transition-transform hover:translate-x-1"
                    aria-label={t.next}
                  >
                    ›
                  </button>
                  <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-sm font-bold text-berry" aria-live="polite">
                    {open + 1} / {images.length}
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
