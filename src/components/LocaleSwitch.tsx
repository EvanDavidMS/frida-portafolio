"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { localeCookie, locales, type Locale } from "@/i18n/config";

/** ES / EN pill: keeps you on the same page in the other language and remembers the choice. */
export function LocaleSwitch({ lang, aria }: { lang: Locale; aria: string }) {
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.replace(/^\/(es|en)(?=\/|$)/, "");

  return (
    <div className="relative flex rounded-full bg-blush p-0.5 text-xs font-extrabold" role="group" aria-label={aria}>
      {locales.map((l) => {
        const active = l === lang;
        return (
          <Link
            key={l}
            href={`/${l}${rest}`}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            onClick={() => {
              document.cookie = `${localeCookie}=${l}; path=/; max-age=31536000; samesite=lax`;
            }}
            className={`relative rounded-full px-2.5 py-1.5 uppercase transition-colors duration-300 ${active ? "text-white" : "text-berry hover:text-hot"}`}
          >
            {active && (
              <motion.span
                layoutId="locale-pill"
                className="absolute inset-0 rounded-full bg-berry"
                transition={{ type: "spring", stiffness: 450, damping: 34 }}
              />
            )}
            <span className="relative">{l}</span>
          </Link>
        );
      })}
    </div>
  );
}
