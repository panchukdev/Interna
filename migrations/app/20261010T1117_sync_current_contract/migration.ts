#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3870d204b8403b30b6cf4d03b39fb031c312d9204524bed4def10d1c58e432f8/contract';
import endContract from '../../snapshots/3870d204b8403b30b6cf4d03b39fb031c312d9204524bed4def10d1c58e432f8/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/797cfed44e9c40efbc00a689b87c92c44cd4b60e1ae3d6ffbc0304d8f348aaf5/contract';
import startContract from '../../snapshots/797cfed44e9c40efbc00a689b87c92c44cd4b60e1ae3d6ffbc0304d8f348aaf5/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  placeholder,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Post' }),
      this.dropColumn({ schema: 'public', table: 'User', column: 'username' }),
      this.createTable({
        schema: 'public',
        table: 'Key',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('projectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sourceText', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Language',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('projectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Project',
        columns: [
          col('authorId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('sourceLanguageId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Translation',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('keyId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('languageId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('text', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Translation_status_check_9beca31d',
            `"status" IN ('Pending', 'Translated', 'Review', 'Approved')`,
          ),
        ],
      }),
      this.dataTransform(endContract, 'handle-nulls-User-name', {
        check: () => placeholder('handle-nulls-User-name:check'),
        run: () => placeholder('handle-nulls-User-name:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'User', column: 'name' }),
      this.addUnique({
        schema: 'public',
        table: 'Key',
        constraint: 'Key_projectId_key_key',
        columns: ['projectId', 'key'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Language',
        constraint: 'Language_projectId_code_key',
        columns: ['projectId', 'code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Translation',
        constraint: 'Translation_keyId_languageId_key',
        columns: ['keyId', 'languageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Key',
        index: 'Key_projectId_idx_a96e4d92',
        columns: ['projectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Language',
        index: 'Language_projectId_idx_a96e4d92',
        columns: ['projectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Project',
        index: 'Project_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Project',
        index: 'Project_sourceLanguageId_idx_7e7e5b07',
        columns: ['sourceLanguageId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Translation',
        index: 'Translation_keyId_idx_c75a7d57',
        columns: ['keyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Translation',
        index: 'Translation_languageId_idx_7aa66047',
        columns: ['languageId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Key',
        foreignKey: {
          name: 'Key_projectId_fkey',
          columns: ['projectId'],
          references: { schema: 'public', table: 'Project', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Language',
        foreignKey: {
          name: 'Language_projectId_fkey',
          columns: ['projectId'],
          references: { schema: 'public', table: 'Project', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Project',
        foreignKey: {
          name: 'Project_authorId_fkey',
          columns: ['authorId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Project',
        foreignKey: {
          name: 'Project_sourceLanguageId_fkey',
          columns: ['sourceLanguageId'],
          references: { schema: 'public', table: 'Language', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Translation',
        foreignKey: {
          name: 'Translation_keyId_fkey',
          columns: ['keyId'],
          references: { schema: 'public', table: 'Key', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Translation',
        foreignKey: {
          name: 'Translation_languageId_fkey',
          columns: ['languageId'],
          references: { schema: 'public', table: 'Language', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
