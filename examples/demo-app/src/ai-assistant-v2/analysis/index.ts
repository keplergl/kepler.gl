// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Demo-app integration of the kepler-assistant analysis engine.
 *
 * The `AnalysisEngine` (owned by kepler-assistant) is backed here by the app's
 * existing duckdb-wasm connector via `getConnector()` (tools/utils), which
 * shares the single DuckDB instance the rest of the assistant uses. This is the
 * same engine the kepler-assistant MCP service exposes, so the demo-app and the
 * service run the identical analysis component.
 */

import {getConnector} from '../tools/utils';
// Import the browser-safe engine subpath (not the full index, which pulls the
// Node MCP server + hub). AnalysisEngine + ToolResult are exported here.
import {AnalysisEngine, type ToolResult} from 'kepler-assistant/engine';

let engine: AnalysisEngine | null = null;

/** Lazily build the analysis engine against the shared duckdb-wasm connector. */
export async function getAnalysisEngine(): Promise<AnalysisEngine> {
  if (!engine) {
    const connector = await getConnector();
    engine = new AnalysisEngine(connector);
  }
  return engine;
}

/** Run a `data.*` / `chart.*` / `geoda.*` / `geo.*` analysis command. */
export async function runAnalysis(tool: string, input: unknown): Promise<ToolResult> {
  const e = await getAnalysisEngine();
  return e.invoke(tool, input);
}

/** Run an arbitrary SQL query through the engine (returns the JSON result). */
export async function runSql(sql: string, limit = 50): Promise<ToolResult> {
  return runAnalysis('data.query', {sql, limit});
}
