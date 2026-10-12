"use server";

import { redirect } from "next/navigation";
import { db } from "../prisma/db";
import { getTranslations } from "../lib/translations";
import { getKey } from "../lib/keys";

export async function EditKey(
    keyId: number,
    projectId: number,
    slug: string,
    targetLanguages: readonly string[],
    formData: FormData,
) {
    const key = formData.get("key");
    const sourceText = formData.get("sourceText");

    if (
        typeof key !== "string" ||
        !key.trim() ||
        typeof sourceText !== "string" ||
        !sourceText.trim()
    ) {
        throw new Error("Key and source text are required.");
    }

    const cleanKey = key.trim();
    const cleanSourceText = sourceText.trim();

    const translations = Object.fromEntries(
        targetLanguages.map((language) => [language, formData.get(language)]),
    );

    const existingTranslations = await getTranslations(keyId);

    const updatedTranslations = targetLanguages.map((language) => {
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

    console.log(updatedTranslations);
    try {
        const existingKey = await getKey(keyId, projectId);

        if (!existingKey) {
            throw new Error("Key not found.");
        }

        await db.transaction(async (tx) => {
            if (existingKey.key !== cleanKey) {
                await tx.orm.public.Key.where({ id: keyId }).update({
                    key: cleanKey,
                });
            }
            if (existingKey.sourceText !== cleanSourceText) {
                await tx.orm.public.Key.where({ id: keyId }).update({
                    sourceText: cleanSourceText,
                });
            }
            for (const translation of updatedTranslations) {
                const { language, text, existingTranslation } = translation;

                if (typeof text !== "string") {
                    continue;
                }

                if (existingTranslation) {
                    if (existingTranslation.text !== text) {
                        await tx.orm.public.Translation.where({
                            keyId: existingKey.id,
                            language,
                        }).update({ text });
                    }
                } else {
                    await tx.orm.public.Translation.create({
                        keyId: existingKey.id,
                        text,
                        language,
                    });
                }
            }
        });
    } catch (error) {
        throw new Error("Error during saving changes for a key.", error);
    }
    redirect(`/projects/${slug}`);
}
