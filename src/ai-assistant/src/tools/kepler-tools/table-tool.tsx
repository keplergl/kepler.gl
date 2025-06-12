import {useSelector} from 'react-redux';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {getDuckDB, LocalQueryAdditionalData, convertArrowRowToObject} from '@openassistant/duckdb';

import {State} from '../../components/ai-assistant-manager';
import {addDataToMap} from '@kepler.gl/actions';
import {processFileData} from '@kepler.gl/processors';

// This component will create a new table using the SQL query which will
// 1. add a new column
// 2. delete a column
// 3. rename a column
// 4. change the variable type of a column
export function TableToolComponent({
  sql,
  dbTableName,
  queryDatasetName: newDatasetName
}: LocalQueryAdditionalData) {
  const datasets = useSelector((state: State) => state.demo.keplerGl.map.visState.datasets);
  const queryInProgress = useRef<Promise<void> | null>(null);
  const dispatch = useDispatch();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // check if the newDatasetName is already in the datasets
    const newDatasetId = Object.keys(datasets).find(
      dataId => datasets[dataId].label === newDatasetName
    );
    // if the newDatasetName is already in the datasets, return
    if (newDatasetId) return;

    const addTable = async () => {
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
          if (dbTableName && sql) {
            // connect to the database
            const conn = await duckDB.connect();

            // Execute the provided SQL query
            const arrowResult = await conn.query(sql);

            // convert arrowResult to a JSON object
            const jsonResult = arrowResult.toArray().map(row => convertArrowRowToObject(row));

            // use processFileData to process the rowObject
            const processedData = await processFileData({
              content: {fileName: newDatasetName, data: jsonResult},
              fileCache: []
            });

            // add the new dataset to the map
            dispatch(
              addDataToMap({
                datasets: processedData,
                options: {autoCreateLayers: true, centerMap: true}
              })
            );

            // delete the table from the database
            await conn.query(`DROP TABLE ${dbTableName}`);

            // close the connection
            await conn.close();
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

    addTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return error ? <div style={{color: 'red', fontSize: '8px'}}>{error}</div> : null;
}
