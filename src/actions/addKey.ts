"use server";

import { notFound, redirect } from "next/navigation";
import { db } from "../prisma/db";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

export type AddKeyState = {
    error?: "required" | "duplicate" | "pathConflict" | "generic";
};

export async function addKey(
    projectId: number,
    slug: string,
    _prevState: AddKeyState,
    formData: FormData,
): Promise<AddKeyState> {
    const t = await getTranslations("error.key");

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const project = await db.orm.public.Project.where({
        id: projectId,
        slug,
        authorId: session.user.id,
    }).first();

    if (!project) {
        notFound();
    }

    const key = formData.get("key");
    const sourceText = formData.get("sourceText");

    if (
        typeof key !== "string" ||
        !key.trim() ||
        typeof sourceText !== "string" ||
        !sourceText.trim()
    ) {
        return { error: "required" };
    }

    const newKey = key.trim();

    const existingKeys = await db.orm.public.Key.where({
        projectId: project.id,
    }).all();

    const existingKey = existingKeys.find(
        (existing) => existing.key === newKey,
    );

    if (existingKey) {
        return { error: "duplicate" };
    }

    const hasPathConflict = existingKeys.some(
        (existing) =>
            existing.key.startsWith(`${newKey}.`) ||
            newKey.startsWith(`${existing.key}.`),
    );

    if (hasPathConflict) {
        return { error: "pathConflict" };
    }

    if (hasPathConflict) {
        return { error: "pathConflict" };
    }

    const allowedLanguages = new Set(project.targetLanguages);

    const translations = [...formData.entries()]
        .filter(([name]) => allowedLanguages.has(name))
        .map(([language, value]) => {
            if (typeof value !== "string") {
                throw new Error(`${t("invalidTranslation")} ${language}`);
            }

            return {
                language,
                text: value.trim(),
            };
        })
        .filter(({ text }) => text.length > 0);

    try {
        await db.transaction(async (tx) => {
            const keyRecord = await tx.orm.public.Key.create({
                key: key.trim(),
                projectId: project.id,
                sourceText: sourceText.trim(),
            });

            if (translations.length > 0) {
                await tx.orm.public.Translation.createAll(
                    translations.map(({ language, text }) => ({
                        keyId: keyRecord.id,
                        text,
                        language,
                    })),
                );
            }
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message.includes(
                "duplicate key value violates unique constraint",
            )
        ) {
            return { error: "duplicate" };
        }

        return { error: "generic" };
    }

    redirect(`/projects/${slug}`);
}
