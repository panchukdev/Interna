import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations("footer");
    return (
        <Box component="footer" sx={{ py: 3, bgcolor: "background.paper" }}>
            <Container maxWidth="xl">
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    © 2026 INTERNA. {t("rights")}
                </Typography>
            </Container>
        </Box>
    );
}
