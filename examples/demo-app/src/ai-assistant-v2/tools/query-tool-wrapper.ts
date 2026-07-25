/**
 * Wrapped `query` tool for the main orchestrator agent.
 *
 * The stock `@sqlrooms/ai` `createQueryTool` is configured in store.ts with
 * `{query: {}}`, which means `numberOfRowsToShareWithLLM` defaults to 0 — so
 * SELECT results (including `SHOW TABLES` / `DESCRIBE`) execute successfully
 * but the model sees `{"success":true,"data":{"summary":null}}` and zero rows.
 * That made the orchestrator hallucinate table names from its system prompt.
 *
 * This wrapper keeps the same tool name (`query`) and input schema
 * (`{type:'query', sqlQuery, reasoning}`) so the model calls it exactly as
 * before, but:
 *  1. Runs against the kepler tools' DuckDB connector (the same instance skills
 *     use — see utils.ts `getConnector`), so kepler datasets materialized by
 *     skills are visible here too.
 *  2. Formats the first N rows as a pipe-delimited preview capped at ~1000
 *     chars (via `formatResultsForLLM`) and surfaces it back to the model in
 *     `toModelOutput`, so `SHOW TABLES` / `DESCRIBE` / SELECTs actually return
 *     rows to the LLM.
 *
 * This is the main-agent-facing tool. Skill sub-agents continue to use the
 * `executeApi` command surface (`data.query`, etc.) which has its own
 * formatting in query-tool.ts.
 */
import {tool} from './ai-tool-shim';
import {z} from 'zod';
import {
  getConnector,
  formatResultsForLLM,
  ensureKeplerDatasetsMaterialized,
  NUMBER_OF_ROWS_RETURN_TO_LLM,
  LLM_PREVIEW_MAX_TOTAL_LENGTH
} from './utils';

export const QueryToolParameters = z.object({
  type: z.literal('query'),
  sqlQuery: z.string(),
  reasoning: z.string()
});

/**
 * Resolve the kepler visState lazily without creating a circular import at
 * module-load time. `getKeplerVisState` is exported from store.ts, which
 * imports this module's `createWrappedQueryTool`, so we require it lazily.
 */
async function getVisState(): Promise<any> {
  const {getKeplerVisState} = await import('../store');
  return getKeplerVisState();
}

export function createWrappedQueryTool() {
  return tool({
    description: `A tool for running SQL queries on the tables in the database.
                  Please only run one query at a time.
                  If a query fails, please don't try to run it again with the same syntax.
                  The first ${NUMBER_OF_ROWS_RETURN_TO_LLM} rows of the result are returned to you as a preview (truncated to ~${LLM_PREVIEW_MAX_TOTAL_LENGTH} chars).`,
    inputSchema: QueryToolParameters,
    execute: async (params, options) => {
      const {sqlQuery} = params;
      const abortSignal = options?.abortSignal;
      try {
        // Materialize all currently-loaded kepler datasets into DuckDB before
        // running the query, so SHOW TABLES / DESCRIBE / SELECT against
        // tbl_<dataset> tables succeed even before any skill has run.
        const visState = await getVisState();
        if (visState?.datasets) {
          await ensureKeplerDatasetsMaterialized(visState.datasets, visState.layers ?? []);
        }

        const connector = await getConnector();
        const result = await connector.query(sqlQuery, {signal: abortSignal});

        const numRows = result?.numRows ?? 0;
        const preview =
          numRows > 0
            ? formatResultsForLLM(result, NUMBER_OF_ROWS_RETURN_TO_LLM)
            : 'No rows returned';

        return {
          success: true as const,
          data: {
            type: 'query',
            numRows,
            preview
          },
          title: 'Query Result',
          sqlQuery
        };
      } catch (error) {
        return {
          success: false as const,
          details: 'Query execution failed.',
          error: error instanceof Error ? error.message : 'Unknown error',
          title: 'Query Result',
          sqlQuery: params.sqlQuery
        };
      }
    },
    toModelOutput: ({output}: any) => ({
      type: 'text' as const,
      value: JSON.stringify({
        success: output.success,
        data: output.data,
        ...(output.details ? {details: output.details} : {}),
        ...(output.error ? {error: output.error} : {})
      })
    })
  });
}