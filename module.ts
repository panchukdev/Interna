import { module } from "@prisma/composer";
import { postgres } from "@prisma/composer-prisma-cloud/orm";

import { appContract } from "@/src/prisma/composer";
import app from "./service";

export default module("interna", ({ provision }) => {
    const database = provision(
        postgres({
            name: "database",
            contract: appContract,
            config: "./prisma.config.ts",
        }),
        { id: "database" },
    );

    provision(app, { deps: { database } });
});
