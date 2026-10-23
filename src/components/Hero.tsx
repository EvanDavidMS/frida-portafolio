"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Magnetic } from "./Magnetic";
import { Flower, Heart, Star } from "./Ornaments";

type StickerDef = {
  key: string;
  depth: number;
  className: string;
  delay: number;
  rotate: number;
  bob: number;
  content: React.ReactNode;
};

const makeStickers = (t: Dictionary["hero"]): StickerDef[] => [
  {
    key: "honey",
    depth: 34,
    className: "left-[2%] top-[13%] w-20 sm:w-28 lg:left-[5%] lg:top-[12%] lg:w-40",
    delay: 1.05,
    rotate: -18,
    bob: 0,
    content: <Image src="/img/sticker-honey.webp" alt={t.altHoney} width={435} height={639} priority className="-rotate-6" />,
  },
  {
    key: "avatar",
    depth: 26,
    className: "right-[4%] top-[14%] w-20 sm:w-28 lg:right-[8%] lg:top-[11%] lg:w-36",
    delay: 1.15,
    rotate: 16,
    bob: 1.2,
    content: (
      <span className="relative block rotate-6">
        <Image
          src="/img/frida-avatar.webp"
          alt={t.altAvatar}
          width={400}
          height={400}
          priority
          className="aspect-square rounded-full border-[5px] border-white object-cover md:border-[7px]"
        />
        <span className="absolute -bottom-3 -left-5 rounded-full border-[3px] border-white bg-hot px-3 py-0.5 font-hand text-lg text-white md:-left-8 md:text-2xl">
          {t.bubble}
        </span>
      </span>
    ),
  },
  {
    key: "sage",
    depth: 44,
    className: "bottom-[5%] right-[2%] w-20 sm:w-28 lg:bottom-[9%] lg:right-[7%] lg:w-40",
    delay: 1.25,
    rotate: 20,
    bob: 0.6,
    content: <Image src="/img/sticker-sage.webp" alt={t.altSage} width={432} height={581} priority className="rotate-6" />,
  },
  {
    key: "wand",
    depth: 20,
    className: "bottom-[9%] left-[11%] hidden w-[4.5rem] lg:block",
    delay: 1.35,
    rotate: -30,
    bob: 1.8,
    content: <Image src="/img/sticker-wand.webp" alt="" width={301} height={671} className="-rotate-12" />,
  },
  {
    key: "heart",
    depth: 54,
    className: "left-[24%] top-[9%] hidden w-14 lg:block",
    delay: 1.45,
    rotate: 30,
    bob: 0.9,
    content: <Heart className="w-full rotate-12" />,
  },
  {
    key: "star",
    depth: 16,
    className: "bottom-[14%] right-[27%] w-10 lg:w-14",
    delay: 1.5,
    rotate: -40,
    bob: 2.4,
    content: <Star className="w-full" />,
  },
  {
    key: "flower",
    depth: 38,
    className: "left-[4%] bottom-[22%] w-10 lg:bottom-[42%] lg:left-[2%] lg:w-12",
    delay: 1.55,
    rotate: 45,
    bob: 1.5,
    content: <Flower className="w-full" />,
  },
];

