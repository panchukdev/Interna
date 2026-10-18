import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SignUp from "./SignUp";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("signUp.meta");

    return {
        title: t("title"),
        description: t("description"),

        openGraph: {
            type: "website",
            title: t("title"),
            description: t("description"),
            siteName: "Interna",
        },

        twitter: {
            card: "summary",
            title: t("title"),
            description: t("description"),
        },
    };
}

export default function SignUpPage() {
    return <SignUp />;
}
