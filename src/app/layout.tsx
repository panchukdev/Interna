import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import ThemeRegistry from "../components/ThemeRegistry";
import Footer from "../components/layout/Footer";
import Box from "@mui/material/Box";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

export const metadata: Metadata = {
    title: "interna",
    description:
        "Internationalization manager for adapting your projects to different languages",
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
                    <ThemeRegistry>
                        <Navbar />

                        <Box
                            component="main"
                            sx={{
                                minHeight: {
                                    xs: "calc(100dvh - 56px)",
                                    sm: "calc(100dvh - 64px)",
                                },
                                pt: {
                                    xs: "72px", // 56px navbar + 16px padding
                                    sm: "80px", // 64px navbar + 16px padding
                                },
                                p: 2,
                            }}
                        >
                            {children}
                        </Box>

                        <Footer />
                    </ThemeRegistry>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
