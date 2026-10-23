import Image from "next/image";
import Link from "next/link";
import type { Site } from "@/data/projects";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Magnetic } from "./Magnetic";
import { Heart, Scallop } from "./Ornaments";

export function Footer({
  lang,
  dict,
  nav,
  site,
}: {
  lang: Locale;
  dict: Dictionary["footer"];
  nav: Dictionary["nav"];
  site: Site;
}) {
  const word = dict.title;
  return (
    <footer id="contacto" className="no-print relative mt-auto scroll-mt-20">
      <Scallop fill="var(--color-hot)" />
      <div className="relative overflow-hidden bg-hot pb-8 pt-16 text-white">
        <Image
          src="/img/sticker-sage.webp"
          alt=""
          width={432}
          height={581}
          className="sticker spin-on-scroll pointer-events-none absolute -right-6 top-16 hidden w-32 md:block lg:right-[6%] lg:w-40"
        />
        <div className="mx-auto max-w-6xl px-4">
          <p className="font-hand text-3xl md:text-4xl">{dict.kicker}</p>
          <h2
            className="group mt-2 font-display text-[clamp(3.5rem,13vw,6rem)] leading-none"
            aria-label={word}
            style={{ textShadow: "0 5px 0 var(--color-berry)" }}
          >
            {word.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="inline-block transition-[translate,rotate,color] duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-3 group-hover:text-butter"
                style={{ transitionDelay: `${i * 30}ms`, rotate: i % 2 ? "2deg" : "-2deg" }}
              >
                {ch === " " ? " " : ch}
              </span>
            ))}
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {site.email && (
              <Magnetic>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex rounded-full bg-white px-6 py-3 font-bold text-berry shadow-[0_5px_0_var(--color-berry)] transition-[translate,box-shadow] hover:-translate-y-0.5"
                >
                  {site.email}
                </a>
              </Magnetic>
            )}
            <Magnetic>
              <a
                href={site.artstation}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full bg-berry px-6 py-3 font-bold text-white shadow-[0_5px_0_var(--color-ink)] transition-[translate,box-shadow] hover:-translate-y-0.5"
              >
                {dict.artstation}
              </a>
            </Magnetic>
            <Magnetic>
              <Link
                href={localePath(lang, "/cv")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-berry shadow-[0_5px_0_var(--color-berry)] transition-[translate,box-shadow] hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg>
                {dict.cv}
              </Link>
            </Magnetic>
          </div>

          <div className="mt-20 grid gap-8 border-t-2 border-white/30 pt-8 text-sm sm:grid-cols-3">
            <div>
              <p className="font-display text-lg">{site.fullName}</p>
              <p className="mt-1 text-white/90">{site.role}</p>
              <p className="text-white/90">{site.location}</p>
            </div>
            <nav className="flex flex-col gap-1 font-bold" aria-label={dict.navAria}>
              <Link href={localePath(lang)} className="w-fit hover:underline">{dict.home}</Link>
              <Link href={localePath(lang, "/#proyectos")} className="w-fit hover:underline">{nav.projects}</Link>
              <Link href={localePath(lang, "/#sobre-mi")} className="w-fit hover:underline">{nav.about}</Link>
              <Link href={localePath(lang, "/cv")} className="w-fit hover:underline">{nav.cv}</Link>
            </nav>
            <div className="flex flex-col justify-between gap-4 sm:items-end">
              <a href="#top" className="group inline-flex w-fit items-center gap-2 font-hand text-2xl">
                {dict.top}
                <Heart className="h-6 w-6 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5 group-hover:rotate-12" />
              </a>
              <p className="text-white/85">© 2026 · {dict.made}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
