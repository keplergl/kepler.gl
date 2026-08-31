import type {RoomCommand} from './types';
import {z} from 'zod';
import {updateDataset} from '@kepler.gl/actions';
import type {KeplerContext} from './types';
import {buildAddColumnPayload} from './utils';
import {datasetNameToTableName, tableToLLMResult} from './utils';

export const addColumnCommandId = 'map.add-column' as const;

export function getAddColumnCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: addColumnCommandId,
    name: 'Add a column to an existing map dataset',
    group: 'Map',
    description: `Add a NEW column to an existing kepler.gl dataset (table), in place. The dataset keeps its name, id, color and layers; existing columns are untouched, so layers, filters and tooltips keep working unchanged.
The new column's values come from exactly ONE of two sources:
- copyFromColumn — copy the values of an existing column. This is how you "rename" a column in place: to rename "fare" to "fare_amount", add a new column "fare_amount" that copies "fare" (the original "fare" column stays — this command never removes columns).
- expression — an SQL expression computed in DuckDB against the dataset's rows, e.g. a z-score: "(HR60 - AVG(HR60) OVER()) / STDDEV(HR60) OVER()" adds HR60_Z holding the standardized value of HR60. The expression may reference existing columns and window functions; it must produce exactly one value per row.
CHANGING A COLUMN'S TYPE: use expression to add a NEW column that casts the original, e.g. to turn "NOSOUTH" (numeric) into a string, add a new column with expression "NOSOUTH::VARCHAR" (or "CAST(NOSOUTH AS VARCHAR)"). The values become strings; the original column stays. Name the new column clearly (e.g. "NOSOUTH_str") or as the user requests.
IMPORTANT: this command only ADDS columns. It cannot delete or rename-in-place an existing column, and it never changes the type OF an existing column in place — a type change is achieved by adding a NEW column holding the cast values. If you need to remove columns or rebuild the whole table, use map.create-table (which creates a NEW dataset; the original is untouched).`,
    metadata: {readOnly: false, riskLevel: 'medium', idempotent: false},
    inputSchema: z
      .object({
        datasetName: z
          .string()
          .describe('The name (label) or id of the dataset to add the column to'),
        newColumnName: z
          .string()
          .describe('The name of the new column to add. Must not already exist in the dataset.'),
        copyFromColumn: z
          .string()
          .optional()
          .describe(
            'The name of an EXISTING column whose values the new column will copy. Mutually exclusive with `expression` — provide exactly one.'
          ),
        expression: z
          .string()
          .optional()
          .describe(
            'An SQL expression computed in DuckDB against the dataset rows; the result becomes the new column. e.g. z-score: "(HR60 - AVG(HR60) OVER()) / STDDEV(HR60) OVER()". Mutually exclusive with `copyFromColumn` — provide exactly one.'
          )
      })
      .superRefine((data, ctx) => {
        const provided = [data.copyFromColumn, data.expression].filter(v => v != null).length;
        if (provided !== 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Provide exactly one of copyFromColumn or expression.'
          });
        }
      }) as any,
    execute: async (_execCtx, input) => {
      const {datasetName, newColumnName, copyFromColumn, expression} = (input ?? {}) as {
        datasetName: string;
        newColumnName: string;
        copyFromColumn?: string;
        expression?: string;
      };
      try {
        const visState = ctx.getVisState();
        const datasets = visState.datasets;
        const dataId = Object.keys(datasets).find(
          id => id === datasetName || datasets[id].label === datasetName
        );
        if (!dataId) {
          throw new Error(`Dataset "${datasetName}" not found.`);
        }
        const fieldNames = datasets[dataId].fields.map((f: any) => f.name);
        if (copyFromColumn != null && !fieldNames.includes(copyFromColumn)) {
          throw new Error(
            `Column "${copyFromColumn}" does not exist in dataset "${datasetName}". ` +
              `Existing columns: ${fieldNames.join(', ')}.`
          );
        }
        if (fieldNames.includes(newColumnName)) {
          throw new Error(
            `Column "${newColumnName}" already exists in dataset "${datasetName}". Choose a different name.`
          );
        }

        // Derive the DuckDB table name from the resolved dataset id, not the
        // user-provided label: different labels can sanitize to the same table
        // name (e.g. "A-B" vs "A B"), which would clobber another dataset's
        // temp table inside DuckDB and run the SQL against unintended data.
        const dbTableName = datasetNameToTableName(dataId);
        const db = await ctx.loadTableIntoDuckDB(dataId, fieldNames, dbTableName);

        // Add-only: compute ONLY the new column in DuckDB. Existing columns are
        // never round-tripped through DuckDB/Arrow — `tableFromArrays` infers a
        // single Arrow type for `_geojson`, and a dataset mixing Polygon and
        // MultiPolygon features gets the shallower type, so the MultiPolygon
        // coordinates come back as nulls and the geometry disappears.
        // `buildAddColumnPayload` rebuilds the payload from the original kepler
        // values instead, appending the new column from this single-column result.
        const appendedSql =
          copyFromColumn != null
            ? `"${copyFromColumn}" AS "${newColumnName}"`
            : `(${expression}) AS "${newColumnName}"`;
        const arrowResult = await db.query(`SELECT ${appendedSql} FROM "${dbTableName}"`);

        const {rows, fields} = buildAddColumnPayload(
          datasets,
          visState.layers,
          datasetName,
          newColumnName,
          arrowResult
        );
        ctx.dispatch(updateDataset(dataId, {rows, fields} as any));

        // LLM-facing preview: first 5 rows of the full (original + new) payload.
        const previewRows = rows
          .slice(0, 5)
          .map(r => Object.fromEntries(fields.map((f, i) => [f.name, r[i]])));
        const valueSource = copyFromColumn != null ? `copied from "${copyFromColumn}"` : `computed`;
        return {
          success: true,
          commandId: addColumnCommandId,
          data: {
            details: `Added column "${newColumnName}" to dataset "${datasetName}" (${valueSource}, ${rows.length} rows).`,
            addedColumns: [newColumnName],
            firstFiveRows: tableToLLMResult(previewRows)
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: addColumnCommandId,
          error: error instanceof Error ? error.message : String(error),
          data: {
            instruction: 'Please explain the error and give a plan to fix it. Then try again.'
          }
        };
      }
    }
  };
}
