import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import SignIn from "./SignIn";

export async function generateMetadata(
    {},
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const t = await getTranslations("signIn.meta");
    const parentMetadata = await parent;

    return {
        title: t("title"),
        description: t("description"),

        openGraph: {
            ...parentMetadata.openGraph,
            type: "website",
            title: t("title"),
            description: t("description"),
            siteName: "Interna",
        },

        twitter: {
            ...parentMetadata.twitter,
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
        },
    };
}

export default function SignInPage() {
    return <SignIn />;
}
