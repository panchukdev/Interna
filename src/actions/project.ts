"use server";

import { redirect } from "next/navigation";
import { db } from "../prisma/db";

export async function createProject(formData: FormData) {
    // await new Promise((resolve) => setTimeout(resolve, 5000));

    const projectName = formData.get("projectName");
    const websiteURL = formData.get("websiteURL");
    const sourceLanguage = formData.get("sourceLanguage");
    const targetLanguages = formData.getAll("targetLanguages");
    const initialContent = formData.get("initialContent") === "true";

    // validation

    if (
        typeof projectName !== "string" ||
        !projectName.trim() ||
        typeof sourceLanguage !== "string" ||
        !sourceLanguage.trim() ||
        targetLanguages.length === 0 ||
        !targetLanguages.every(
            (language) =>
                typeof language === "string" && language.trim().length > 0,
        )
    ) {
        throw new Error("Invalid project data.");
    }

    const slug = projectName.trim().replace(/\s+/g, "-").toLowerCase();

    const websiteURLValue =
        typeof websiteURL === "string" ? websiteURL.trim() : "";

    const websiteUrl = websiteURLValue || null;

    if (websiteUrl) {
        try {
            const url = new URL(websiteUrl);

            if (url.protocol !== "http:" && url.protocol !== "https:") {
                throw new Error();
            }
        } catch {
            throw new Error("Invalid website URL.");
        }
    }

    // create the project in DB (Prisma)

    const result = await db.transaction(async (tx) => {
        const project = await tx.orm.public.Project.create({
            title: projectName,
            slug,
            websiteUrl,
            sourceLanguage,
            targetLanguages: targetLanguages as string[],
        });
        return project;
    });

    console.log(result);

    // redirect
    if (initialContent) {
        redirect(`/projects/${slug}/import`);
    }

    redirect(`/projects/${slug}`);
}
