"use server";

import { notFound, redirect } from "next/navigation";
import { db } from "../prisma/db";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

export async function addKey(
    projectId: number,
    slug: string,
    formData: FormData,
) {
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
        throw new Error("Key and source text are required.");
    }

    const allowedLanguages = new Set(project.targetLanguages);

    const translations = [...formData.entries()]
        .filter(([name]) => allowedLanguages.has(name))
        .map(([language, value]) => {
            if (typeof value !== "string") {
                throw new Error(`Invalid translation for: ${language}`);
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
        console.error("Error during adding key:", error);
        throw error;
    }
    redirect(`/projects/${slug}`);
}
