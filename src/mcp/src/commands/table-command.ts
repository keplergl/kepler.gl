import type {RoomCommand} from './types';
import {z} from 'zod';
import {tableFromArrays, Table as ArrowTable} from 'apache-arrow';
import {addDataToMap} from '@kepler.gl/actions';
import {processFileData} from '@kepler.gl/processors';
import type {KeplerContext} from './types';
import {datasetNameToTableName, arrowTableToObjects} from './utils';
import {isObjectColumn, stringifyObjectColumn, restoreObjectColumns} from './utils';

export const tableCommandId = 'map.create-table' as const;

export function getTableCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: tableCommandId,
    name: 'Create map dataset via SQL',
    group: 'Map',
    description: `Create a NEW dataset in kepler.gl from a SQL query. The result becomes a SEPARATE new dataset (resultDatasetName); the ORIGINAL dataset and its layers/filters are left untouched. Use it to build a new table with different columns — e.g. add, delete, or rename columns, or change a column's type (CAST(col AS <type>)) — inside the new dataset.
NOTE: To modify an EXISTING dataset in place, do NOT use this command — use map.add-column instead (add a column that copies an existing one to "rename", or casts it via expression to change its type). Only reach for map.create-table when the user wants a NEW, separate dataset.
Please note:
1. Do not use * to select all columns, instead use all the column names in dataset.
2. List all column names the new table or dataset will have.
IMPORTANT: Use __TABLE__ as the table name placeholder in SQL. It will be replaced with the actual DuckDB table name at runtime.`,
    metadata: {readOnly: false, riskLevel: 'high', idempotent: false},
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the source dataset'),
      variableNames: z
        .array(z.string())
        .describe('Only use variable names that already exist in the dataset.'),
      sql: z
        .string()
        .describe('The SQL query to execute. Use __TABLE__ as the table name placeholder.'),
      resultDatasetName: z.string().describe('The name for the new dataset')
    }) as any,
    execute: async (_execCtx, input) => {
      const {datasetName, variableNames, sql, resultDatasetName} = (input ?? {}) as {
        datasetName: string;
        variableNames: string[];
        sql: string;
        resultDatasetName: string;
      };
      try {
        const dbTableName = datasetNameToTableName(datasetName);
        const resolvedSql = sql.replace(/__TABLE__/g, `"${dbTableName}"`);
        const columnData: Record<string, unknown[]> = {};
        // Object-valued columns (the `_geojson` Feature objects) must not be
        // round-tripped through Arrow raw: `tableFromArrays` infers ONE Arrow
        // type per column from the first value, so a dataset mixing Polygon and
        // MultiPolygon features gets the shallower (Polygon) coordinate nesting
        // and the MultiPolygon coordinates come back as nulls. Stringify them
        // for the DuckDB round-trip and restore the objects afterwards.
        const objectColumns: string[] = [];
        for (const varName of variableNames) {
          const values = ctx.getValuesFromDataset(datasetName, varName);
          if (isObjectColumn(values)) objectColumns.push(varName);
          columnData[varName] = stringifyObjectColumn(values);
        }

        const arrowTable: ArrowTable = tableFromArrays(columnData);
        const db = await ctx.getConnector();

        await db.execute(`DROP TABLE IF EXISTS "${dbTableName}"`);
        await db.loadArrow(arrowTable, dbTableName);

        const arrowResult = await db.query(resolvedSql);

        const jsonResult: Record<string, unknown>[] = arrowTableToObjects(arrowResult);
        restoreObjectColumns(jsonResult, objectColumns);

        const parsedData = await processFileData({
          content: {data: jsonResult, fileName: resultDatasetName},
          fileCache: []
        });

        ctx.dispatch(
          addDataToMap({
            datasets: parsedData,
            // No auto-create — the assistant creates the layer explicitly via
            // `map.add-layer` to avoid duplicate default layers.
            options: {autoCreateLayers: false, centerMap: true}
          })
        );

        // Trimmed, model-facing subset (ported from the old `toModelOutput`).
        const firstFiveRows = jsonResult.slice(0, 5);
        return {
          success: true,
          commandId: tableCommandId,
          data: {
            details: `Table created as ${resultDatasetName} (${jsonResult.length} rows) and added to kepler.gl.`,
            resultDatasetName,
            firstFiveRows
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: tableCommandId,
          error: error instanceof Error ? error.message : String(error),
          data: {
            instruction:
              'Please explain the error and give a plan to fix it. Then try again with a different query.'
          }
        };
      }
    }
  };
}
