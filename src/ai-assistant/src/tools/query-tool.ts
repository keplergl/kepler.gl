// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool, generateId} from 'ai';
import {z} from 'zod';
import {tableFromArrays, Table as ArrowTable} from 'apache-arrow';
import {getApplicationConfig, DatabaseAdapter} from '@kepler.gl/utils';
import {DuckDBWasmAdapter} from '@kepler.gl/duckdb';
import {KeplerContext} from '../types';
import {getValuesFromDataset} from './utils';
import {getToolResultCache} from './kepler-tools/save-data-tool';

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

  if (Array.isArray(row)) {
    return row.map(convertArrowRowToObject) as any;
  }

  return row;
}

function truncateObjectValues(obj: unknown, maxLength: number): unknown {
  if (!obj || typeof obj !== 'object') return obj;
  const truncated: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const str = JSON.stringify(value);
    truncated[key] = str.length > maxLength ? `${str.substring(0, maxLength)}...` : value;
  }
  return truncated;
}

async function loadTableIntoDuckDB(
  getValues: (datasetName: string, variableName: string) => Promise<unknown[]>,
  datasetName: string,
  variableNames: string[],
  dbTableName: string
) {
  const columnData: Record<string, unknown[]> = {};
  for (const varName of variableNames) {
    columnData[varName] = await getValues(datasetName, varName);
  }

  const arrowTable: ArrowTable = tableFromArrays(columnData);
  const db = await getDatabaseAdapter();
  const conn = await db.connect();

  await conn.query(`DROP TABLE IF EXISTS "${dbTableName}"`);
  await conn.insertArrowTable(arrowTable, {name: dbTableName});

  return conn;
}

