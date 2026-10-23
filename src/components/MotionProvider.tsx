"use client";

import { MotionConfig } from "motion/react";

/** Motion respects the OS "reduce motion" setting everywhere (transforms/layout animations are skipped). */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
