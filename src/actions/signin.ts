"use server";

import { auth } from "../lib/auth";
import { APIError } from "better-auth/api";

type SignupState = {
    error: string | null;
    success?: boolean;
};

export async function signIn(
    prevState: SignupState,
    formData: FormData,
): Promise<SignupState> {
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
        return { error: "Invalid form data" };
    }

    if (!email.trim() || !password) {
        return { error: "All fields are required" };
    }

    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
                callbackURL: "/",
            },
        });
    } catch (error) {
        if (error instanceof APIError) {
            return { error: error.message };
        }

        return { error: "An unexpected error occurred." };
    }

    return { error: null, success: true };
}
