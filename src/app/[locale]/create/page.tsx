import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CreateProjectForm from "./CreateProjectForm";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("create.meta");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function Create() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return <CreateProjectForm userId={session.user.id} />;
}
