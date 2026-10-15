import { defineRouting } from "next-intl/routing";
import { supportedLocales } from "../lib/languages";

export const routing = defineRouting({
    locales: supportedLocales,
    defaultLocale: "en-US",
});
