"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { LocaleSwitch } from "./LocaleSwitch";
import { Magnetic } from "./Magnetic";
import { MobileMenu } from "./MobileMenu";
import { Heart } from "./Ornaments";

export type NavItem = { id: string; href: string; label: string };

const sectionIds = ["proyectos", "sobre-mi", "contacto"];

/** Which home section is under the middle of the viewport (null on the hero or other pages). */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        setActive(sectionIds.findLast((id) => visible.get(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [enabled]);
  return enabled ? active : null;
}

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
  </svg>
);

export function Header({ lang, dict, artstation }: { lang: Locale; dict: Dictionary["nav"]; artstation: string }) {
  const pathname = usePathname() ?? "";
  const onHome = pathname === `/${lang}`;
  const onCv = pathname === `/${lang}/cv`;
  const active = useActiveSection(onHome);

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240);
    setScrolled(y > 12);
  });

  const items: NavItem[] = [
    { id: "proyectos", href: localePath(lang, "/#proyectos"), label: dict.projects },
    { id: "sobre-mi", href: localePath(lang, "/#sobre-mi"), label: dict.about },
    { id: "contacto", href: localePath(lang, "/#contacto"), label: dict.contact },
  ];
  const pill = hovered ?? active;

  return (
    <motion.header
      animate={{ y: hidden && !menuOpen ? "-110%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="no-print fixed inset-x-0 top-0 z-[var(--z-sticky)] px-3 pt-3"
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full py-2 pl-4 pr-2 transition-[background-color,box-shadow] duration-500 md:pl-5 md:pr-3 ${
          scrolled && !menuOpen ? "bg-white/90 shadow-[0_4px_8px_-4px_oklch(0.42_0.135_355/0.25)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <Link
          href={localePath(lang)}
          className="group relative z-10 flex items-center gap-2"
          aria-label={dict.home}
          aria-current={onHome ? "page" : undefined}
        >
          <Heart className="h-7 w-7 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-12 group-hover:scale-125" />
          <span className="font-display text-xl text-berry">
            Frida<span className="text-hot">.</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-bold" aria-label={dict.menu}>
          <ul className="hidden items-center gap-1 md:flex" onPointerLeave={() => setHovered(null)}>
            {items.map((l) => (
              <li key={l.id}>
                <Link
                  href={l.href}
                  onPointerEnter={() => setHovered(l.id)}
                  aria-current={active === l.id ? "location" : undefined}
                  className="relative block rounded-full px-4 py-2 text-berry"
                >
                  {pill === l.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-blush"
                      transition={{ type: "spring", stiffness: 450, damping: 34 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-hot"
                      transition={{ type: "spring", stiffness: 450, damping: 34 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={localePath(lang, "/cv")}
            aria-current={onCv ? "page" : undefined}
            className={`relative z-10 ml-1 inline-flex items-center gap-1.5 rounded-full border-2 border-berry px-3.5 py-1.5 transition-colors ${
              onCv ? "bg-berry text-white" : "bg-white text-berry hover:bg-blush"
            }`}
          >
            <DownloadIcon />
            {dict.cv}
          </Link>
          <Magnetic strength={0.25} className="hidden lg:inline-block">
            <a
              href={artstation}
              target="_blank"
              rel="noreferrer"
              className="ml-1 inline-flex rounded-full bg-hot px-4 py-2 text-white shadow-[0_4px_0_var(--color-berry)] transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
            >
              ArtStation ↗
            </a>
          </Magnetic>
          <div className="ml-1.5 hidden md:block">
            <LocaleSwitch lang={lang} aria={dict.switchAria} />
          </div>

          <MobileMenu
            lang={lang}
            dict={dict}
            items={items}
            active={active}
            onCv={onCv}
            artstation={artstation}
            open={menuOpen}
            setOpen={setMenuOpen}
          />
        </nav>
      </div>
    </motion.header>
  );
}
