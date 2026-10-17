"use server";

import { redirect } from "next/navigation";
import { db } from "../prisma/db";
import { getProjectTranslations } from "../lib/translations";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

export async function editKey(keyId: number, slug: string, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const t = await getTranslations("error.key");

    const key = formData.get("key");
    const sourceText = formData.get("sourceText");

    if (
        typeof key !== "string" ||
        !key.trim() ||
        typeof sourceText !== "string" ||
        !sourceText.trim()
    ) {
        throw new Error(t("required"));
    }

    const userId = session.user.id;

    const project = await db.orm.public.Project.where({
        slug,
        authorId: userId,
    }).first();

    if (!project) {
        redirect(`/projects/${slug}`);
    }

    const checkedKey = await db.orm.public.Key.where({
        id: keyId,
        projectId: project.id,
    }).first();

    if (!checkedKey) {
        throw new Error("Key not found.");
    }

    const cleanKey = key.trim();
    const cleanSourceText = sourceText.trim();

    const languages = project.targetLanguages;

    const translations = Object.fromEntries(
        languages.map((language) => [language, formData.get(language)]),
    );

    const existingTranslations = await getProjectTranslations(keyId);

    const updatedTranslations = languages.map((language) => {
        const existingTranslation = existingTranslations.find(
            (translation) => translation.language === language,
        );

        const text = translations[language];

        return {
            language,
            text,
            existingTranslation,
        };
    });

    try {
        await db.transaction(async (tx) => {
            if (checkedKey.key !== cleanKey) {
                await tx.orm.public.Key.where({ id: keyId }).update({
                    key: cleanKey,
                });
            }
            if (checkedKey.sourceText !== cleanSourceText) {
                await tx.orm.public.Key.where({ id: keyId }).update({
                    sourceText: cleanSourceText,
                });
            }
            for (const translation of updatedTranslations) {
                const { language, text, existingTranslation } = translation;

                if (typeof text !== "string") {
                    continue;
                }

                if (!existingTranslation && !text.trim()) {
                    continue;
                }

                const cleanText = text.trim();

                if (existingTranslation) {
                    if (existingTranslation.text !== cleanText) {
                        await tx.orm.public.Translation.where({
                            keyId: checkedKey.id,
                            language,
                        }).update({ text: cleanText });
                    }
                } else {
                    await tx.orm.public.Translation.create({
                        keyId: checkedKey.id,
                        text: cleanText,
                        language,
                    });
                }
            }
        });
    } catch (error) {
        throw new Error(t("errorChanges"), {
            cause: error,
        });
    }
    redirect(`/projects/${slug}`);
}
