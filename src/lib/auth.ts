import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import { i18n, locales } from "@better-auth/i18n";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        options: "-c search_path=custom_auth",
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        i18n({
            translations: {
                ...locales,
            },
            detection: ["cookie", "header"],
            localeCookie: "interna-locale",
            defaultLocale: "en",
        }),
        nextCookies(),
    ],
});
