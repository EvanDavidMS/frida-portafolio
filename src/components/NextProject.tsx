"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { imageSrc, type Project } from "@/data/projects";
import { localePath, type Locale } from "@/i18n/config";

/** Big "next project" link; a preview of its cover trails the cursor on hover. */
export function NextProject({ project, lang, label }: { project: Project; lang: Locale; label: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 26 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 26 });

  return (
    <section className="px-4 py-24 text-center">
      <p className="font-hand text-3xl text-hot">{label}</p>
      <Link
        ref={ref}
        href={localePath(lang, `/proyectos/${project.slug}`)}
        className="group relative mt-2 inline-block"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onPointerMove={(e) => {
          if (!ref.current) return;
          const r = ref.current.getBoundingClientRect();
          x.set(e.clientX - r.left);
          y.set(e.clientY - r.top);
        }}
      >
        <span className="relative z-10 font-display text-[clamp(2.2rem,7vw,5.5rem)] leading-none text-berry transition-colors duration-300 group-hover:text-hot">
          {project.title}{" "}
          <span className="inline-block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3">→</span>
        </span>
        <AnimatePresence>
          {hover && !reduce && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-0 block w-64 md:w-80"
              style={{ x, y, translateX: "-50%", translateY: "-60%" }}
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 4 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 8, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <span className="sticker-card block p-1.5">
                <span className="relative block aspect-video overflow-hidden rounded-[8px] bg-blush">
                  <Image src={imageSrc(project.slug, 1)} alt="" fill sizes="320px" className="object-cover" />
                </span>
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
      <p className="mx-auto mt-4 max-w-md text-ink">{project.kicker}</p>
    </section>
  );
}