export function getQueryTools(ctx: KeplerContext) {
  const getValues = async (datasetName: string, variableName: string) => {
    const visState = ctx.getVisState();
    return getValuesFromDataset(visState.datasets, visState.layers, datasetName, variableName);
  };

  const toolCache = getToolResultCache();

  const genericQuery = tool({
    description: `Execute a generic SELECT SQL query in DuckDB to answer user's question.
1. This tool is NOT for filtering the user dataset.
2. This tool does NOT support geometry column and geometric operations.
3. The variableNames should not be empty. If not provided, pick a variable name from the dataset.
4. There is no need to add a sub-query to add an auto-increment column 'row_index' to the original dataset.
IMPORTANT: please use dbTableName instead of the datasetName in SQL query.`,
    inputSchema: z.object({
      datasetName: z.string(),
      variableNames: z
        .array(z.string())
        .describe('Only use variable names that already exist in the dataset.'),
      sql: z.string().describe('The SQL query to execute. Use dbTableName as the table name.'),
      dbTableName: z
        .string()
        .describe(
          'Alias of the table created from the dataset. Use datasetName plus a 6-digit random number.'
        )
    }),
    execute: async ({datasetName, variableNames, sql, dbTableName}) => {
      try {
        const conn = await loadTableIntoDuckDB(getValues, datasetName, variableNames, dbTableName);
        const arrowResult = await conn.query(sql);
        await conn.close();

        const jsonResult: Record<string, unknown>[] = arrowResult
          .toArray()
          .map((row: any) => convertArrowRowToObject(row));

        const MAX_RESULT_LENGTH = 1000;
        let truncatedQueryResult = '';
        for (const row of jsonResult) {
          truncatedQueryResult += `${JSON.stringify(truncateObjectValues(row, 100))}\n`;
          if (truncatedQueryResult.length > MAX_RESULT_LENGTH) break;
        }

        const queryDatasetName = `query_${generateId()}`;

        toolCache.set(queryDatasetName, {type: 'rowObjects', content: jsonResult});

        return {
          success: true as const,
          datasetName: queryDatasetName,
          truncatedQueryResult,
          totalRows: jsonResult.length,
          instruction: `Query executed successfully. The complete result is in dataset ${queryDatasetName} (${jsonResult.length} rows). The truncated result is just a preview.`,
          sql,
          dbTableName
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
        datasetName: output.datasetName,
        truncatedQueryResult: output.truncatedQueryResult,
        totalRows: output.totalRows,
        instruction: output.instruction
      };
    }
  });

  const filterDataset = tool({
    description: `Filter the user dataset using a SELECT SQL query in DuckDB and save as new dataset.
Do not use * to select all columns, use all column names.
IMPORTANT: please use dbTableName instead of the datasetName in SQL query.`,
    inputSchema: z.object({
      datasetName: z.string(),
      variableNames: z
        .array(z.string())
        .describe('Only use variable names that already exist in the dataset.'),
      sql: z.string().describe('The SQL query to execute. Use dbTableName as the table name.'),
      dbTableName: z
        .string()
        .describe(
          'Alias of the table created from the dataset. Use datasetName plus a 6-digit random number.'
        ),
      queryDatasetName: z.string().describe('Name for the new filtered dataset.')
    }),
    execute: async ({datasetName, variableNames, sql, dbTableName, queryDatasetName}) => {
      try {
        const conn = await loadTableIntoDuckDB(getValues, datasetName, variableNames, dbTableName);
        const arrowResult = await conn.query(sql);
        await conn.close();

        const jsonResult: Record<string, unknown>[] = arrowResult
          .toArray()
          .map((row: any) => convertArrowRowToObject(row));

        toolCache.set(queryDatasetName, {type: 'rowObjects', content: jsonResult});

        return {
          success: true as const,
          details: `Filter query result saved as ${queryDatasetName} (${jsonResult.length} rows).`,
          queryDatasetName,
          firstFiveRows: jsonResult.slice(0, 5),
          sql,
          dbTableName
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

  const tableTool = tool({
    description: `Create a new table/dataset in kepler.gl using SQL query.
1. Add/delete/rename columns or change column types.
2. Do not use * to select all columns.
3. List all column names the new table will have.
IMPORTANT: please use dbTableName instead of the datasetName in SQL query.`,
    inputSchema: z.object({
      datasetName: z.string(),
      variableNames: z
        .array(z.string())
        .describe('Only use variable names that already exist in the dataset.'),
      sql: z.string().describe('The SQL query to execute. Use dbTableName as the table name.'),
      dbTableName: z
        .string()
        .describe(
          'Alias of the table created from the dataset. Use datasetName plus a 6-digit random number.'
        ),
      queryDatasetName: z.string().describe('Name for the new dataset.')
    }),
    execute: async ({datasetName, variableNames, sql, dbTableName, queryDatasetName}) => {
      try {
        const conn = await loadTableIntoDuckDB(getValues, datasetName, variableNames, dbTableName);
        const arrowResult = await conn.query(sql);
        await conn.close();

        const jsonResult: Record<string, unknown>[] = arrowResult
          .toArray()
          .map((row: any) => convertArrowRowToObject(row));

        toolCache.set(queryDatasetName, {type: 'rowObjects', content: jsonResult});

        return {
          success: true as const,
          details: `Table created as ${queryDatasetName} (${jsonResult.length} rows).`,
          queryDatasetName,
          firstFiveRows: jsonResult.slice(0, 5),
          sql,
          dbTableName
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

  const mergeTablesTool = tool({
    description: `Merge table B to table A into a new table using SQL in DuckDB.
- Horizontal merge: JOIN on a key column that exists in both tables.
  e.g. SELECT A.id, A.name, A.INCOME, B.POP FROM A JOIN B USING (id)
- Vertical merge: tables must have the same columns.
  e.g. SELECT id, name, income FROM A UNION ALL SELECT id, name, income FROM B
IMPORTANT: Do not use * in the SQL query, use column names of table A and B.`,
    inputSchema: z.object({
      datasetNameA: z.string(),
      datasetNameB: z.string(),
      columnNamesA: z.array(z.string()).describe('The columns of table A.'),
      columnNamesB: z.array(z.string()).describe('The columns of table B.'),
      mergeType: z.enum(['horizontal', 'vertical']),
      keyColumn: z.string().optional().describe('The key column to join on if merge horizontally.'),
      dbTableNameA: z
        .string()
        .describe('Alias for table A. Use datasetNameA plus a 6-digit random number.'),
      dbTableNameB: z
        .string()
        .describe('Alias for table B. Use datasetNameB plus a 6-digit random number.'),
      sql: z.string()
    }),
    execute: async ({
      datasetNameA,
      datasetNameB,
      columnNamesA,
      columnNamesB,
      mergeType,
      keyColumn,
      sql,
      dbTableNameA,
      dbTableNameB
    }) => {
      try {
        if (
          mergeType === 'horizontal' &&
          (!keyColumn || !columnNamesA.includes(keyColumn) || !columnNamesB.includes(keyColumn))
        ) {
          throw new Error(
            'Key column is not in table A or B. Please provide a key column for horizontal merge.'
          );
        }

        const columnDataA: Record<string, unknown[]> = {};
        for (const col of columnNamesA) {
          columnDataA[col] = await getValues(datasetNameA, col);
        }
        const columnDataB: Record<string, unknown[]> = {};
        for (const col of columnNamesB) {
          columnDataB[col] = await getValues(datasetNameB, col);
        }

        const arrowTableA: ArrowTable = tableFromArrays(columnDataA);
        const arrowTableB: ArrowTable = tableFromArrays(columnDataB);

        const db = await getDatabaseAdapter();
        const conn = await db.connect();

        await conn.query(`DROP TABLE IF EXISTS "${dbTableNameA}"`);
        await conn.insertArrowTable(arrowTableA, {name: dbTableNameA});
        await conn.query(`DROP TABLE IF EXISTS "${dbTableNameB}"`);
        await conn.insertArrowTable(arrowTableB, {name: dbTableNameB});

        const arrowResult = await conn.query(sql);
        await conn.close();

        const jsonResult: Record<string, unknown>[] = arrowResult
          .toArray()
          .map((row: any) => convertArrowRowToObject(row));

        const queryDatasetName = `merge_${generateId()}`;

        toolCache.set(queryDatasetName, {type: 'rowObjects', content: jsonResult});

        return {
          success: true as const,
          details: `Merged ${datasetNameA} and ${datasetNameB} into ${queryDatasetName} (${jsonResult.length} rows).`,
          queryDatasetName,
          firstTwoRows: jsonResult.slice(0, 2),
          sql
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
        firstTwoRows: output.firstTwoRows
      };
    }
  });

  return {
    genericQuery,
    filterDataset,
    tableTool,
    mergeTablesTool
  };
}
