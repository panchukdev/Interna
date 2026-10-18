"use server";

import { redirect } from "next/navigation";
import { db } from "../prisma/db";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

export async function deleteKey(keyId: number, slug: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const project = await db.orm.public.Project.where({
        slug,
        authorId: session.user.id,
    }).first();

    if (!project) {
        redirect("/projects");
    }

    const key = await db.orm.public.Key.where({
        id: keyId,
        projectId: project.id,
    }).first();

    if (!key) {
        return { error: "notFound" as const };
    }

    try {
        await db.transaction(async (tx) => {
            await tx.orm.public.Translation.where({
                keyId: key.id,
            }).deleteAll();

            await tx.orm.public.Key.where({
                id: key.id,
                projectId: project.id,
            }).delete();
        });

        return { success: true as const };
    } catch (error) {
        console.error("Failed to delete key:", error);

        return { error: "generic" as const };
    }
}
