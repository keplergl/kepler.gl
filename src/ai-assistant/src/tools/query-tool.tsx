import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Datasets} from '@kepler.gl/table';
import {Layer} from '@kepler.gl/layers';
import {ProtoDataset} from '@kepler.gl/types';
import {addDataToMap} from '@kepler.gl/actions';
import {getDuckDB, localQuery, LocalQueryTool} from '@openassistant/duckdb';

import {getValuesFromDataset, getValuesFromVectorTileLayer} from './utils';
import {State} from '../components/ai-assistant-manager';

export function getQueryTool(datasets: Datasets, layers: Layer[]) {
  // context for query tools
  const getValues = async (datasetName: string, variableName: string) => {
    const values = getValuesFromDataset(datasets, layers, datasetName, variableName);
    return values;
  };

  // customize a filterDataset tool from localQuery tool
  const filterDataset: LocalQueryTool = {
    ...localQuery,
    description: `filter the user dataset by using a select SQL query in duckdb and save the result as a new dataset. Please note:
1. REQUIRED: In the SQL query, please use a sub-query to add an auto-increment column 'row_index' to the original dataset.
2. The SQL query should return the selected row_index values.
3. Please only use the variable user mentioned for variableNames.
For example: 'SELECT row_index  FROM (SELECT row_number() OVER () AS row_index, * FROM dataset_name) WHERE Count > 0'
`,
    context: {
      ...localQuery.context,
      getValues
    },
    component: FilterDatasetComponent
  };

  // customize a generic query tool from localQuery tool
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
    }
  };

  return {
    filterDataset,
    genericQuery
  };
}

function FilterDatasetComponent({columnData, datasetName, sql, dbTableName, filteredDatasetName}) {
  const datasets = useSelector((state: State) => state.demo.keplerGl.map.visState.datasets);
  const layers = useSelector((state: State) => state.demo.keplerGl.map.visState.layers);
  const queryInProgress = useRef<Promise<void> | null>(null);
  const dispatch = useDispatch();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // check if the filteredDatasetName is already in the datasets
    const newDatasetId = Object.keys(datasets).find(
      dataId => datasets[dataId].label === filteredDatasetName
    );
    // if the filteredDatasetName is already in the datasets, return
    if (newDatasetId) return;

    const query = async () => {
      // If a query is already in progress, wait for it to complete
      if (queryInProgress.current) {
        await queryInProgress.current;
      }

      // Create a new promise for this query
      queryInProgress.current = (async () => {
        try {
          const duckDB = await getDuckDB();
          if (!duckDB) {
            throw new Error('DuckDB instance is not initialized');
          }
          if (columnData && dbTableName && sql) {
            // use double quotes for the table name
            const safeDbTableName = `${dbTableName}`;

            // connect to the database
            const conn = await duckDB.connect();

            // Execute the provided SQL query
            const arrowResult = await conn.query(sql);

            // convert the arrow result to a json array
            const result = arrowResult.toArray().map(row => row.toJSON());

            // delete the table from the database
            await conn.query(`DROP TABLE ${safeDbTableName}`);

            // close the connection
            await conn.close();

            // filter the dataset with the query result
            const filteredDataset = filterDataset(
              datasets,
              layers,
              datasetName,
              result,
              filteredDatasetName
            );

            if (filteredDataset) {
              // add the new dataset to the map
              dispatch(
                addDataToMap({
                  datasets: [filteredDataset],
                  options: {autoCreateLayers: true, centerMap: false}
                })
              );
            }
          }
        } catch (error) {
          console.error(error);
          setError(error instanceof Error ? error.message : 'Unknown error occurred');
        } finally {
          queryInProgress.current = null;
        }
      })();

      // Wait for the query to complete
      await queryInProgress.current;
    };

    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return error ? <div style={{color: 'red', fontSize: '8px'}}>{error}</div> : null;
}

function filterDataset(
  datasets: Datasets,
  layers: Layer[],
  datasetName: string,
  filteredRows: Record<string, number>[],
  filteredDatasetName: string
) {
  // find datasetId from datasets
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (!datasetId) return;

  // filter the original dataset
  const originalDataset = datasets[datasetId];

  const fields = originalDataset.fields;

  let rows: unknown[][];

  if (originalDataset.type === 'vector-tile') {
    const columnData: unknown[][] = [];
    for (const field of fields) {
      // get the values from the vector tile layer
      const values = getValuesFromVectorTileLayer(datasetId, layers, field);
      columnData.push(values);
    }
    rows = filteredRows.map(rowIndex =>
      columnData.map(column => column[Number(rowIndex['row_index']) - 1])
    );
  } else {
    rows = filteredRows.map(rowIndex =>
      fields.map(field => originalDataset.getValue(field.name, Number(rowIndex['row_index']) - 1))
    );
  }

  // create a new dataset with the filtered data
  const newDataset: ProtoDataset = {
    info: {
      id: filteredDatasetName,
      label: filteredDatasetName
    },
    data: {
      fields,
      rows
    }
  };

  return newDataset;
}
