import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box component="footer" sx={{ py: 3, bgcolor: "background.paper" }}>
            <Container maxWidth="xl">
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    © 2026 INTERNA. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
