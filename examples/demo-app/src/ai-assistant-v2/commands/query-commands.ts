import {generateId} from 'ai';
import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {tableFromArrays, Table as ArrowTable} from 'apache-arrow';
import {addDataToMap} from '@kepler.gl/actions';
import {processFileData} from '@kepler.gl/processors';
import {KeplerContext} from '../types';
import {
  getValuesFromDataset,
  getConnector,
  datasetNameToTableName,
  arrowTableToObjects,
  tableToLLMResult
} from '../tools/utils';
import {saveToDuckdb, loadTableToKepler} from '../tools/duckdb-cache';

/**
 * Load dataset columns into a DuckDB table, incrementally adding only missing columns.
 * If the table already contains all requested columns, returns immediately without
 * re-fetching data. If some columns are missing, reads existing data from DuckDB and
 * appends only the new columns to avoid redundant getValues() calls.
 */
async function loadTableIntoDuckDB(
  getValues: (datasetName: string, variableName: string) => Promise<unknown[]>,
  datasetName: string,
  variableNames: string[],
  dbTableName: string
) {
  const db = await getConnector();

  let existingColumns: Set<string> = new Set();
  try {
    const info = await db.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = '${dbTableName.replace(
        /'/g,
        "''"
      )}'`
    );
    existingColumns = new Set(
      info.toArray().map((r: any) => {
        const j = typeof r.toJSON === 'function' ? r.toJSON() : r;
        return String(j.column_name);
      })
    );
  } catch {
    // Table doesn't exist yet
  }

  const missingVars = variableNames.filter(v => !existingColumns.has(v));

  if (missingVars.length === 0 && existingColumns.size > 0) {
    return db;
  }

  if (existingColumns.size === 0) {
    const columnData: Record<string, unknown[]> = {};
    for (const varName of variableNames) {
      columnData[varName] = await getValues(datasetName, varName);
    }
    const arrowTable: ArrowTable = tableFromArrays(columnData);
    await db.execute(`DROP TABLE IF EXISTS "${dbTableName}"`);
    await db.loadArrow(arrowTable, dbTableName);
  } else {
    const existingData = await db.query(`SELECT * FROM "${dbTableName}"`);
    const columnData: Record<string, unknown[]> = {};

    for (const field of existingData.schema.fields) {
      const col = existingData.getChild(field.name);
      if (col) {
        columnData[field.name] = Array.from(col);
      }
    }

    for (const varName of missingVars) {
      columnData[varName] = await getValues(datasetName, varName);
    }

    const arrowTable: ArrowTable = tableFromArrays(columnData);
    await db.execute(`DROP TABLE IF EXISTS "${dbTableName}"`);
    await db.loadArrow(arrowTable, dbTableName);
  }

  return db;
}

