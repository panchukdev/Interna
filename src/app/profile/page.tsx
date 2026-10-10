import { Box, Typography } from "@mui/material";

export default function Profile() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                Profile
            </Typography>
        </Box>
    );
}
