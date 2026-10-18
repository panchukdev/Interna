import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import SignUp from "./SignUp";

export async function generateMetadata(
    {},
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const t = await getTranslations("signUp.meta");
    const parentMetadata = await parent;

    return {
        title: t("title"),
        description: t("description"),

        openGraph: {
            ...parentMetadata.openGraph,
            title: t("title"),
            description: t("description"),
        },

        twitter: {
            ...parentMetadata.twitter,
            title: t("title"),
            description: t("description"),
        },
    };
}

export default function SignUpPage() {
    return <SignUp />;
}
