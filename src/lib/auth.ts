import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        options: "-c search_path=auth",
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [nextCookies()],
});
