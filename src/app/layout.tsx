import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import ThemeRegistry from "../components/ThemeRegistry";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),

    icons: {
        apple: "/apple-touch-icon.png",
    },

    robots: {
        index: true,
        follow: true,
    },

    openGraph: {
        type: "website",
        siteName: "Interna",
        images: [
            {
                url: "/images/og/interna-og-en-US.png",
                width: 1200,
                height: 630,
                alt: "Interna — Translation Management for Developers",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        images: ["/images/og/interna-og-en-US.png"],
    },
};

export const viewport: Viewport = {
    themeColor: "#06060e",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <InitColorSchemeScript attribute="data" defaultMode="system" />
                <AppRouterCacheProvider>
                    <ThemeRegistry>{children}</ThemeRegistry>
                </AppRouterCacheProvider>
                <Analytics />
            </body>
        </html>
    );
}
