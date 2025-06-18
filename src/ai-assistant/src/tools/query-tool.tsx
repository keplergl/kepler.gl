// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Datasets} from '@kepler.gl/table';
import {Layer} from '@kepler.gl/layers';
import {
  getDuckDB,
  localQuery,
  LocalQueryTool,
  mergeTables,
  MergeTablesTool
} from '@openassistant/duckdb';
import {QueryDuckDBComponent, QueryDuckDBOutputData} from '@openassistant/tables';
import {ToolCache} from '@openassistant/utils';

import {getValuesFromDataset} from './utils';
import {TableToolComponent} from './kepler-tools/table-tool';

export function getQueryTool(datasets: Datasets, layers: Layer[]) {
  const toolCache = ToolCache.getInstance();

  // context for query tools
  const getValues = async (datasetName: string, variableName: string) => {
    const values = getValuesFromDataset(datasets, layers, datasetName, variableName);
    return values;
  };

  // customize some query tools from localQuery tool
  function QueryToolComponent(props: QueryDuckDBOutputData) {
    return <QueryDuckDBComponent {...props} getValues={getValues} getDuckDB={getDuckDB} />;
  }

  // this tool will execute a generic select SQL query against user's dataset
  const genericQuery: LocalQueryTool = {
    ...localQuery,
    description: `execute a generic select SQL query in duckdb to answer user's question. Please note:
1. This tool is NOT for filtering the user dataset.
2. This tool does NOT support geometry column and geometric operations.
3. The variableNames should not be empty. If it is not provided, then pick a variable name from the dataset.
4. There is no need to add a sub-query to add an auto-increment column 'row_index' to the original dataset.
`,
    context: {
      ...localQuery.context,
      getValues
    },
    component: QueryToolComponent
  };

  // customize a filterDataset tool from localQuery tool
  // this tool will use the selected rows (row indexes) to filter the user dataset and save the result as a new dataset.
  const filterDataset: LocalQueryTool = {
    ...localQuery,
    description: `filter the user dataset by using a select SQL query in duckdb and save the result as a new dataset.
Please note:
1. Do not use * to select all columns, instead use all the column names in dataset.
`,
    context: {
      ...localQuery.context,
      getValues
    },
    component: TableToolComponent
  };

  // customize a table tool from localQuery tool to create a new table/dataset in kepler.gl using SQL query
  const tableTool: LocalQueryTool = {
    ...localQuery,
    description: `Create a new table/dataset in kepler.gl using SQL query which will
1. add a new column to the original dataset
2. delete a column from the original dataset
3. rename a column in the original dataset
4. change the column type in the original dataset.
Please note:
1. Do not use * to select all columns, instead use all the column names in dataset.
2. List all column names the new table or dataset will have.
`,
    context: {
      ...localQuery.context,
      getValues
    },
    component: TableToolComponent
  };

  // customize a mergeTables tool from localQuery tool to merge two datasets into a new dataset
  const mergeTablesTool: MergeTablesTool = {
    ...mergeTables,
    context: {
      getValues
    },
    onToolCompleted: (toolName: string, additionalData: unknown) => {
      toolCache.addDataset(toolName, additionalData);
    }
    // component: MergeTablesToolComponent
  };

  return {
    filterDataset,
    genericQuery,
    tableTool,
    mergeTablesTool
  };
}
