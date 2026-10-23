"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { useRef } from "react";

/** Endless ribbon whose speed and direction follow the scroll velocity. */
export function Marquee({ items, baseSpeed = 3 }: { items: string[]; baseSpeed?: number }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    const move = direction.current * baseSpeed * (delta / 1000) * (1 + Math.abs(b));
    base.set(base.get() - move);
  });

  const row = (hidden: boolean) => (
    <span className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span className="px-6 font-display text-3xl text-white md:text-5xl">{t}</span>
          <svg viewBox="0 0 40 40" className="h-7 w-7 shrink-0 text-butter md:h-9 md:w-9" aria-hidden="true">
            <path d="M20 2c2 11 7 16 18 18-11 2-16 7-18 18-2-11-7-16-18-18C13 18 18 13 20 2Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </span>
  );

  return (
    <div className="overflow-hidden whitespace-nowrap py-4 md:py-5">
      <motion.div className="flex w-max" style={{ x }}>
        {row(false)}
        {row(true)}
      </motion.div>
    </div>
  );
}
