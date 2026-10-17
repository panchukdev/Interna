import { Box, Container, Grid, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import KeyIcon from "@mui/icons-material/Key";
import LanguageIcon from "@mui/icons-material/Language";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useTranslations } from "next-intl";

export default function Features() {
    const t = useTranslations("landing.features");

    const features = [
        {
            title: t("translationKeys.title"),
            excerpt: t("translationKeys.excerpt"),
            description: t("translationKeys.description"),
            icon: KeyIcon,
        },
        {
            title: t("multilingualSupport.title"),
            excerpt: t("multilingualSupport.excerpt"),
            description: t("multilingualSupport.description"),
            icon: LanguageIcon,
        },
        {
            title: t("translationProgress.title"),
            excerpt: t("translationProgress.excerpt"),
            description: t("translationProgress.description"),
            icon: ChecklistIcon,
        },
        {
            title: t("AIAssistedTranslations.title"),
            excerpt: t("AIAssistedTranslations.excerpt"),
            description: t("AIAssistedTranslations.description"),
            icon: AutoAwesomeIcon,
        },
    ];

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
                </Box>
                <Grid container spacing={3}>
                    {features.map((feature) => (
                        <Grid key={feature.title} size={{ xs: 12, sm: 6 }}>
                            <Card sx={{ height: "100%" }}>
                                <CardActionArea>
                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 2,
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <feature.icon
                                                sx={{
                                                    fontSize: 40,
                                                    color: "primary.main",
                                                }}
                                            />
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                                sx={{
                                                    color: "primary.main",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {feature.title}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 0.5,
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{ color: "text.secondary" }}
                                            >
                                                {feature.excerpt}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: "text.secondary" }}
                                            >
                                                {feature.description}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </section>
    );
}
