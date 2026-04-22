// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool} from 'ai';
import {z} from 'zod';
import {tableFromArrays, Table as ArrowTable} from 'apache-arrow';
import {addDataToMap} from '@kepler.gl/actions';
import {processFileData} from '@kepler.gl/processors';
import {getApplicationConfig, DatabaseAdapter} from '@kepler.gl/utils';
import {DuckDBWasmAdapter} from '@kepler.gl/duckdb';
import {KeplerContext} from '../../types';
import {getValuesFromDataset} from '../utils';

let fallbackAdapter: DatabaseAdapter | null = null;

async function getDatabaseAdapter(): Promise<DatabaseAdapter> {
  const configured = getApplicationConfig().database;
  if (configured) return configured;

  if (!fallbackAdapter) {
    fallbackAdapter = new DuckDBWasmAdapter({
      config: {query: {castBigIntToDouble: true}}
    });
  }
  return fallbackAdapter;
}

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

export function getTableTool(ctx: KeplerContext) {
  return tool({
    description: `Create a new table/dataset in kepler.gl using a SQL query which will:
1. Add a new column to the original dataset
2. Delete a column from the original dataset
3. Rename a column in the original dataset
4. Change the column type in the original dataset
Please note:
1. Do not use * to select all columns, instead use all the column names in dataset.
2. List all column names the new table or dataset will have.
IMPORTANT: please use dbTableName instead of the datasetName in SQL query.`,
    inputSchema: z.object({
      datasetName: z.string().describe('The name of the source dataset'),
      variableNames: z
        .array(z.string())
        .describe('Only use variable names that already exist in the dataset.'),
      sql: z.string().describe('The SQL query to execute. Use dbTableName as the table name.'),
      dbTableName: z
        .string()
        .describe('Alias for the table. Use datasetName plus a 6-digit random number.'),
      queryDatasetName: z.string().describe('The name for the new dataset')
    }),
    execute: async ({datasetName, variableNames, sql, dbTableName, queryDatasetName}) => {
      try {
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
        const db = await getDatabaseAdapter();
        const conn = await db.connect();

        await conn.query(`DROP TABLE IF EXISTS "${dbTableName}"`);
        await conn.insertArrowTable(arrowTable, {name: dbTableName});

        const arrowResult = await conn.query(sql);
        await conn.close();

        const jsonResult: Record<string, unknown>[] = arrowResult
          .toArray()
          .map((row: any) => convertArrowRowToObject(row));

        const parsedData = await processFileData({
          content: {data: jsonResult, fileName: queryDatasetName},
          fileCache: []
        });

        ctx.dispatch(
          addDataToMap({
            datasets: parsedData,
            options: {autoCreateLayers: true, centerMap: true}
          })
        );

        return {
          success: true as const,
          details: `Table created as ${queryDatasetName} (${jsonResult.length} rows) and added to kepler.gl.`,
          queryDatasetName,
          firstFiveRows: jsonResult.slice(0, 5)
        };
      } catch (error) {
        return {
          success: false as const,
          error: error instanceof Error ? error.message : String(error),
          instruction:
            'Please explain the error and give a plan to fix it. Then try again with a different query.'
        };
      }
    },
    toModelOutput: ({output}: any) => {
      if (!output.success) return output;
      return {
        success: output.success,
        details: output.details,
        queryDatasetName: output.queryDatasetName,
        firstFiveRows: output.firstFiveRows
      };
    }
  });
}
