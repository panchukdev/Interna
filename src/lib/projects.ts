import "server-only";
import { db } from "../prisma/db";

export async function getProject(slug: string) {
    return db.orm.public.Project.where({ slug }).first();
}

export async function getProjects() {
    return db.orm.public.Project.all();
}
