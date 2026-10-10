import { Container, Typography } from "@mui/material";

export default function Home() {
    return (
        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                Internationalization Manager
            </Typography>
        </Container>
    );
}
