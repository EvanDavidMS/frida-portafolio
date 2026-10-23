type OrnamentProps = { className?: string; style?: React.CSSProperties };

export function Heart({ className, style, color = "var(--color-hot)" }: OrnamentProps & { color?: string }) {
  return (
    <svg viewBox="0 0 64 58" className={className} style={style} aria-hidden="true">
      <path
        d="M32 54C14 41 4 31 4 18 4 9.5 10.5 4 18 4c6 0 10.5 3.5 14 9 3.5-5.5 8-9 14-9 7.5 0 14 5.5 14 14 0 13-10 23-28 36Z"
        fill={color}
        stroke="white"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M15 16c1.5-3 4-4.5 7-4.5" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity=".8" />
    </svg>
  );
}

export function Star({ className, style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
      <path
        d="M32 4c2.5 13 6 18 18 20.5C38 27 34.5 32 32 46c-2.5-14-6-19-18-21.5C26 22 29.5 17 32 4Z"
        transform="translate(0 7)"
        fill="var(--color-butter)"
        stroke="var(--color-berry)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Flower({ className, style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
      <g fill="white" stroke="var(--color-pink)" strokeWidth="3">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="32" cy="17" rx="10" ry="13" transform={`rotate(${r} 32 32)`} />
        ))}
      </g>
      <circle cx="32" cy="32" r="8" fill="var(--color-butter)" stroke="var(--color-berry)" strokeWidth="3" />
    </svg>
  );
}

export function Sparkle({ className, style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden="true">
      <path
        d="M20 2v12M20 26v12M2 20h12M26 20h12M8 8l6 6M26 26l6 6M32 8l-6 6M14 26l-6 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Bubble({ className, children }: OrnamentProps & { children: React.ReactNode }) {
  return (
    <div
      className={`relative rounded-2xl border-4 border-white bg-hot px-4 py-2 font-hand text-2xl leading-none text-white shadow-lg ${className ?? ""}`}
    >
      {children}
      <span className="absolute -bottom-3 left-6 h-5 w-5 rotate-45 border-b-4 border-r-4 border-white bg-hot" />
    </div>
  );
}

/** Scalloped edge used between sections. `fill` is the color of the section it leads into. */
export function Scallop({ fill, flip = false, className }: { fill: string; flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={`block h-6 w-full md:h-10 ${flip ? "rotate-180" : ""} ${className ?? ""}`}
      aria-hidden="true"
    >
      <path
        d={`M0 40 ${Array.from({ length: 20 }, (_, i) => `Q${i * 60 + 30} -8 ${i * 60 + 60} 40`).join(" ")} Z`}
        fill={fill}
      />
    </svg>
  );
}
