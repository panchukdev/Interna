import { auth } from "@/src/lib/auth";
import { Avatar, Box, Container, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("profile.meta");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function Profile() {
    const t = await getTranslations("profile");

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const initials = session.user.name
        .split(" ")
        .map((part) => part[0])
        .join("");

    const createdAt = new Date(session.user.createdAt).toLocaleString(
        undefined,
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        },
    );
    return (
        <Container
            disableGutters
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                mt: 20,
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
                <Avatar
                    alt="User"
                    sx={{
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        width: 100,
                        height: 100,
                        fontSize: 50,
                    }}
                >
                    {initials}
                </Avatar>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 600 }}
                >
                    {session.user.name}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 400 }}>
                    {session.user.email}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {t("since")} {createdAt}
                </Typography>
            </Box>
        </Container>
    );
}
