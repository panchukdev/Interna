"use server";

import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";

export type ChangePasswordState = {
    error?: string;
    success?: string;
};

export async function changePassword(
    _prevState: ChangePasswordState,
    formData: FormData,
): Promise<ChangePasswordState> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmNewPassword = formData.get("confirmNewPassword");

    if (
        typeof currentPassword !== "string" ||
        typeof newPassword !== "string" ||
        typeof confirmNewPassword !== "string"
    ) {
        return { error: "Invalid form data." };
    }

    if (
        currentPassword.length < 8 ||
        newPassword.length < 8 ||
        confirmNewPassword.length < 8
    ) {
        return { error: "Password must be at least 8 characters long." };
    }

    if (currentPassword === newPassword) {
        return {
            error: "New password must be different from the current password.",
        };
    }

    if (newPassword !== confirmNewPassword) {
        return { error: "New password doesn't match" };
    }

    try {
        await auth.api.changePassword({
            body: {
                newPassword,
                currentPassword,
            },
            headers: await headers(),
        });
        return { success: "Password changed successfully." };
    } catch (error) {
        if (error instanceof APIError) {
            return { error: error.message };
        }

        return { error: "An unexpected error occurred." };
    }
}
