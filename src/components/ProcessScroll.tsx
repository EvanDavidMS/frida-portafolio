"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { imageSrc } from "@/data/projects";
import { fill, localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";

const slug = "cerebros-y-cemento";
/** Image number for each step, in the same order as the dictionary's process.steps */
const stepImages = [3, 4, 6, 5, 7];

type Step = { n: number; title: string; text: string; alt: string };

function Panel({ step, i }: { step: Step; i: number }) {
  return (
    <figure className="w-[82vw] shrink-0 snap-center sm:w-[60vw] lg:w-[46vw]">
      <div className={`sticker-card ${i % 2 ? "rotate-1" : "-rotate-1"}`}>
        <div className="relative aspect-video overflow-hidden rounded-[10px] bg-blush">
          <Image src={imageSrc(slug, step.n)} alt={step.alt} fill sizes="(min-width: 1024px) 46vw, 82vw" className="object-cover" />
        </div>
      </div>
      <figcaption className="mt-6 flex gap-4 px-1">
        <span className="font-display text-5xl leading-none text-hot">{i + 1}</span>
        <span>
          <span className="block font-display text-2xl text-berry">{step.title}</span>
          <span className="mt-1 block max-w-sm text-ink">{step.text}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function ProcessScroll({ lang, t, projectTitle }: { lang: Locale; t: Dictionary["process"]; projectTitle: string }) {
  const steps: Step[] = t.steps.map((s, i) => ({ ...s, n: stepImages[i], alt: fill(t.alt, { step: s.title }) }));
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPinned(mq.matches && !reduce);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  useEffect(() => {
    if (!pinned || !track.current) return;
    const el = track.current;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  // Lenis already smooths the scroll; a second spring here made the strip drift after the section unpinned
  const x = useTransform(scrollYProgress, (v) => -v * distance);

  const heading = (
    <div className="flex flex-wrap items-end justify-between gap-6 px-4 lg:px-[6vw]">
      <div>
        <p className="font-hand text-3xl text-hot">{t.kicker}</p>
        <h2 className="font-display text-4xl leading-none text-berry md:text-6xl">{t.title}</h2>
      </div>
      <p className="max-w-sm text-ink">
        {t.introBefore} <strong>{projectTitle}</strong>
        {t.introAfter}{" "}
        <Link href={localePath(lang, `/proyectos/${slug}`)} className="font-bold text-berry underline decoration-hot decoration-2 underline-offset-4 hover:text-hot">
          {t.link}
        </Link>
      </p>
    </div>
  );

  return (
    <section
      ref={section}
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
      className={pinned ? "relative" : "relative py-20"}
    >
      {pinned ? (
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          {heading}
          <motion.div ref={track} style={{ x }} className="mt-12 flex w-max gap-[5vw] px-[6vw]">
            {steps.map((s, i) => (
              <Panel key={s.n} step={s} i={i} />
            ))}
          </motion.div>
          <div className="mx-[6vw] mt-10 h-1.5 overflow-hidden rounded-full bg-blush">
            <motion.div className="h-full origin-left rounded-full bg-hot" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      ) : (
        <>
          {heading}
          <div
            className="mt-12 flex snap-x snap-mandatory gap-8 overflow-x-auto px-4 pb-6 [scrollbar-width:none]"
            data-lenis-prevent-horizontal
          >
            {steps.map((s, i) => (
              <Panel key={s.n} step={s} i={i} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
