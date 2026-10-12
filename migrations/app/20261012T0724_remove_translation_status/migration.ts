#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/1311288edeb4a7c91f05efdf65c5954472711a61d13929913d9d11dc2ee3ca0c/contract';
import startContract from '../../snapshots/1311288edeb4a7c91f05efdf65c5954472711a61d13929913d9d11dc2ee3ca0c/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ad1beeb24bb7a355a29215a0b6310a5b51ac871eb39a69ec06ee2c602e7bb60c/contract';
import endContract from '../../snapshots/ad1beeb24bb7a355a29215a0b6310a5b51ac871eb39a69ec06ee2c602e7bb60c/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'Translation',
        constraint: 'Translation_status_check_9beca31d',
      }),
      this.dropColumn({ schema: 'public', table: 'Translation', column: 'status' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
