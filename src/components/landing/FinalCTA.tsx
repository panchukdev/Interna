import { Box, Container, Typography } from "@mui/material";
import LinkButton from "../LinkButton";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

export default async function FinalCTA() {
    const t = await getTranslations("landing.finalCTA");

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <section>
            <Container
                disableGutters
                sx={{
                    display: "flex",
                    width: "100%",
                    minHeight: {
                        xs: "calc(100dvh - 56px)",
                        sm: "calc(100dvh - 64px)",
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: { xs: 4, md: 8 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "auto",
                        width: "100%",
                        justifyContent: "space-around",
                        gap: 4,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                fontWeight: "600",
                                color: "primary.main",
                                fontSize: { xs: 36, md: 44 },
                            }}
                        >
                            {t("title")}
                        </Typography>
                        <Typography
                            variant="body1"
                            component="p"
                            sx={{
                                fontWeight: "300",
                                color: "text.secondary",
                                fontSize: { xs: 20, md: 26 },
                            }}
                        >
                            {t("description")}
                        </Typography>
                    </Box>
                    <Box>
                        <LinkButton
                            href={session ? "/projects" : "/sign-up"}
                            variant="contained"
                            size="large"
                        >
                            {t("getStarted")}
                        </LinkButton>
                    </Box>
                </Box>
            </Container>
        </section>
    );
}
