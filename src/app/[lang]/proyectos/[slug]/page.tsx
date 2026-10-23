import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Gallery } from "@/components/Gallery";
import { NextProject } from "@/components/NextProject";
import { Heart, Scallop, Star } from "@/components/Ornaments";
import { getCategories, getProject, getProjects, imageSrc, projectSlugs } from "@/data/projects";
import { fill, localePath } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug, await getLocale());
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { images: [imageSrc(project.slug, 1)] },
  };
}

const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export default function ProjectPage({ params }: PageProps<"/[lang]/proyectos/[slug]">) {
  return (
    <Suspense fallback={<div className="checker min-h-svh" aria-busy="true" />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLocale();
  const dict = await getDictionary();
  const t = dict.project;
  const project = getProject(slug, lang);
  if (!project) notFound();

  const projects = getProjects(lang);
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const category = getCategories(lang)[project.category];
  const images = Array.from({ length: project.images }, (_, i) => imageSrc(project.slug, i + 1));
  const ratio = project.ratio ?? 16 / 9;
  const words = project.title.split(" ");

  return (
    <article>
      <header className="checker checker-drift relative overflow-hidden px-4 pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <Link
            href={localePath(lang, "/#proyectos")}
            className="rise group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-berry shadow-[0_3px_0_var(--color-petal)] transition-colors hover:bg-blush"
            style={delay(0.4)}
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> {t.back}
          </Link>
          <div className="mt-10 grid items-center gap-12 md:grid-cols-[1fr_1.15fr]">
            <div>
              <span
                className="slap inline-block rounded-md px-3 py-1 text-sm font-bold text-white"
                style={{ background: category.color, ...delay(0.5), "--r": "-12deg", rotate: "-2deg" } as React.CSSProperties}
              >
                {category.label}
              </span>
              <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,4.75rem)] leading-[0.95] text-berry">
                {words.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                    <span className="rise inline-block" style={delay(0.55 + i * 0.07)}>
                      {w}&nbsp;
                    </span>
                  </span>
                ))}
              </h1>
              <p className="rise mt-3 font-hand text-3xl text-hot" style={delay(0.8)}>
                {project.kicker}
              </p>
              <p className="rise mt-5 max-w-md text-lg leading-relaxed text-ink" style={delay(0.9)}>
                {project.summary}
              </p>
            </div>
            <div className="relative">
              <Star className="slap absolute -right-3 -top-7 z-10 h-16 w-16" style={{ ...delay(1.2), "--r": "-60deg" } as React.CSSProperties} />
              <div className="clip-in" style={delay(0.6)}>
                <div className="sticker-card rotate-2">
                  <div className="relative overflow-hidden rounded-[10px] bg-blush" style={{ aspectRatio: ratio < 1 ? 4 / 3 : ratio }}>
                    <Image
                      src={imageSrc(project.slug, 1)}
                      alt={fill(dict.work.coverAlt, { title: project.title })}
                      fill
                      priority
                      sizes="(min-width: 768px) 560px, 92vw"
                      className={ratio < 1 ? "bg-white object-contain" : "object-cover"}
                    />
                  </div>
                </div>
              </div>
              <span className="slap label-tape absolute -bottom-4 left-6 rounded-md px-3 py-0.5 text-2xl" style={{ ...delay(1.1), "--r": "10deg", rotate: "-3deg" } as React.CSSProperties}>
                {project.sticker}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-14 px-4 py-20 md:grid-cols-[1.5fr_1fr]">
        <div className="reveal-up max-w-[62ch] space-y-5 text-lg leading-relaxed text-ink">
          <h2 className="font-display text-4xl text-berry">{t.about}</h2>
          {project.description.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <a
            href={project.source.href}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex rounded-full bg-hot px-6 py-3 text-base font-bold text-white shadow-[0_4px_0_var(--color-berry)] transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
          >
            {project.source.label} ↗
          </a>
        </div>
        <aside className="reveal-up h-fit rounded-2xl bg-white p-7 shadow-[0_6px_8px_-4px_oklch(0.42_0.135_355/0.18)] md:sticky md:top-28">
          <h3 className="flex items-center gap-2 font-display text-xl text-berry">
            <Heart className="h-5 w-5" /> {t.includes}
          </h3>
          <ul className="mt-3 space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-ink">
                <span className="text-hot" aria-hidden="true">✿</span>
                {h}
              </li>
            ))}
          </ul>
          {project.team && (
            <>
              <h3 className="mt-7 font-display text-xl text-berry">{t.team}</h3>
              <p className="mt-1 text-ink">{project.team.join(" · ")}</p>
            </>
          )}
          {project.tools && (
            <>
              <h3 className="mt-7 font-display text-xl text-berry">{t.tools}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {project.tools.map((t) => (
                  <li key={t} className="rounded-full bg-blush px-3 py-1 text-sm font-bold text-berry">
                    {t}
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </section>

      {project.embed && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="mb-6 font-display text-4xl text-berry">{project.embed.label}</h2>
          <div className="reveal-clip sticker-card">
            <div className="relative overflow-hidden rounded-[10px] bg-blush" style={{ aspectRatio: project.embed.ratio }}>
              <iframe
                src={project.embed.src}
                title={`${project.embed.label}: ${project.title}`}
                loading="lazy"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </section>
      )}

      {project.images > 1 && (
        <section className="bg-sky">
          <Scallop fill="var(--color-sky)" className="bg-mochi" />
          <div className="mx-auto max-w-6xl px-4 pb-24 pt-12">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl text-berry">{t.gallery}</h2>
              <p className="font-hand text-2xl text-sky-ink">{t.galleryHint}</p>
            </div>
            <Gallery images={images} title={project.title} ratio={ratio} t={dict.gallery} />
          </div>
          <Scallop fill="var(--color-mochi)" className="bg-sky" />
        </section>
      )}

      <NextProject project={next} lang={lang} label={t.next} />
    </article>
  );
}
