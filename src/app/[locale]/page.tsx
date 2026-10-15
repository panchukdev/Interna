import { Box, Container, Typography } from "@mui/material";
import LinkButton from "@/src/components/LinkButton";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

export default async function Home() {
    const t = await getTranslations("landing");
    const tNav = await getTranslations("navigation");

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    let greetings;

    if (session) {
        const name = (
            <span style={{ whiteSpace: "nowrap" }}>{session.user.name}</span>
        );
        const time = new Date().getHours();
        if (time >= 6 && time < 12) {
            greetings = (
                <>
                    {t("greeting.morning")} {name}!
                </>
            );
        } else if (time >= 12 && time < 18) {
            greetings = (
                <>
                    {t("greeting.afternoon")} {name}!
                </>
            );
        } else if (time >= 18 && time < 22) {
            greetings = (
                <>
                    {t("greeting.evening")} {name}!
                </>
            );
        } else {
            greetings = <>{t("greeting.late")}</>;
        }
    }

    return session ? (
        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: "200px",
            }}
        >
            <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}
            >
                {greetings}
            </Typography>
            <Typography
                variant="h6"
                sx={{ fontWeight: 300, mb: 1, textAlign: "center" }}
            >
                {t("question")}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
                <LinkButton href="/projects" variant="contained" size="large">
                    {tNav("myProjects")}
                </LinkButton>
                <LinkButton href="/create" variant="contained" size="large">
                    {tNav("newProject")}
                </LinkButton>
            </Box>
        </Container>
    ) : (
        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: "200px",
            }}
        >
            <Typography
                variant="h4"
                component="h1"

                sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}
            >
                Internationalization Manager
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 300, mb: 1 }}>
                You know you aren&apos;t signed in, right?
            </Typography>
        </Container>
    );
}
