import { Box, Container, Typography } from "@mui/material";
import LinkButton from "../components/LinkButton";
import { useTranslations } from "next-intl";

export default function NotFound() {
    const t = useTranslations("error.notFound");

    return (
        <Container
            maxWidth="sm"
            sx={{
                minHeight: "70vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: "6rem", sm: "8rem" },
                        lineHeight: 1,
                        color: "primary.main",
                    }}
                >
                    404
                </Typography>

                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 600 }}
                >
                    {t("title")}
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: 300 }}>
                    {t("description")}
                </Typography>

                <LinkButton
                    size="large"
                    href="/"
                    variant="contained"
                    sx={{ mt: 1 }}
                >
                    {t("backButton")}
                </LinkButton>
            </Box>
        </Container>
    );
}
