import postgres from "@prisma/orm-postgres/runtime";

import "temporal-polyfill/global";

import service from "@/service.ts";
import type { Contract } from "./contract.d.ts";
import contractJson from "./contract.json" with { type: "json" };

function loadComposerDatabase() {
    try {
        return service.load().database.client;
    } catch {
        return undefined;
    }
}

export const db =
    loadComposerDatabase() ??
    (process.env.DATABASE_URL
        ? postgres<Contract>({
              contract: contractJson as unknown as Contract,
              url: process.env.DATABASE_URL,
          })
        : postgres<Contract>({
              contract: contractJson as unknown as Contract,
          }));

let connection: Promise<void> | undefined;

export function connectDatabase(): Promise<void> {
    connection ??= db
        .connect()
        .then(() => undefined)
        .catch((error: unknown) => {
            connection = undefined;
            throw error;
        });

    return connection;
}
