"use server";

import { deeplTranslate } from "../lib/deeplTranslate";
import type { SupportedLocale } from "../lib/languages";

export async function translateText(text: string, language: SupportedLocale) {
    return await deeplTranslate(text, language);
}
