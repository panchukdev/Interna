import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SignIn from "./SignIn";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("signIn.meta");

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function SignInPage() {
    return <SignIn />;
}
