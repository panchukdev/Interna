"use server";

import { auth } from "../lib/auth";
import { APIError } from "better-auth/api";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

type SignupState = {
    error: string | null;
    success?: boolean;
};

export async function signIn(
    prevState: SignupState,
    formData: FormData,
): Promise<SignupState> {
    const t = await getTranslations("error.auth");

    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
        return { error: t("invalid") };
    }

    if (!email.trim() || !password) {
        return { error: t("required") };
    }

    try {
        await auth.api.signInEmail({
            body: {
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

    return { error: null, success: true };
}
