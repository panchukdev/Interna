"use server";

import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { getTranslations } from "next-intl/server";

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

    const t = await getTranslations("error.password");
    const tS = await getTranslations("success.password");

    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmNewPassword = formData.get("confirmNewPassword");

    if (
        typeof currentPassword !== "string" ||
        typeof newPassword !== "string" ||
        typeof confirmNewPassword !== "string"
    ) {
        return { error: t("invalid") };
    }

    if (
        currentPassword.length < 8 ||
        newPassword.length < 8 ||
        confirmNewPassword.length < 8
    ) {
        return { error: t("smallLength") };
    }

    if (currentPassword === newPassword) {
        return {
            error: t("sameAsCurrent"),
        };
    }

    if (newPassword !== confirmNewPassword) {
        return { error: t("noMatch") };
    }

    try {
        await auth.api.changePassword({
            body: {
                newPassword,
                currentPassword,
            },
            headers: await headers(),
        });
        return { success: tS("changed") };
    } catch (error) {
        if (error instanceof APIError) {
            return { error: error.message };
        }

        return { error: t("unexpected") };
    }
}
