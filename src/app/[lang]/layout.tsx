import type { Metadata, Viewport } from "next";
import { Bagel_Fat_One, Caveat, Nunito } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import { PageTransition } from "@/components/PageTransition";
import { SmoothScroll } from "@/components/SmoothScroll";
import { locales } from "@/i18n/config";
import en from "@/i18n/dictionaries/en";
import es from "@/i18n/dictionaries/es";
import { getDictionary, getLocale } from "@/i18n/server";
import { getSite } from "@/data/projects";
import "../globals.css";

const bagel = Bagel_Fat_One({
  variable: "--font-bagel",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: { default: dict.meta.title, template: "%s · Frida Delgadillo" },
    description: dict.meta.description,
    alternates: { languages: { es: "/es", en: "/en" } },
  };
}

export const viewport: Viewport = {
  colorScheme: "only light",
  themeColor: "#fde4ef",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLocale();
  const dict = await getDictionary();
  const site = getSite(lang);

  return (
    <html lang={lang} className={`${bagel.variable} ${nunito.variable} ${caveat.variable} h-full antialiased`}>
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to <body> before hydration */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <div id="top" />
        <SmoothScroll />
        <MotionProvider>
          <Header lang={lang} dict={dict.nav} artstation={site.artstation} />
          <main className="flex-1">{children}</main>
          <Footer lang={lang} dict={dict.footer} nav={dict.nav} site={site} />
          <PageTransition labels={{ es: es.transition, en: en.transition }} />
        </MotionProvider>
      </body>
    </html>
  );
}