export function getQueryCommands(ctx: KeplerContext): Record<string, RoomCommand> {
  const getValues = async (datasetName: string, variableName: string) => {
    const visState = ctx.getVisState();
    return getValuesFromDataset(visState.datasets, visState.layers, datasetName, variableName);
  };

  const genericQuery: RoomCommand = {
    id: 'data.query',
    name: 'Query (SELECT SQL)',
    group: 'Data',
    description: `Execute a generic SELECT SQL query in DuckDB to answer user's question.
1. This tool is NOT for filtering the user dataset.
2. There is no need to add a sub-query to add an auto-increment column 'row_index' to the original dataset.
IMPORTANT: Use __TABLE__ as the table name placeholder in SQL. It will be replaced with the actual DuckDB table name at runtime.`,
    inputSchema: z.object({
      datasetName: z.string(),
      variableNames: z
        .array(z.string())
        .describe('Only use variable names that already exist in the dataset.'),
      sql: z
        .string()
        .describe('The SQL query to execute. Use __TABLE__ as the table name placeholder.'),
      resultDatasetName: z
        .string()
        .describe('A short, unique snake_case name describing the query result.')
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
        const db = await loadTableIntoDuckDB(getValues, datasetName, variableNames, dbTableName);
        const arrowResult = await db.query(resolvedSql);

        const jsonResult: Record<string, unknown>[] = arrowTableToObjects(arrowResult);

        const truncatedQueryResult = tableToLLMResult(jsonResult);

        await saveToDuckdb(resultDatasetName, {
          type: 'rowObjects',
          content: jsonResult
        });

        // Trimmed, model-facing subset (ported from the old `toModelOutput`).
        return {
          success: true,
          commandId: 'data.query',
          data: {
            datasetName: resultDatasetName,
            truncatedQueryResult,
            totalRows: jsonResult.length,
            instruction: `Query executed successfully. The complete result is in dataset ${resultDatasetName} (${jsonResult.length} rows). The truncated result is just a preview.`,
            nextStep: `You can visualize this result on a map by calling createKeplerDatasetFromTable with datasetName="${resultDatasetName}".`,
            sql: resolvedSql,
            dbTableName
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'data.query',
          error: error instanceof Error ? error.message : String(error),
          data: {
            instruction:
              'Please explain the error and give a plan to fix it. Then try again with a different query.'
          }
        };
      }
    }
  };

  const filterDataset: RoomCommand = {
    id: 'data.filter',
    name: 'Filter dataset via SQL',
    group: 'Data',
    description: `Filter the user dataset using a SELECT SQL query in DuckDB and save as new dataset.
Do not use * to select all columns, use all column names.
IMPORTANT: Use __TABLE__ as the table name placeholder in SQL. It will be replaced with the actual DuckDB table name at runtime.`,
    inputSchema: z.object({
      datasetName: z.string(),
      variableNames: z
        .array(z.string())
        .describe('Only use variable names that already exist in the dataset.'),
      sql: z
        .string()
        .describe('The SQL query to execute. Use __TABLE__ as the table name placeholder.'),
      resultDatasetName: z.string().describe('Name for the new filtered dataset.')
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
        const db = await loadTableIntoDuckDB(getValues, datasetName, variableNames, dbTableName);
        const arrowResult = await db.query(resolvedSql);

        const jsonResult: Record<string, unknown>[] = arrowTableToObjects(arrowResult);

        await saveToDuckdb(resultDatasetName, {
          type: 'rowObjects',
          content: jsonResult
        });

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
        return {
          success: true,
          commandId: 'data.filter',
          data: {
            details: `Filter query result saved as ${resultDatasetName} (${jsonResult.length} rows) and added to kepler.gl.`,
            resultDatasetName,
            firstFiveRows: tableToLLMResult(jsonResult.slice(0, 5)),
            sql: resolvedSql,
            dbTableName
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'data.filter',
          error: error instanceof Error ? error.message : String(error),
          data: {
            instruction:
              'Please explain the error and give a plan to fix it. Then try again with a different query.'
          }
        };
      }
    }
  };

  const tableCommand: RoomCommand = {
    id: 'data.create-table',
    name: 'Create table via SQL',
    group: 'Data',
    description: `Create a new table/dataset in kepler.gl using SQL query.
1. Add/delete/rename columns or change column types.
2. Do not use * to select all columns.
3. List all column names the new table will have.
IMPORTANT: Use __TABLE__ as the table name placeholder in SQL. It will be replaced with the actual DuckDB table name at runtime.`,
    inputSchema: z.object({
      datasetName: z.string(),
      variableNames: z
        .array(z.string())
        .describe('Only use variable names that already exist in the dataset.'),
      sql: z
        .string()
        .describe('The SQL query to execute. Use __TABLE__ as the table name placeholder.'),
      resultDatasetName: z.string().describe('Name for the new dataset.')
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
        const db = await loadTableIntoDuckDB(getValues, datasetName, variableNames, dbTableName);
        const arrowResult = await db.query(resolvedSql);

        const jsonResult: Record<string, unknown>[] = arrowTableToObjects(arrowResult);

        await saveToDuckdb(resultDatasetName, {
          type: 'rowObjects',
          content: jsonResult
        });

        // Trimmed, model-facing subset (ported from the old `toModelOutput`).
        return {
          success: true,
          commandId: 'data.create-table',
          data: {
            details: `Table created as ${resultDatasetName} (${jsonResult.length} rows).`,
            resultDatasetName,
            firstFiveRows: tableToLLMResult(jsonResult.slice(0, 5)),
            nextStep: `You can visualize this table on a map by calling createKeplerDatasetFromTable with datasetName="${resultDatasetName}".`,
            sql: resolvedSql,
            dbTableName
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'data.create-table',
          error: error instanceof Error ? error.message : String(error),
          data: {
            instruction:
              'Please explain the error and give a plan to fix it. Then try again with a different query.'
          }
        };
      }
    }
  };

  const mergeTablesCommand: RoomCommand = {
    id: 'data.merge-tables',
    name: 'Merge tables via SQL',
    group: 'Data',
    description: `Merge two tables into a new table using SQL in DuckDB.
- Horizontal merge (JOIN): SELECT A.id, A.name, B.pop FROM __TABLE_A__ A JOIN __TABLE_B__ B USING (id)
- Vertical merge (UNION): SELECT id, name FROM __TABLE_A__ UNION ALL SELECT id, name FROM __TABLE_B__
IMPORTANT: Use __TABLE_A__ and __TABLE_B__ as table name placeholders in SQL. They will be replaced with actual DuckDB table names at runtime.`,
    inputSchema: z.object({
      datasetNameA: z.string().describe('The name of the first dataset.'),
      datasetNameB: z.string().describe('The name of the second dataset.'),
      sql: z
        .string()
        .describe(
          'The SQL query to merge the tables. Use __TABLE_A__ and __TABLE_B__ as table name placeholders.'
        )
    }) as any,
    execute: async (_execCtx, input) => {
      const {datasetNameA, datasetNameB, sql} = (input ?? {}) as {
        datasetNameA: string;
        datasetNameB: string;
        sql: string;
      };
      try {
        const visState = ctx.getVisState();
        const datasets = visState.datasets;

        const datasetIdA = Object.keys(datasets).find(id => datasets[id].label === datasetNameA);
        const datasetIdB = Object.keys(datasets).find(id => datasets[id].label === datasetNameB);
        if (!datasetIdA) throw new Error(`Dataset "${datasetNameA}" not found.`);
        if (!datasetIdB) throw new Error(`Dataset "${datasetNameB}" not found.`);

        const columnNamesA = datasets[datasetIdA].fields.map((f: any) => f.name);
        const columnNamesB = datasets[datasetIdB].fields.map((f: any) => f.name);

        const dbTableNameA = datasetNameToTableName(datasetNameA);
        const dbTableNameB = datasetNameToTableName(datasetNameB);

        const db = await loadTableIntoDuckDB(getValues, datasetNameA, columnNamesA, dbTableNameA);
        await loadTableIntoDuckDB(getValues, datasetNameB, columnNamesB, dbTableNameB);

        const resolvedSql = sql
          .replace(/__TABLE_A__/g, `"${dbTableNameA}"`)
          .replace(/__TABLE_B__/g, `"${dbTableNameB}"`);
        const arrowResult = await db.query(resolvedSql);

        const jsonResult: Record<string, unknown>[] = arrowTableToObjects(arrowResult);

        const resultDatasetName = `merge_${generateId()}`;

        await saveToDuckdb(resultDatasetName, {
          type: 'rowObjects',
          content: jsonResult
        });

        // Trimmed, model-facing subset (ported from the old `toModelOutput`).
        return {
          success: true,
          commandId: 'data.merge-tables',
          data: {
            details: `Merged ${datasetNameA} and ${datasetNameB} into ${resultDatasetName} (${jsonResult.length} rows).`,
            resultDatasetName,
            firstTwoRows: jsonResult.slice(0, 2),
            nextStep: `You can visualize this merged table on a map by calling createKeplerDatasetFromTable with datasetName="${resultDatasetName}".`,
            sql: resolvedSql
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'data.merge-tables',
          error: error instanceof Error ? error.message : String(error),
          data: {
            instruction:
              'Please explain the error and give a plan to fix it. Then try again with a different query.'
          }
        };
      }
    }
  };

  const createKeplerDatasetFromTable: RoomCommand = {
    id: 'data.load-to-map',
    name: 'Load DuckDB table to map',
    group: 'Data',
    description: `Create a new kepler.gl map dataset from a DuckDB table.
Use this command after running a query (genericQuery, tableCommand, mergeTablesCommand) to visualize the result on a kepler.gl map.`,
    inputSchema: z.object({
      datasetName: z
        .string()
        .describe(
          'The name of the DuckDB table (e.g. the resultDatasetName from a previous query tool).'
        )
    }) as any,
    execute: async (_execCtx, input) => {
      const {datasetName} = (input ?? {}) as {datasetName: string};
      try {
        const result = await loadTableToKepler(ctx, datasetName);
        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          success: true,
          commandId: 'data.load-to-map',
          data: {
            details: `Dataset "${datasetName}" has been added to kepler.gl map.`,
            datasetName
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'data.load-to-map',
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  };

  return {
    'data.query': genericQuery,
    'data.filter': filterDataset,
    'data.create-table': tableCommand,
    'data.merge-tables': mergeTablesCommand,
    'data.load-to-map': createKeplerDatasetFromTable
  };
}