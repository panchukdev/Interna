import { auth } from "@/src/lib/auth";
import { Box, Container, Typography } from "@mui/material";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function Settings() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }
    return (
        <Container
            disableGutters
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                Settings
            </Typography>
            <ChangePasswordForm />
        </Container>
    );
}
