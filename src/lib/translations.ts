import "server-only";
import { db } from "../prisma/db";

export async function getProjectTranslations(key: number) {
    return db.orm.public.Translation.where({ keyId: key }).all();
}

export async function getProjectTranslationsByKeys(keyIds: number[]) {
    const translations = await Promise.all(
        keyIds.map((keyId) => getProjectTranslations(keyId)),
    );

    return translations.flat();
}
