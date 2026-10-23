"use client";

import { Magnetic } from "./Magnetic";

export function PrintButton({ label }: { label: string }) {
  return (
    <Magnetic>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-full bg-berry px-6 py-3 font-bold text-white shadow-[0_5px_0_var(--color-hot)] transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_7px_0_var(--color-hot)] active:translate-y-1 active:shadow-none"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <path d="M6 14h12v7H6z" />
        </svg>
        {label}
      </button>
    </Magnetic>
  );
}
