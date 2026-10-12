#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/3870d204b8403b30b6cf4d03b39fb031c312d9204524bed4def10d1c58e432f8/contract';
import startContract from '../../snapshots/3870d204b8403b30b6cf4d03b39fb031c312d9204524bed4def10d1c58e432f8/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ea8bfea0733e59968a9ffa07ce5060ee3a8ef8bbf6bbf9f747bef104667969d0/contract';
import endContract from '../../snapshots/ea8bfea0733e59968a9ffa07ce5060ee3a8ef8bbf6bbf9f747bef104667969d0/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Project',
        column: col('websiteUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Project',
        column: col('slug', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-Project-slug', {
        check: () => placeholder('backfill-Project-slug:check'),
        run: () => placeholder('backfill-Project-slug:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'Project', column: 'slug' }),
      this.dropNotNull({ schema: 'public', table: 'Project', column: 'authorId' }),
      this.addUnique({
        schema: 'public',
        table: 'Project',
        constraint: 'Project_slug_key',
        columns: ['slug'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
