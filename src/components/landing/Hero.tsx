import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Container,
    Typography,
} from "@mui/material";
import LinkButton from "../LinkButton";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

export default async function Hero() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const t = await getTranslations("landing.hero");

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
                    justifyContent: { xs: "flex-start", md: "space-around" },
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 4, md: 0 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "auto",
                        width: { xs: "100%", md: "45%" },
                        justifyContent: "space-around",
                        gap: 2,
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
                            variant="body1"
                            sx={{ fontWeight: "300", color: "text.secondary" }}
                        >
                            {t("eyebrow")}
                        </Typography>
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
                    </Box>
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
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexDirection: "column",
                        }}
                    >
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
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        width: { xs: "100%", md: "45%" },
                    }}
                >
                    <Card>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="250"
                                image="/images/project-page.png"
                                alt="project dashboard width keys"
                            />
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                >
                                    {t("card.title")}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {t("card.description")}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Box>
            </Container>
        </section>
    );
}
