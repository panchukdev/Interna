import { Box, Typography } from "@mui/material";

export default function Settings() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                Settings
            </Typography>
        </Box>
    );
}
