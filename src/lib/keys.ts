import "server-only";
import { db } from "../prisma/db";

export async function getKeys(projectId: number) {
    return db.orm.public.Key.where({ projectId }).all();
}

export async function getKey(id: number, projectId: number) {
    return db.orm.public.Key.where({ id, projectId }).first();
}
