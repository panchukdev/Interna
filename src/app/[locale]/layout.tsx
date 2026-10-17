import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import { routing } from "@/src/i18n/routing";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Box from "@mui/material/Box";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "meta" });

    return {
        title: {
            default: t("title"),
            template: `%s | Interna`,
        },
        description: t("description"),
    };
}

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const messages = await getMessages();

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <NextIntlClientProvider messages={messages}>
            <Navbar session={session} />

            <Box
                component="main"
                sx={{
                    minHeight: {
                        xs: "calc(100dvh - 56px)",
                        sm: "calc(100dvh - 64px)",
                    },
                    pt: {
                        xs: "72px",
                        sm: "80px",
                    },
                    p: 2,
                }}
            >
                {children}
            </Box>

            <Footer />
        </NextIntlClientProvider>
    );
}
