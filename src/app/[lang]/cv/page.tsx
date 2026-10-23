import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "@/components/Ornaments";
import { PrintButton } from "@/components/PrintButton";
import { getSite } from "@/data/projects";
import { fill, localePath } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { cv } = await getDictionary();
  return { title: cv.metaTitle, description: cv.metaDescription };
}

const software = ["Photoshop", "Illustrator", "Autodesk Maya", "Arnold", "After Effects", "Figma", "Canva"];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2.5 flex items-center gap-2 font-display text-[15px] leading-none text-berry">
      <Heart className="h-3.5 w-3.5" />
      {children}
    </h2>
  );
}

export default async function CvPage() {
  const lang = await getLocale();
  const { cv: t } = await getDictionary();
  const site = getSite(lang);

  return (
    <div className="checker px-4 pb-24 pt-28 print:bg-none print:p-0">
      {/* Toolbar (hidden when printing) */}
      <div
        className="no-print rise mx-auto mb-8 flex max-w-[210mm] flex-wrap items-center justify-between gap-4"
        style={{ "--d": "0.4s" } as React.CSSProperties}
      >
        <div>
          <Link href={localePath(lang)} className="group inline-flex items-center gap-2 text-sm font-bold text-berry">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> {t.back}
          </Link>
          <h1 className="mt-1 font-display text-4xl text-berry">{t.title}</h1>
          <p className="text-sm text-ink">
            {t.hintBefore} <strong>{t.hintStrong}</strong> {t.hintAfter}
          </p>
        </div>
        <PrintButton label={t.print} />
      </div>

      {/* A4 sheet */}
      <article
        className="cv-sheet clip-in mx-auto grid w-full max-w-[210mm] overflow-hidden rounded-2xl bg-white text-ink shadow-[0_10px_8px_-6px_oklch(0.42_0.135_355/0.3)] sm:min-h-[297mm] sm:grid-cols-[68mm_1fr]"
        style={{ "--d": "0.5s" } as React.CSSProperties}
        aria-label={fill(t.aria, { name: site.fullName })}
        lang={lang}
      >
        {/* Sidebar */}
        <aside className="order-2 bg-blush px-[9mm] py-[12mm] text-[12.5px] leading-snug sm:order-none">
          <div className="relative mx-auto w-[34mm]">
            <Image
              src="/img/frida-avatar.webp"
              alt=""
              width={400}
              height={400}
              priority
              className="aspect-square w-full rounded-full border-[5px] border-white object-cover"
            />
            <Image
              src="/img/sticker-honey.webp"
              alt=""
              width={435}
              height={639}
              className="sticker absolute -bottom-2 -right-5 w-[13mm] rotate-6"
            />
          </div>

          <section className="mt-8">
            <SectionTitle>{t.contact}</SectionTitle>
            <ul className="space-y-1.5">
              <li>{site.location}</li>
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="font-bold text-berry">
                    {site.email}
                  </a>
                </li>
              )}
              <li>
                <a href={site.artstation} className="font-bold break-all text-berry">
                  artstation.com/frida_delgadillo4
                </a>
              </li>
            </ul>
          </section>

          <section className="mt-7">
            <SectionTitle>{t.skillsTitle}</SectionTitle>
            <ul className="space-y-1">
              {t.skills.map((s) => (
                <li key={s} className="flex gap-1.5">
                  <span className="text-hot" aria-hidden="true">✿</span>
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-7">
            <SectionTitle>{t.softwareTitle}</SectionTitle>
            <ul className="flex flex-wrap gap-1.5">
              {software.map((s) => (
                <li key={s} className="rounded-full bg-white px-2.5 py-0.5 text-[11.5px] font-bold text-berry">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Main column */}
        <div className="px-[11mm] py-[12mm] text-[13px] leading-relaxed">
          <header className="border-b-2 border-dashed border-petal pb-6">
            <p className="font-hand text-2xl leading-none text-hot">{t.hi}</p>
            <p className="mt-1 font-display text-[40px] leading-[0.95] text-berry">
              Frida
              <br />
              Delgadillo García
            </p>
            <p className="mt-3 text-[15px] font-bold text-ink">{t.role}</p>
          </header>

          <section className="mt-6">
            <SectionTitle>{t.profileTitle}</SectionTitle>
            <p>{t.profile}</p>
          </section>

          <section className="mt-6">
            <SectionTitle>{t.educationTitle}</SectionTitle>
            <p className="font-bold text-berry">{t.degree}</p>
            <p>{t.school}</p>
          </section>

          <section className="mt-6">
            <SectionTitle>{t.featuredTitle}</SectionTitle>
            <ul className="space-y-3">
              {t.featured.map((p) => (
                <li key={p.title}>
                  <p className="font-bold text-berry">
                    {p.title} <span className="font-semibold text-ink/80">· {p.kind}</span>
                  </p>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-7 font-hand text-xl text-hot">{t.closing}</p>
        </div>
      </article>
    </div>
  );
}
