import "server-only";
import { getProject } from "./projects";
import { getKeys } from "./keys";
import { getTranslationsByKeys } from "./translations";

type NestedTranslations = {
    [key: string]: string | NestedTranslations;
};

function setNestedValue(
    target: NestedTranslations,
    key: string,
    value: string,
) {
    const parts = key.split(".");
    let current = target;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];

        if (!part) {
            throw new Error(`Invalid translation key: "${key}"`);
        }

        const existing = current[part];

        if (existing === undefined) {
            current[part] = {};
        } else if (typeof existing === "string") {
            throw new Error(`Conflicting translation key: "${key}"`);
        }

        current = current[part] as NestedTranslations;
    }

    const lastPart = parts[parts.length - 1];

    if (!lastPart) {
        throw new Error(`Invalid translation key: "${key}"`);
    }

    if (current[lastPart] !== undefined) {
        throw new Error(`Conflicting translation key: "${key}"`);
    }

    current[lastPart] = value;
}

export async function getExportData(projectSlug: string, languages: string[]) {
    const project = await getProject(projectSlug);

    if (!project) {
        throw new Error("Project not found");
    }

    const keys = await getKeys(project.id);

    const allTranslations = await getTranslationsByKeys(
        keys.map((key) => key.id),
    );

    const translationMap = new Map<string, string>();

    for (const translation of allTranslations) {
        translationMap.set(
            `${translation.keyId}:${translation.language}`,
            translation.text,
        );
    }

    const result: Record<string, NestedTranslations> = {};

    for (const language of languages) {
        const translations: NestedTranslations = {};

        for (const key of keys) {
            const text =
                language === project.sourceLanguage
                    ? key.sourceText
                    : (translationMap.get(`${key.id}:${language}`) ?? "");

            setNestedValue(translations, key.key, text);
        }

        result[language] = translations;
    }

    return result;
}
