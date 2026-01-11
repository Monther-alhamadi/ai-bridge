import "server-only";
import type { Locale } from "@/config/i18n";

const dictionaries = {
  en: () => import("@/config/en.json").then((module) => module.default),
  ar: () => import("@/config/ar.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();
