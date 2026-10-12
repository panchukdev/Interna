import "server-only";
import { db } from "../prisma/db";

export async function getTranslations(key: number) {
    return db.orm.public.Translation.where({ keyId: key }).all();
}

export async function getTranslationsByKeys(keyIds: number[]) {
    const translations = await Promise.all(
        keyIds.map((keyId) => getTranslations(keyId)),
    );

    return translations.flat();
}
