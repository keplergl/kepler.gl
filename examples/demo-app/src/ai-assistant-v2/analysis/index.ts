// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Demo-app integration of the kepler-mcp analysis engine.
 *
 * The `AnalysisEngine` (ported from the kepler-mcp service) is backed here by
 * the app's existing duckdb-wasm connector via `getConnector()` (tools/utils),
 * which shares the single DuckDB instance the rest of the assistant uses. This
 * proves the same analysis component is buildable for the demo-app.
 */

import {getConnector} from '../tools/utils';
import {AnalysisEngine} from './analysis-commands';
import type {AnalysisResult} from './types';

let engine: AnalysisEngine | null = null;

/** Lazily build the analysis engine against the shared duckdb-wasm connector. */
export async function getAnalysisEngine(): Promise<AnalysisEngine> {
  if (!engine) {
    const connector = await getConnector();
    engine = new AnalysisEngine(connector);
  }
  return engine;
}

/** Run a `data.*` / `chart.*` analysis command through the engine. */
export async function runAnalysis(tool: string, input: unknown): Promise<AnalysisResult> {
  const e = await getAnalysisEngine();
  return e.invoke(tool, input);
}

/** Run an arbitrary SQL query through the engine (returns the JSON result). */
export async function runSql(sql: string, limit = 50): Promise<AnalysisResult> {
  return runAnalysis('data.query', {sql, limit});
}
