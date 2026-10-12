import { Box, Container, Typography } from "@mui/material";
import LinkButton from "../components/LinkButton";

export default function Home() {
    return (
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
                sx={{ fontWeight: 600, mb: "40px" }}
            >
                Internationalization Manager
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
    );
}
