import { Box, Container, Typography } from "@mui/material";
import LinkButton from "../components/LinkButton";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

export default async function Home() {
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
            greetings = <>Good morning, {name}!</>;
        } else if (time >= 12 && time < 18) {
            greetings = <>Good afternoon, {name}!</>;
        } else if (time >= 18 && time < 22) {
            greetings = <>Good evening, {name}!</>;
        } else {
            greetings = <>Staying up late, {name}?</>;
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
                What would you like to do now?
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
                <LinkButton href="/projects" variant="contained" size="large">
                    My Projects
                </LinkButton>
                <LinkButton href="/create" variant="contained" size="large">
                    Create project
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
