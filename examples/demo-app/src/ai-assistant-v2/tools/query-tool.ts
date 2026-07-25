import {generateId} from 'ai';
import {tool} from './ai-tool-shim';
import {z} from 'zod';
import {tableFromArrays, Table as ArrowTable} from 'apache-arrow';
import {addDataToMap} from '@kepler.gl/actions';
import {processFileData} from '@kepler.gl/processors';
import {KeplerContext} from '../types';
import {
  getValuesFromDataset,
  getConnector,
  datasetNameToTableName,
  convertArrowRowToObject,
  tableToLLMResult
} from './utils';
import {saveToDuckdb, loadTableToKepler} from './duckdb-cache';

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

export function getQueryTools(ctx: KeplerContext) {
  const getValues = async (datasetName: string, variableName: string) => {
    const visState = ctx.getVisState();
    return getValuesFromDataset(visState.datasets, visState.layers, datasetName, variableName);
  };

  const genericQuery = tool({
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
    }),
    execute: async ({datasetName, variableNames, sql, resultDatasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const dbTableName = datasetNameToTableName(datasetName);
        const resolvedSql = sql.replace(/__TABLE__/g, `"${dbTableName}"`);
        const db = await loadTableIntoDuckDB(getValues, datasetName, variableNames, dbTableName);
        const arrowResult = await db.query(resolvedSql);

        const jsonResult: Record<string, unknown>[] = arrowResult
          .toArray()
          .map((row: any) => convertArrowRowToObject(row));

        const truncatedQueryResult = tableToLLMResult(jsonResult);

        await saveToDuckdb(resultDatasetName, {
          type: 'rowObjects',
          content: jsonResult
        });

        return {
          success: true as const,
          datasetName: resultDatasetName,
          truncatedQueryResult,
          totalRows: jsonResult.length,
          instruction: `Query executed successfully. The complete result is in dataset ${resultDatasetName} (${jsonResult.length} rows). The truncated result is just a preview.`,
          nextStep: `You can visualize this result on a map by calling createKeplerDatasetFromTable with datasetName="${resultDatasetName}".`,
          sql: resolvedSql,
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
        instruction: output.instruction,
        nextStep: output.nextStep
      };
    }
  });

  const filterDataset = tool({
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
    }),
    execute: async ({datasetName, variableNames, sql, resultDatasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const dbTableName = datasetNameToTableName(datasetName);
        const resolvedSql = sql.replace(/__TABLE__/g, `"${dbTableName}"`);
        const db = await loadTableIntoDuckDB(getValues, datasetName, variableNames, dbTableName);
        const arrowResult = await db.query(resolvedSql);

        const jsonResult: Record<string, unknown>[] = arrowResult
          .toArray()
          .map((row: any) => convertArrowRowToObject(row));

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
            options: {autoCreateLayers: true, centerMap: true}
          })
        );

        return {
          success: true as const,
          details: `Filter query result saved as ${resultDatasetName} (${jsonResult.length} rows) and added to kepler.gl.`,
          resultDatasetName,
          firstFiveRows: tableToLLMResult(jsonResult.slice(0, 5)),
          sql: resolvedSql,
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
        resultDatasetName: output.resultDatasetName,
        firstFiveRows: output.firstFiveRows
      };
    }
  });

  const tableTool = tool({
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
    }),
    execute: async ({datasetName, variableNames, sql, resultDatasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const dbTableName = datasetNameToTableName(datasetName);
        const resolvedSql = sql.replace(/__TABLE__/g, `"${dbTableName}"`);
        const db = await loadTableIntoDuckDB(getValues, datasetName, variableNames, dbTableName);
        const arrowResult = await db.query(resolvedSql);

        const jsonResult: Record<string, unknown>[] = arrowResult
          .toArray()
          .map((row: any) => convertArrowRowToObject(row));

        await saveToDuckdb(resultDatasetName, {
          type: 'rowObjects',
          content: jsonResult
        });

        return {
          success: true as const,
          details: `Table created as ${resultDatasetName} (${jsonResult.length} rows).`,
          resultDatasetName,
          firstFiveRows: tableToLLMResult(jsonResult.slice(0, 5)),
          nextStep: `You can visualize this table on a map by calling createKeplerDatasetFromTable with datasetName="${resultDatasetName}".`,
          sql: resolvedSql,
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
        resultDatasetName: output.resultDatasetName,
        firstFiveRows: output.firstFiveRows,
        nextStep: output.nextStep
      };
    }
  });

  const mergeTablesTool = tool({
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
    }),
    execute: async ({datasetNameA, datasetNameB, sql}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();

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

        const jsonResult: Record<string, unknown>[] = arrowResult
          .toArray()
          .map((row: any) => convertArrowRowToObject(row));

        const resultDatasetName = `merge_${generateId()}`;

        await saveToDuckdb(resultDatasetName, {
          type: 'rowObjects',
          content: jsonResult
        });

        return {
          success: true as const,
          details: `Merged ${datasetNameA} and ${datasetNameB} into ${resultDatasetName} (${jsonResult.length} rows).`,
          resultDatasetName,
          firstTwoRows: jsonResult.slice(0, 2),
          nextStep: `You can visualize this merged table on a map by calling createKeplerDatasetFromTable with datasetName="${resultDatasetName}".`,
          sql: resolvedSql
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
        resultDatasetName: output.resultDatasetName,
        firstTwoRows: output.firstTwoRows,
        nextStep: output.nextStep
      };
    }
  });

  const createKeplerDatasetFromTable = tool({
    description: `Create a new kepler.gl map dataset from a DuckDB table.
Use this tool after running a query (genericQuery, tableTool, mergeTablesTool) to visualize the result on a kepler.gl map.`,
    inputSchema: z.object({
      datasetName: z
        .string()
        .describe(
          'The name of the DuckDB table (e.g. the resultDatasetName from a previous query tool).'
        )
    }),
    execute: async ({datasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();

        const result = await loadTableToKepler(ctx, datasetName);
        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          success: true as const,
          details: `Dataset "${datasetName}" has been added to kepler.gl map.`,
          datasetName
        };
      } catch (error) {
        return {
          success: false as const,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  });

  return {
    genericQuery,
    filterDataset,
    tableTool,
    mergeTablesTool,
    createKeplerDatasetFromTable
  };
}
