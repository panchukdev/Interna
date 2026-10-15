import "server-only";
import { db } from "../prisma/db";

export async function getProject(slug: string, authorId: string) {
    return db.orm.public.Project.where({ slug, authorId }).first();
}

export async function getProjects(authorId: string) {
    return db.orm.public.Project.where({ authorId }).all();
}