function ParallaxSticker({
  def,
  mx,
  my,
  bounds,
}: {
  def: StickerDef;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  bounds: React.RefObject<HTMLElement | null>;
}) {
  const x = useTransform(mx, (v) => v * def.depth);
  const y = useTransform(my, (v) => v * def.depth);
  return (
    <motion.div className={`absolute ${def.className}`} style={{ x, y }}>
      <div className="slap" style={{ "--d": `${def.delay}s`, "--r": `${def.rotate}deg` } as React.CSSProperties}>
        <motion.div
          drag
          dragConstraints={bounds}
          dragElastic={0.18}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 22 }}
          whileHover={{ scale: 1.06, rotate: -3 }}
          whileDrag={{ scale: 1.14, rotate: 8, cursor: "grabbing" }}
          className="sticker bob cursor-grab touch-none select-none"
          style={{ "--b": `${def.bob}s` } as React.CSSProperties}
        >
          <div className="pointer-events-none">{def.content}</div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function PopWord({ word, start }: { word: string; start: number }) {
  return (
    <span className="inline-block whitespace-nowrap" aria-hidden="true">
      {word.split("").map((ch, i) => (
        <span
          key={i}
          className="pop-letter"
          style={{ "--i": start + i, "--r": `${(start + i) % 2 ? -10 : 9}deg` } as React.CSSProperties}
        >
          <span className="inline-block transition-[translate,rotate,color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-[0.12em] hover:-rotate-6 hover:text-hot">
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}

export function Hero({ lang, t, name }: { lang: Locale; t: Dictionary["hero"]; name: string }) {
  const stickers = makeStickers(t);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const spring = { stiffness: 90, damping: 20, mass: 0.6 };
  const mx = useSpring(useMotionValue(0), spring);
  const my = useSpring(useMotionValue(0), spring);

  return (
    <section
      ref={ref}
      className="checker checker-drift relative isolate overflow-hidden"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col items-center justify-center px-4 pb-28 pt-32 text-center md:pb-24 md:pt-28">
        <p className="rise font-hand text-2xl text-berry md:text-3xl" style={{ "--d": "0.45s" } as React.CSSProperties}>
          {t.hi}
        </p>
        <h1
          aria-label={name}
          className="mt-1 font-display text-[clamp(3.2rem,12vw,6rem)] leading-[0.92] text-berry"
          style={{ textShadow: "0 4px 0 var(--color-petal)" }}
        >
          <PopWord word="Frida" start={0} /> <br />
          <PopWord word="Delgadillo" start={5} />
        </h1>
        <p
          className="rise mt-6 max-w-xl text-lg font-semibold leading-snug text-ink md:text-2xl"
          style={{ "--d": "1.15s" } as React.CSSProperties}
        >
          {t.taglineBefore}{" "}
          <span className="font-hand text-[1.45em] leading-none text-hot">{t.taglineEm}</span> {t.taglineAfter}
        </p>
        <p
          className="rise mt-3 text-sm font-bold text-berry md:text-base"
          style={{ "--d": "1.25s" } as React.CSSProperties}
        >
          {t.meta}
        </p>
        <div className="rise mt-9 flex flex-wrap justify-center gap-3" style={{ "--d": "1.4s" } as React.CSSProperties}>
          <Magnetic>
            <a
              href="#proyectos"
              className="group inline-flex items-center gap-2 rounded-full bg-berry px-7 py-3.5 font-bold text-white shadow-[0_5px_0_var(--color-hot)] transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_7px_0_var(--color-hot)] active:translate-y-1 active:shadow-none"
            >
              {t.ctaProjects}
              <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
            </a>
          </Magnetic>
          <Magnetic>
            <Link
              href={localePath(lang, "/cv")}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-berry bg-white px-7 py-3 font-bold text-berry transition-colors hover:bg-blush"
            >
              <span className="transition-transform duration-300 group-hover:translate-y-0.5"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg></span>
              {t.ctaCv}
            </Link>
          </Magnetic>
        </div>

        {stickers.map((s) => (
          <ParallaxSticker key={s.key} def={s} mx={mx} my={my} bounds={ref} />
        ))}

        <p
          className="rise pointer-events-none absolute left-[7%] top-[50%] hidden -rotate-6 font-hand text-xl text-berry xl:block"
          style={{ "--d": "2.1s" } as React.CSSProperties}
        >
          <svg viewBox="0 0 60 40" className="mb-1 ml-10 h-8 w-12" aria-hidden="true">
            <path d="M50 36C40 20 26 10 8 6m0 0 9-5m-9 5 6 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          {t.dragHint}
        </p>
      </div>
    </section>
  );
}
