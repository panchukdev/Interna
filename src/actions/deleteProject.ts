"use server";

import { redirect } from "next/navigation";
import { db } from "../prisma/db";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

export async function deleteProject(projectSlug: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const project = await db.orm.public.Project.where({
        slug: projectSlug,
        authorId: session.user.id,
    }).first();

    if (!project) {
        return { error: "notFound" as const };
    }

    try {
        await db.transaction(async (tx) => {
            const keys = await tx.orm.public.Key.where({
                projectId: project.id,
            }).all();

            for (const key of keys) {
                await tx.orm.public.Translation.where({
                    keyId: key.id,
                }).deleteAll();
            }

            await tx.orm.public.Key.where({
                projectId: project.id,
            }).deleteAll();

            await tx.orm.public.Project.where({
                id: project.id,
                authorId: session.user.id,
            }).delete();
        });

        return { success: true as const };
    } catch (error) {
        console.error("Failed to delete project:", error);
        return { error: "generic" as const };
    }
}
