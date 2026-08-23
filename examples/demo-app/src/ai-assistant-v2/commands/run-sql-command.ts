// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * `data.run-sql` — run an arbitrary SQL SELECT through the kepler-mcp analysis
 * engine, backed by the app's shared duckdb-wasm connector. Demonstrates the
 * analysis engine is buildable in the demo-app.
 */

import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {runAnalysis} from '../analysis';

export const runSqlCommandId = 'data.run-sql' as const;

export function getRunSqlCommand(): RoomCommand {
  return {
    id: runSqlCommandId,
    name: 'Run SQL (analysis engine)',
    group: 'Data',
    description:
      'Run an arbitrary SQL SELECT query through the shared DuckDB connector and return the result rows.',
    metadata: {readOnly: false, riskLevel: 'medium', idempotent: false},
    inputSchema: z.object({
      sql: z.string().describe('The SQL SELECT query to run against DuckDB.'),
      limit: z.number().optional().describe('Max rows to return (default 50).')
    }) as any,
    execute: async (_execCtx, input) => {
      const {sql, limit} = (input ?? {}) as {sql?: string; limit?: number};
      if (!sql) {
        return {success: false, commandId: runSqlCommandId, error: 'data.run-sql requires sql'};
      }
      const result = await runAnalysis('data.query', {sql, limit});
      return {
        success: result.success,
        commandId: runSqlCommandId,
        data: result.data,
        error: result.error
      };
    }
  };
}
