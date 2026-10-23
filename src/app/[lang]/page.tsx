import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Flower, Heart, Scallop, Star } from "@/components/Ornaments";
import { ProcessScroll } from "@/components/ProcessScroll";
import { ProjectGrid } from "@/components/ProjectGrid";
import { getCategories, getProject, getProjects, getSite, imageSrc } from "@/data/projects";
import { fill, localePath } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";

const disciplineArt = [
  {
    img: imageSrc("las-aventuras-de-honey", 13),
    rest: "-rotate-3",
    fan: { fx: "105%", fr: "6deg" },
    tape: "-rotate-6 -top-4 left-2 sm:-left-3",
  },
  {
    img: imageSrc("cerebros-y-cemento", 1),
    rest: "rotate-2 sm:-translate-y-8",
    fan: { fx: "0%", fr: "-4deg" },
    tape: "rotate-3 -top-4 right-2",
  },
  {
    img: imageSrc("no-era-tan-dificil", 1),
    rest: "-rotate-1",
    fan: { fx: "-105%", fr: "3deg" },
    tape: "-rotate-3 -bottom-4 right-4",
  },
];

const tools = ["Photoshop", "Illustrator", "Autodesk Maya", "Arnold", "After Effects", "Figma", "Canva"];

export default async function Home() {
  const lang = await getLocale();
  const dict = await getDictionary();
  const site = getSite(lang);
  const projects = getProjects(lang);
  const disciplines = dict.disciplines.items.map((d, i) => ({ ...d, ...disciplineArt[i] }));

  return (
    <>
      <Hero lang={lang} t={dict.hero} name={site.name} />

      {/* Skills ribbon, tilted over the hero edge */}
      <div className="relative z-10 -mt-10 overflow-x-clip">
        <div className="-rotate-2 scale-[1.03] bg-hot shadow-[0_6px_0_var(--color-berry)]">
          <Marquee items={dict.marquee} />
        </div>
      </div>

      {/* Statement: words ink in as you scroll */}
      <section className="relative px-4 pb-24 pt-28 md:pb-32 md:pt-36">
        <Star className="spin-on-scroll absolute left-[8%] top-16 hidden h-14 w-14 md:block" />
        <Flower className="spin-on-scroll absolute bottom-16 right-[9%] hidden h-12 w-12 md:block" />
        <p className="ink-words mx-auto max-w-4xl text-center font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.18] text-berry">
          {dict.statement.split(" ").map((w, i) => (
            <span key={i} className="ink-word" style={{ "--i": i } as React.CSSProperties}>
              {w}{" "}
            </span>
          ))}
        </p>
      </section>

      {/* Disciplines: three cards fan out of a stack */}
      <section className="relative">
        <Scallop fill="var(--color-pink)" />
        <div className="checker checker-pink px-4 pb-24 pt-16">
          <h2 className="mx-auto max-w-3xl text-center font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none text-white" style={{ textShadow: "0 4px 0 var(--color-berry)" }}>
            {dict.disciplines.title}
          </h2>
          <div className="fan-stage mx-auto mt-16 grid max-w-5xl gap-14 sm:grid-cols-3 sm:gap-8">
            {disciplines.map((d) => (
              <div
                key={d.label}
                className="fan-card"
                style={{ "--fx": d.fan.fx, "--fr": d.fan.fr } as React.CSSProperties}
              >
                <div className={`sticker-card relative transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-2 hover:rotate-0 ${d.rest}`}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[10px]">
                    <Image src={d.img} alt="" fill sizes="(min-width: 640px) 30vw, 90vw" className="object-cover" />
                  </div>
                  <span className={`label-tape absolute rounded-md px-3 py-1 text-2xl ${d.tape}`}>{d.label}</span>
                </div>
                <p className="mx-auto mt-7 max-w-[15rem] rounded-xl bg-white/90 px-4 py-3 text-center text-sm font-semibold text-berry">
                  {d.text}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Scallop fill="var(--color-petal)" flip className="-mt-px bg-sky" />
      </section>

      {/* Projects */}
      <section id="proyectos" className="scroll-mt-24 bg-sky px-4 pb-28 pt-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.95] text-berry">
              {dict.work.titleA}
              <br />
              {dict.work.titleB} <span className="text-hot">{dict.work.titleEm}</span>
            </h2>
            <p className="max-w-sm text-ink">
              {fill(dict.work.intro, { n: projects.length })}
            </p>
          </div>
          <ProjectGrid projects={projects} lang={lang} t={dict.work} categories={getCategories(lang)} />
        </div>
      </section>
      <Scallop fill="var(--color-mochi)" className="bg-sky" />

      <ProcessScroll lang={lang} t={dict.process} projectTitle={getProject("cerebros-y-cemento", lang)?.title ?? ""} />

      {/* About */}
      <section id="sobre-mi" className="relative scroll-mt-24 overflow-hidden">
        <div className="mx-auto grid max-w-5xl items-center gap-16 px-4 pb-32 pt-16 md:grid-cols-[1.2fr_1fr]">
          <div className="reveal-up">
            <h2 className="font-display text-[clamp(3rem,7vw,5rem)] leading-[0.95] text-berry">
              {dict.about.titleBefore} <span className="text-hot">Frida</span>
              {dict.about.titleAfter}
            </h2>
            <p className="mt-3 font-hand text-3xl text-sky-ink">{dict.about.subtitle}</p>
            <div className="mt-6 max-w-[60ch] space-y-4 text-lg leading-relaxed text-ink">
              <p>
                {dict.about.p1Before} <strong>{dict.about.p1Strong}</strong> {dict.about.p1After}
              </p>
              <p>{dict.about.p2}</p>
            </div>
            <ul className="mt-7 flex flex-wrap gap-2">
              {tools.map((t, i) => (
                <li
                  key={t}
                  className="cursor-default rounded-full bg-blush px-3.5 py-1.5 text-sm font-bold text-berry transition-[background-color,color,rotate,scale] duration-300 hover:scale-110 hover:bg-hot hover:text-white"
                  style={{ rotate: `${(i % 3) - 1}deg` }}
                >
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
                href={localePath(lang, "/cv")}
                className="group inline-flex items-center gap-2 rounded-full bg-berry px-6 py-3 font-bold text-white shadow-[0_5px_0_var(--color-hot)] transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_7px_0_var(--color-hot)] active:translate-y-1 active:shadow-none"
              >
                <span className="transition-transform duration-300 group-hover:translate-y-0.5"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg></span>
                {dict.about.cv}
              </Link>
              <Link href="#contacto" className="group inline-flex items-center gap-2 font-hand text-3xl text-hot">
                {dict.about.chat}
                <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
              </Link>
            </div>
          </div>

          {/* Photo booth strip */}
          <div className="reveal-clip relative mx-auto w-60 md:w-64">
            <div className="rotate-3 transition-transform duration-700 ease-[var(--ease-out-expo)] hover:rotate-0">
              <Image
                src="/img/sticker-honey.webp"
                alt=""
                width={435}
                height={639}
                className="sticker absolute -left-16 -top-10 z-10 w-24 -rotate-12"
              />
              <Heart className="absolute -right-6 bottom-24 z-10 h-12 w-12 rotate-12" />
              <div className="rounded-sm bg-hot p-3 pb-6 shadow-[0_10px_8px_-6px_oklch(0.42_0.135_355/0.4)]">
                <div className="relative aspect-square overflow-hidden bg-blush">
                  <Image src="/img/frida-avatar.webp" alt={dict.about.altAvatar} fill sizes="256px" className="object-cover" />
                </div>
                <div className="relative mt-3 aspect-square overflow-hidden bg-blush">
                  <Image src={imageSrc("lava-lamp", 3)} alt={dict.about.altRender} fill sizes="256px" className="object-cover" />
                </div>
                <p className="mt-4 text-center font-hand text-4xl leading-none text-white">{dict.about.strip}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
