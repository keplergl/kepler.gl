// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * DuckDB-backed data engine, ported from the kepler-mcp service so the same
 * analysis component is buildable in the demo-app. Built on the
 * `@sqlrooms/duckdb-core` `DuckDbConnector` interface, so it is portable across
 * duckdb-wasm (this app), native DuckDB, or MotherDuck.
 */

import type {DuckDbConnector} from '@sqlrooms/duckdb-core';
import type {Table} from 'apache-arrow';

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  totalRows: number;
}

export class DuckDbEngine {
  constructor(private readonly connector: DuckDbConnector) {}

  /** Run a SELECT and return the rows as JSON (capped for the model). */
  async query(sql: string, limit = 50): Promise<QueryResult> {
    const table = (await this.connector.query(
      `SELECT * FROM (${stripTrailingSemicolon(sql)}) AS _kepler_q LIMIT ${limit}`
    )) as Table;
    const rows = tableToJson(table);
    return {
      columns: table.schema.fields.map(f => f.name),
      rows,
      totalRows: rows.length
    };
  }

  /** Run an arbitrary statement (CREATE/INSERT/DROP). */
  async exec(sql: string): Promise<void> {
    await this.connector.query(sql);
  }

  /** Create a table from an inline `VALUES` list derived from rows. */
  async createTableFromRows(name: string, rows: Record<string, unknown>[]): Promise<void> {
    if (!rows.length) {
      await this.connector.query(`CREATE TABLE ${name} (__empty BOOLEAN)`);
      return;
    }
    const cols = Object.keys(rows[0]);
    const colsSql = cols.map(c => `"${c}"`).join(', ');
    const values = rows
      .map(r => `(${cols.map(c => sqlLiteral(r[c])).join(', ')})`)
      .join(', ');
    await this.connector.query(
      `CREATE TABLE ${name} AS SELECT ${cols.map(c => `_v."${c}"`).join(', ')} FROM (VALUES ${values}) AS _v(${colsSql})`
    );
  }
}

function stripTrailingSemicolon(sql: string): string {
  return sql.trim().replace(/;+\s*$/, '');
}

function sqlLiteral(v: unknown): string {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function tableToJson(table: Table): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  for (let i = 0; i < table.numRows; i++) {
    const obj: Record<string, unknown> = {};
    for (const field of table.schema.fields) {
      obj[field.name] = table.getChild(field.name)?.get(i);
    }
    out.push(obj);
  }
  return out;
}
