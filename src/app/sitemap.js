import { supportedLocales } from "@/src/lib/languages";

export default function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const publicPages = [
        { path: "", priority: 1.0 },
        { path: "/sign-in", priority: 0.5 },
        { path: "/sign-up", priority: 0.5 },
    ];

    return supportedLocales.flatMap((locale) =>
        publicPages.map(({ path, priority }) => ({
            url: `${baseUrl}/${locale}${path}`,
            changeFrequency: "monthly",
            priority,
        })),
    );
}
