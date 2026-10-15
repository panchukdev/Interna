import "server-only";

import { db } from "@/src/prisma/db";
import { getProject } from "./projects";

type FlatTranslation = {
    key: string;
    text: string;
};

type ImportResult = {
    created: number;
    updated: number;
    unchanged: number;
};

function flattenTranslations(data: unknown, prefix = ""): FlatTranslation[] {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
        throw new Error("Translation JSON must contain an object.");
    }

    const result: FlatTranslation[] = [];

    for (const [key, value] of Object.entries(data)) {
        if (!key || key.includes(".")) {
            throw new Error(`Invalid translation key: "${key}"`);
        }

        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === "string") {
            result.push({ key: fullKey, text: value });
        } else if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
        ) {
            result.push(...flattenTranslations(value, fullKey));
        } else {
            throw new Error(
                `Translation "${fullKey}" must be a string or nested object.`,
            );
        }
    }

    return result;
}

export async function importTranslations(
    projectSlug: string,
    authorId,
    language: string,
    data: unknown,
): Promise<ImportResult> {
    const project = await getProject(projectSlug, authorId);

    if (!project) {
        throw new Error("Project not found.");
    }

    const availableLanguages = [
        project.sourceLanguage,
        ...project.targetLanguages,
    ];

    if (!availableLanguages.includes(language)) {
        throw new Error(`Language "${language}" is not part of this project.`);
    }

    const translations = flattenTranslations(data);

    if (translations.length === 0) {
        throw new Error("The JSON file contains no translations.");
    }

    const seenKeys = new Set<string>();

    for (const translation of translations) {
        if (seenKeys.has(translation.key)) {
            throw new Error(`Duplicate translation key: "${translation.key}".`);
        }

        seenKeys.add(translation.key);
    }

    const importedKeys = new Set(seenKeys);

    for (const key of importedKeys) {
        const parts = key.split(".");

        for (let i = 1; i < parts.length; i++) {
            const parentKey = parts.slice(0, i).join(".");

            if (importedKeys.has(parentKey)) {
                throw new Error(
                    `Conflicting translation keys: "${parentKey}" and "${key}".`,
                );
            }
        }
    }

    return db.transaction(async (tx) => {
        const existingKeys = await tx.orm.public.Key.where({
            projectId: project.id,
        }).all();

        const keysByName = new Map(
            existingKeys.map((item) => [item.key, item]),
        );

        const keysToCreate = translations.filter(
            (item) => !keysByName.has(item.key),
        );

        const keysToUpdate = translations.filter((item) => {
            const existing = keysByName.get(item.key);

            return (
                existing !== undefined &&
                language === project.sourceLanguage &&
                existing.sourceText !== item.text
            );
        });

        let created = 0;
        let updated = 0;
        let unchanged = 0;

        if (language === project.sourceLanguage) {
            if (keysToCreate.length > 0) {
                await tx.orm.public.Key.createAll(
                    keysToCreate.map((item) => ({
                        projectId: project.id,
                        key: item.key,
                        sourceText: item.text,
                    })),
                );

                created += keysToCreate.length;
            }

            for (const item of keysToUpdate) {
                await tx.orm.public.Key.where({
                    projectId: project.id,
                    key: item.key,
                }).update({
                    sourceText: item.text,
                });

                updated++;
            }

            unchanged = translations.length - created - updated;

            return { created, updated, unchanged };
        }

        const missingKeys = translations.filter(
            (item) => !keysByName.has(item.key),
        );

        if (missingKeys.length > 0) {
            throw new Error(
                `Unknown translation keys: ${missingKeys
                    .map((item) => item.key)
                    .join(", ")}. Import the source language first.`,
            );
        }

        const projectTranslations = await Promise.all(
            existingKeys.map((key) =>
                tx.orm.public.Translation.where({
                    keyId: key.id,
                    language,
                }).first(),
            ),
        );

        const keyIds = new Map(existingKeys.map((item) => [item.key, item.id]));

        const existingTranslations = new Map(
            projectTranslations
                .filter((translation) => translation != null)
                .map((translation) => [translation.keyId, translation]),
        );

        for (const item of translations) {
            const keyId = keyIds.get(item.key);

            if (keyId === undefined) {
                throw new Error(`Unknown translation key: "${item.key}".`);
            }

            const existing = existingTranslations.get(keyId);

            if (!existing) {
                await tx.orm.public.Translation.create({
                    keyId,
                    language,
                    text: item.text,
                });

                created++;
            } else if (existing.text !== item.text) {
                await tx.orm.public.Translation.where({
                    id: existing.id,
                }).update({ text: item.text });

                updated++;
            } else {
                unchanged++;
            }
        }

        return { created, updated, unchanged };
    });
}
