"use server";

import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { APIError } from "better-auth/api";

type SignupState = {
    error: string | null;
};

export async function signup(
    prevState: SignupState,
    formData: FormData,
): Promise<SignupState> {
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
        return { error: "Invalid form data" };
    }

    if (!email.trim() || !name.trim() || !password || !passwordConfirm) {
        return { error: "All fields are required" };
    }

    if (password !== passwordConfirm) {
        return { error: "Passwords do not match" };
    }

    try {
        await auth.api.signUpEmail({
            body: {
                name,
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

    redirect("/");
}
