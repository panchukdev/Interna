#!/usr/bin/env -S node
import type { Contract as End } from "../../snapshots/2192d30451ea76faff5c90e850ebd4e6fbe9529b51a72e1e58639ad80050a4f6/contract";
import endContract from "../../snapshots/2192d30451ea76faff5c90e850ebd4e6fbe9529b51a72e1e58639ad80050a4f6/contract.json" with { type: "json" };
import type { Contract as Start } from "../../snapshots/ad1beeb24bb7a355a29215a0b6310a5b51ac871eb39a69ec06ee2c602e7bb60c/contract";
import startContract from "../../snapshots/ad1beeb24bb7a355a29215a0b6310a5b51ac871eb39a69ec06ee2c602e7bb60c/contract.json" with { type: "json" };
import { Migration, MigrationCLI } from "@prisma/orm-postgres/migration";

export default class M extends Migration<Start, End> {
    override readonly startContractJson = startContract;
    override readonly endContractJson = endContract;

    override get operations() {
        return [
            this.dropConstraint({
                schema: "public",
                table: "Project",
                constraint: "Project_authorId_fkey",
                kind: "foreignKey",
            }),
            this.dropIndex({
                schema: "public",
                table: "Project",
                index: "Project_authorId_idx_e47547ed",
            }),
            this.dropTable({ schema: "public", table: "User" }),
            this.alterColumnType({
                schema: "public",
                table: "Project",
                column: "authorId",
                options: {
                    qualifiedTargetType: "text",
                    formatTypeExpected: "text",
                    rawTargetTypeForLabel: "text",
                },
            }),
        ];
    }
}

MigrationCLI.run(import.meta.url, M);
