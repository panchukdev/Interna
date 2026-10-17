"use server";

import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

type SignupState = {
    error: string | null;
};

export async function signup(
    prevState: SignupState,
    formData: FormData,
): Promise<SignupState> {
    const t = await getTranslations("error.auth");

    const email = formData.get("email");
    const name = formData.get("name");
    const password = formData.get("password");
    const passwordConfirm = formData.get("passwordConfirm");

    if (
        typeof email !== "string" ||
        typeof name !== "string" ||
        typeof password !== "string" ||
        typeof passwordConfirm !== "string"
    ) {
        return { error: t("invalid") };
    }

    if (!email.trim() || !name.trim() || !password || !passwordConfirm) {
        return { error: t("required") };
    }

    if (password !== passwordConfirm) {
        return { error: t("noMatch") };
    }

    try {
        await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
                callbackURL: "/",
            },
            headers: await headers(),
        });
    } catch (error) {
        if (error instanceof APIError) {
            return { error: error.message };
        }

        return { error: t("unexpected") };
    }

    redirect("/");
}
