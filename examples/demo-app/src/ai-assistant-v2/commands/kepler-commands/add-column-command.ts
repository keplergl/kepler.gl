import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {updateDataset} from '@kepler.gl/actions';
import {arrowSchemaToFields} from '@kepler.gl/processors';
import {KeplerContext} from '../../types';
import {
  getValuesFromDataset,
  datasetNameToTableName,
  arrowTableToObjects,
  tableToLLMResult
} from '../../tools/utils';
import {loadTableIntoDuckDB} from '../query-commands';

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
IMPORTANT: this command only ADDS columns. It cannot delete, rename-in-place, or change the type of an existing column. If you need to remove or transform columns, create a NEW dataset with map.create-table instead.`,
    inputSchema: z
      .object({
        datasetName: z.string().describe('The name of the dataset to add the column to'),
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
        const dataId = Object.keys(datasets).find(id => datasets[id].label === datasetName);
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

        const getValues = async (ds: string, variableName: string) =>
          getValuesFromDataset(visState.datasets, visState.layers, ds, variableName);

        const dbTableName = datasetNameToTableName(datasetName);
        const db = await loadTableIntoDuckDB(
          getValues,
          datasetName,
          fieldNames,
          dbTableName
        );

        // Add-only: keep every existing column and append the new one as either a
        // copy of the source column or a computed expression. Explicit column
        // list (no `SELECT *`) so the output column order is deterministic.
        const appendedSql =
          copyFromColumn != null
            ? `"${copyFromColumn}" AS "${newColumnName}"`
            : `(${expression}) AS "${newColumnName}"`;
        const selectList = [
          ...fieldNames.map(name => `"${name}"`),
          appendedSql
        ].join(', ');
        const arrowResult = await db.query(
          `SELECT ${selectList} FROM "${dbTableName}"`
        );

        // Build the kepler payload the same way the arrow file loader does:
        // column vectors + `arrowSchemaToFields` (handles geoarrow / wkb / h3).
        const cols = [...Array(arrowResult.numCols).keys()].map(i =>
          arrowResult.getChildAt(i)
        );
        const fields = arrowSchemaToFields(arrowResult as any);

        // No `renames`: existing columns keep their names, so the schema is a
        // strict superset of the old one and layers/filters need no remapping.
        ctx.dispatch(
          updateDataset(dataId, {cols, fields, arrowTable: arrowResult} as any)
        );

        const jsonResult = arrowTableToObjects(arrowResult);
        const valueSource =
          copyFromColumn != null ? `copied from "${copyFromColumn}"` : `computed`;
        return {
          success: true,
          commandId: addColumnCommandId,
          data: {
            details: `Added column "${newColumnName}" to dataset "${datasetName}" (${valueSource}, ${jsonResult.length} rows).`,
            addedColumns: [newColumnName],
            firstFiveRows: tableToLLMResult(jsonResult.slice(0, 5))
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: addColumnCommandId,
          error: error instanceof Error ? error.message : String(error),
          data: {
            instruction:
              'Please explain the error and give a plan to fix it. Then try again.'
          }
        };
      }
    }
  };
}
