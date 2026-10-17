import { auth } from "@/src/lib/auth";
import { Container, Typography } from "@mui/material";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("settings.meta");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function Settings() {
    const tNav = await getTranslations("navigation");

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
                {tNav("settings")}
            </Typography>
            <ChangePasswordForm />
        </Container>
    );
}
