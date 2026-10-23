"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { imageSrc, type Category, type CategoryInfo, type Project } from "@/data/projects";
import { fill, localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";

type CardContext = { lang: Locale; t: Dictionary["work"]; categories: Record<Category, CategoryInfo> };

/** Zig-zag bento for the full list; equal halves when filtered. */
const bento = [
  "sm:col-span-2 lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-4",
];

const tapeTilt = ["rotate-3", "-rotate-2", "rotate-2", "-rotate-3"];

function ProjectCard({ project, index, ctx }: { project: Project; index: number; ctx: CardContext }) {
  const { lang, t, categories } = ctx;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const tilt = { stiffness: 200, damping: 20 };
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), tilt);
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), tilt);
  const bx = useSpring(cx, { stiffness: 500, damping: 35 });
  const by = useSpring(cy, { stiffness: 500, damping: 35 });
  const category = categories[project.category];
  const portrait = project.ratio !== undefined && project.ratio < 1;

  return (
    <Link
      ref={ref}
      href={localePath(lang, `/proyectos/${project.slug}`)}
      className="group flex h-full flex-col [perspective:1200px] focus-visible:outline-none"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        px.set(0.5);
        py.set(0.5);
      }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
        cx.set(e.clientX - r.left);
        cy.set(e.clientY - r.top);
      }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="sticker-card relative flex flex-1 flex-col transition-shadow duration-300 group-hover:shadow-[0_14px_8px_-10px_oklch(0.42_0.135_355/0.35)] group-focus-visible:ring-4 group-focus-visible:ring-hot"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-blush sm:aspect-auto sm:flex-1">
          <Image
            src={imageSrc(project.slug, 1)}
            alt={fill(t.coverAlt, { title: project.title })}
            fill
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 92vw"
            className={`transition-[scale,filter] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06] ${
              portrait ? "bg-white object-contain" : "object-cover"
            }`}
          />
          <span className="absolute inset-0 bg-berry/0 transition-colors duration-500 group-hover:bg-berry/10" />
        </div>
        <span
          className={`label-tape absolute -bottom-3 right-4 rounded-md px-3 py-0.5 text-xl transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 group-hover:rotate-0 ${tapeTilt[index % tapeTilt.length]}`}
        >
          {project.sticker}
        </span>

        <AnimatePresence>
          {hover && !reduce && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-10 grid h-24 w-24 place-items-center rounded-full bg-hot text-center font-hand text-xl leading-none text-white shadow-lg"
              style={{ x: bx, y: by, translateX: "-50%", translateY: "-50%" }}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 20, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
            >
              {t.bubbleTop}
              <br />
              {t.bubbleBottom}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-6 flex items-start justify-between gap-4 px-1">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: category.color }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
            {category.label}
          </span>
          <h3 className="mt-1 font-display text-2xl leading-tight text-berry md:text-[1.7rem]">{project.title}</h3>
          <p className="mt-1 text-sm text-ink">{project.kicker}</p>
        </div>
        <span className="mt-6 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-berry text-berry transition-[background-color,color,rotate] duration-300 group-hover:-rotate-45 group-hover:bg-berry group-hover:text-white">
          →
        </span>
      </div>
    </Link>
  );
}

export function ProjectGrid({ projects, ...ctx }: { projects: Project[] } & CardContext) {
  const { t, categories } = ctx;
  const [filter, setFilter] = useState<Category | "todos">("todos");
  const visible = filter === "todos" ? projects : projects.filter((p) => p.category === filter);
  const options: [Category | "todos", string, number][] = [
    ["todos", t.all, projects.length],
    ...(Object.keys(categories) as Category[]).map(
      (key) => [key, categories[key].label, projects.filter((p) => p.category === key).length] as [Category, string, number],
    ),
  ];

  return (
    <LayoutGroup>
      <div className="-ml-4 mb-12 flex flex-wrap gap-1" role="group" aria-label={t.filterAria}>
        {options.map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`relative rounded-full px-4 py-2 text-sm font-bold transition-colors duration-300 ${
              filter === key ? "text-white" : "text-berry hover:bg-white/70"
            }`}
          >
            {filter === key && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 -z-0 rounded-full bg-berry"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative">
              {label} <span className={filter === key ? "text-petal" : "text-hot"}>{count}</span>
            </span>
          </button>
        ))}
      </div>

      <motion.ul layout className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 sm:auto-rows-[26rem] lg:grid-cols-6 lg:auto-rows-[30rem]">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)", transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 260, damping: 30, delay: i * 0.04 }}
              className={filter === "todos" ? bento[i % bento.length] : "lg:col-span-3"}
            >
              <div className="reveal-up h-full">
                <ProjectCard project={p} index={i} ctx={ctx} />
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}
