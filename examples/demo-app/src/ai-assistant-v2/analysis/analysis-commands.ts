// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Analysis engine, ported from the kepler-mcp service so the same component is
 * buildable in the demo-app. Runs real SQL through a `@sqlrooms/duckdb-core`
 * `DuckDbConnector` (here: the app's duckdb-wasm connector via `getConnector`).
 */

import type {DuckDbConnector} from '@sqlrooms/duckdb-core';
import {DuckDbEngine} from './duckdb-engine';
import type {AnalysisResult} from './types';

export const ANALYSIS_TOOL_IDS = [
  'data.create-table',
  'data.query',
  'data.filter',
  'data.merge-tables',
  'data.load-to-map',
  'chart.histogram'
];

export class AnalysisEngine {
  private readonly db: DuckDbEngine;

  constructor(connector: DuckDbConnector) {
    this.db = new DuckDbEngine(connector);
  }

  /** Run a `data.*` / `chart.*` analysis command over the connector. */
  async invoke(tool: string, input: unknown): Promise<AnalysisResult> {
    const args = (input ?? {}) as Record<string, any>;
    try {
      switch (tool) {
        case 'data.create-table':
          return await this.createTable(args);
        case 'data.query':
          return await this.query(args);
        case 'data.filter':
          return await this.filter(args);
        case 'data.merge-tables':
          return await this.merge(args);
        case 'data.load-to-map':
          return await this.loadToMap(args);
        case 'chart.histogram':
          return await this.histogram(args);
        default:
          return {success: false, error: `No analysis handler for "${tool}"`};
      }
    } catch (error) {
      return {success: false, error: error instanceof Error ? error.message : String(error)};
    }
  }

  private async createTable(args: Record<string, any>): Promise<AnalysisResult> {
    const {name, rows, sql} = args;
    if (!name) return {success: false, error: 'data.create-table requires name'};
    if (sql) {
      await this.db.exec(`CREATE OR REPLACE TABLE ${name} AS ${sql}`);
    } else if (Array.isArray(rows)) {
      await this.db.createTableFromRows(name, rows);
    } else {
      return {success: false, error: 'data.create-table requires sql or rows'};
    }
    return {success: true, data: {tableName: name, details: `Created table "${name}"`}};
  }

  private async query(args: Record<string, any>): Promise<AnalysisResult> {
    const {sql} = args;
    if (!sql) return {success: false, error: 'data.query requires sql'};
    const result = await this.db.query(sql, args.limit ?? 50);
    return {
      success: true,
      data: {
        columns: result.columns,
        truncatedQueryResult: JSON.stringify(result.rows.slice(0, 5)),
        totalRows: result.totalRows,
        firstFiveRows: result.rows.slice(0, 5)
      }
    };
  }

  private async filter(args: Record<string, any>): Promise<AnalysisResult> {
    const {source, resultName, condition} = args;
    if (!source || !resultName || !condition?.column) {
      return {success: false, error: 'data.filter requires {source, resultName, condition}'};
    }
    const where = buildCondition(condition);
    await this.db.exec(`CREATE TABLE ${resultName} AS SELECT * FROM ${source} WHERE ${where}`);
    return {success: true, data: {resultName, details: `Filtered ${source} into ${resultName}`}};
  }

  private async merge(args: Record<string, any>): Promise<AnalysisResult> {
    const {left, right, on, how, resultName} = args;
    if (!left || !right || !on || !resultName) {
      return {success: false, error: 'data.merge-tables requires {left, right, on, resultName}'};
    }
    const kind = how === 'left' ? 'LEFT JOIN' : 'INNER JOIN';
    await this.db.exec(
      `CREATE TABLE ${resultName} AS SELECT * FROM ${left} ${kind} ${right} ON ${left}.${on} = ${right}.${on}`
    );
    return {success: true, data: {resultName, details: `Merged ${left} + ${right} into ${resultName}`}};
  }

  private async loadToMap(args: Record<string, any>): Promise<AnalysisResult> {
    const result = await this.db.query(`SELECT * FROM ${args.table}`, 5);
    return {success: true, data: {table: args.table, columns: result.columns, previewRows: result.rows}};
  }

  private async histogram(args: Record<string, any>): Promise<AnalysisResult> {
    const {table, column, bins = 7} = args;
    const result = await this.db.query(
      `SELECT ${column} AS _v FROM ${table} WHERE ${column} IS NOT NULL`
    );
    const values = result.rows.map(r => Number(r._v)).filter(v => Number.isFinite(v));
    const hist = buildHistogram(values, bins);
    return {
      success: true,
      data: {
        table,
        column,
        totalValues: values.length,
        details: `Histogram for ${column}: ${bins} bins.`
      }
    };
  }
}

function buildCondition(c: {column: string; op: string; value?: unknown}): string {
  const col = `"${c.column}"`;
  switch (c.op) {
    case 'eq': return `${col} = ${sqlVal(c.value)}`;
    case 'neq': return `${col} != ${sqlVal(c.value)}`;
    case 'gt': return `${col} > ${sqlVal(c.value)}`;
    case 'gte': return `${col} >= ${sqlVal(c.value)}`;
    case 'lt': return `${col} < ${sqlVal(c.value)}`;
    case 'lte': return `${col} <= ${sqlVal(c.value)}`;
    case 'contains': return `${col} ILIKE '%${String(c.value).replace(/'/g, "''")}%'`;
    default: return 'TRUE';
  }
}

function sqlVal(v: unknown): string {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
}

function buildHistogram(values: number[], bins: number): {binStart: number; binEnd: number; count: number}[] {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const w = (max - min) / bins || 1;
  const out = new Array(bins).fill(0).map((_, i) => ({
    binStart: min + i * w,
    binEnd: min + (i + 1) * w,
    count: 0
  }));
  for (const v of values) out[Math.min(Math.floor((v - min) / w), bins - 1)].count++;
  return out;
}
