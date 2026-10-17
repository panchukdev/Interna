import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
    const response = intlMiddleware(request);

    const locale = request.nextUrl.pathname.split("/")[1];
    const supportedLocales = routing.locales as readonly string[];

    if (supportedLocales.includes(locale)) {
        const language = locale.split("-")[0];

        response.cookies.set("interna-locale", language, {
            path: "/",
            sameSite: "lax",
        });
    }

    return response;
}

export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
