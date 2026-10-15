const languageNames = new Intl.DisplayNames(["en"], {
    type: "language",
});

export const supportedLocales = [
    "en-US",
    "en-GB",
    "de-DE",
    "pl-PL",
    "uk-UA",
    "ru-RU",
    "fr-FR",
    "es-ES",
    "it-IT",
    "pt-PT",
    "pt-BR",
    "nl-NL",
    "ja-JP",
    "zh-CN",
] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const deeplLanguageMap = {
    "en-US": "en-US",
    "en-GB": "en-GB",
    "de-DE": "de",
    "pl-PL": "pl",
    "uk-UA": "uk",
    "ru-RU": "ru",
    "fr-FR": "fr",
    "es-ES": "es",
    "it-IT": "it",
    "pt-PT": "pt-PT",
    "pt-BR": "pt-BR",
    "nl-NL": "nl",
    "ja-JP": "ja",
    "zh-CN": "zh-HANS",
} as const;

const languagePlaceholders: Record<string, string> = {
    en: "Hello, World!",
    de: "Hallo, Welt!",
    pl: "Witaj, świecie!",
    uk: "Привіт, світе!",
    ru: "Привет, мир!",
    fr: "Bonjour le monde !",
    es: "¡Hola, mundo!",
    it: "Ciao, mondo!",
    pt: "Olá, mundo!",
    nl: "Hallo, wereld!",
    ja: "こんにちは世界！",
    zh: "你好，世界！",
};

export function getLanguageName(code: string): string {
    return languageNames.of(code) ?? code;
}

export function getLanguagePlaceholder(code: string): string {
    const languageCode = code.split("-")[0].toLowerCase();

    return languagePlaceholders[languageCode] ?? "Hello, World!";
}
