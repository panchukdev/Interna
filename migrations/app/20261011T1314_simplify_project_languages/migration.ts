#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1311288edeb4a7c91f05efdf65c5954472711a61d13929913d9d11dc2ee3ca0c/contract';
import endContract from '../../snapshots/1311288edeb4a7c91f05efdf65c5954472711a61d13929913d9d11dc2ee3ca0c/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ea8bfea0733e59968a9ffa07ce5060ee3a8ef8bbf6bbf9f747bef104667969d0/contract';
import startContract from '../../snapshots/ea8bfea0733e59968a9ffa07ce5060ee3a8ef8bbf6bbf9f747bef104667969d0/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropConstraint({
        schema: 'public',
        table: 'Project',
        constraint: 'Project_sourceLanguageId_fkey',
        kind: 'foreignKey',
      }),
      this.dropIndex({
        schema: 'public',
        table: 'Project',
        index: 'Project_sourceLanguageId_idx_7e7e5b07',
      }),
      this.dropColumn({ schema: 'public', table: 'Project', column: 'sourceLanguageId' }),
      this.dropConstraint({
        schema: 'public',
        table: 'Translation',
        constraint: 'Translation_languageId_fkey',
        kind: 'foreignKey',
      }),
      this.dropTable({ schema: 'public', table: 'Language' }),
      this.dropIndex({
        schema: 'public',
        table: 'Translation',
        index: 'Translation_languageId_idx_7aa66047',
      }),
      this.dropConstraint({
        schema: 'public',
        table: 'Translation',
        constraint: 'Translation_keyId_languageId_key',
      }),
      this.dropColumn({ schema: 'public', table: 'Translation', column: 'languageId' }),
      this.addColumn({
        schema: 'public',
        table: 'Project',
        column: col('sourceLanguage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-Project-sourceLanguage', {
        check: () => placeholder('backfill-Project-sourceLanguage:check'),
        run: () => placeholder('backfill-Project-sourceLanguage:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'Project', column: 'sourceLanguage' }),
      this.addColumn({
        schema: 'public',
        table: 'Project',
        column: col('targetLanguages', 'text[]', {
          codecRef: { codecId: 'pg/text@1', many: true },
        }),
      }),
      this.dataTransform(endContract, 'backfill-Project-targetLanguages', {
        check: () => placeholder('backfill-Project-targetLanguages:check'),
        run: () => placeholder('backfill-Project-targetLanguages:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'Project', column: 'targetLanguages' }),
      this.addColumn({
        schema: 'public',
        table: 'Translation',
        column: col('language', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-Translation-language', {
        check: () => placeholder('backfill-Translation-language:check'),
        run: () => placeholder('backfill-Translation-language:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'Translation', column: 'language' }),
      this.setDefault({
        schema: 'public',
        table: 'Translation',
        column: col('status', 'text', {
          default: lit('Pending'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'Project',
        constraint: 'Project_targetLanguages_elem_not_null_10f915a7',
        expression: 'array_position("targetLanguages", NULL) IS NULL',
      }),
      this.addUnique({
        schema: 'public',
        table: 'Translation',
        constraint: 'Translation_keyId_language_key',
        columns: ['keyId', 'language'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
