import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, type Locale } from "./config";
import en from "./dictionaries/en";
import es from "./dictionaries/es";

const dictionaries = { es, en };

/** Current locale from the `[lang]` root segment (server only). */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!value || !hasLocale(value)) notFound();
  return value;
}

export async function getDictionary() {
  return dictionaries[await getLocale()];
}
