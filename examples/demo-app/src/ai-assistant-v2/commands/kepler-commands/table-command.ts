import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {tableFromArrays, Table as ArrowTable} from 'apache-arrow';
import {addDataToMap} from '@kepler.gl/actions';
import {processFileData} from '@kepler.gl/processors';
import {KeplerContext} from '../../types';
import {getValuesFromDataset, getConnector, datasetNameToTableName} from '../../tools/utils';

function convertArrowRowToObject(row: any): Record<string, unknown> {
  if (row === null || typeof row !== 'object') return row;
  if (typeof row.toJSON === 'function') {
    const json = row.toJSON();
    for (const key in json) {
      const val = json[key];
      if (val && typeof val === 'object' && typeof val.toJSON === 'function') {
        json[key] = convertArrowRowToObject(val);
      } else if (Array.isArray(val)) {
        json[key] = val.map(v => convertArrowRowToObject(v));
      } else if (typeof val === 'bigint') {
        json[key] = val.toString();
      }
    }
    return json;
  }
  return row;
}

export const tableCommandId = 'map.create-table' as const;

export function getTableCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: tableCommandId,
    name: 'Create map dataset via SQL',
    group: 'Map',
    description: `Create a new table/dataset in kepler.gl using a SQL query which will:
1. Add a new column to the original dataset
2. Delete a column from the original dataset
3. Rename a column in the original dataset
4. Change the column type in the original dataset
Please note:
1. Do not use * to select all columns, instead use all the column names in dataset.
2. List all column names the new table or dataset will have.
IMPORTANT: Use __TABLE__ as the table name placeholder in SQL. It will be replaced with the actual DuckDB table name at runtime.`,
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
        const visState = ctx.getVisState();
        const columnData: Record<string, unknown[]> = {};
        for (const varName of variableNames) {
          columnData[varName] = getValuesFromDataset(
            visState.datasets,
            visState.layers,
            datasetName,
            varName
          );
        }

        const arrowTable: ArrowTable = tableFromArrays(columnData);
        const db = await getConnector();

        await db.execute(`DROP TABLE IF EXISTS "${dbTableName}"`);
        await db.loadArrow(arrowTable, dbTableName);

        const arrowResult = await db.query(resolvedSql);

        const jsonResult: Record<string, unknown>[] = arrowResult
          .toArray()
          .map((row: any) => convertArrowRowToObject(row));

        const parsedData = await processFileData({
          content: {data: jsonResult, fileName: resultDatasetName},
          fileCache: []
        });

        ctx.dispatch(
          addDataToMap({
            datasets: parsedData,
            options: {autoCreateLayers: true, centerMap: true}
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