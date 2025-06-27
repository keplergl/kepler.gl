// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {processFileData} from '@kepler.gl/processors';
import {addDataToMap} from '@kepler.gl/actions';
import {ProtoDataset} from '@kepler.gl/types';
import {FeatureCollection} from 'geojson';
import {extendedTool, ToolCache, generateId} from '@openassistant/utils';
import {z} from 'zod';

export const saveToolResults = extendedTool({
  description:
    'Save tool results to kepler.gl. The tool includes: buffer, zipcode, county, state, isochrone, thiessenPolygons, mst, cartogram, etc.',
  parameters: z.object({
    datasetNames: z.array(z.string()).describe('The names of the datasets created by tools.')
  }),
  execute: async (args: {datasetNames: string[]}) => {
    try {
      const {datasetNames} = args;
      const loadedDatasetNames: string[] = [];
      const result: unknown[] = [];
      const toolCache = ToolCache.getInstance();

      let datasetType;

      for (const datasetName of datasetNames) {
        const dataset = toolCache.getDataset(datasetName);
        if (dataset && dataset.type === 'geojson') {
          datasetType = 'geojson';
        } else if (dataset && dataset.type === 'columnData') {
          datasetType = 'columnData';
        } else if (dataset && dataset.type === 'rowObjects') {
          datasetType = 'rowObjects';
        } else {
          throw new Error(
            `Can not save tool cache dataset ${datasetName}, the dataset type ${datasetType} is not supported`
          );
        }
        result.push(dataset.content);
        loadedDatasetNames.push(datasetName);
      }

      if (result.length === 0) {
        throw new Error(`Can not save dataset, No datasets found from ${datasetNames.join(', ')}`);
      }

      // merge the result based on the dataset type
      let mergedResult;

      if (datasetType === 'geojson') {
        mergedResult = (result as FeatureCollection[]).reduce(
          (acc, geom) => {
            return {
              ...acc,
              features: [...acc.features, ...geom.features]
            };
          },
          {type: 'FeatureCollection', features: []}
        );
      } else if (datasetType === 'columnData') {
        const mergedColumnData = (result as Record<string, unknown>[]).reduce((acc, row) => {
          return {
            ...acc,
            ...row
          };
        }, {}) as Record<string, unknown[]>;
        // convert the merged result to a rowObjects array
        const columnNames = Object.keys(mergedColumnData);
        const numberOfRows = mergedColumnData[columnNames[0]].length;
        for (let i = 0; i < numberOfRows; i++) {
          const rowObject: Record<string, unknown> = {};
          for (const columnName of columnNames) {
            rowObject[columnName] = mergedColumnData[columnName][i];
          }
          mergedResult.push(rowObject);
        }
      } else if (datasetType === 'rowObjects') {
        mergedResult = (result as unknown[][]).reduce((acc, row) => {
          return [...acc, ...row];
        }, []);
      }

      const datasetName =
        datasetNames.length > 1 ? `${datasetNames.join('_')}_${generateId()}` : datasetNames[0];

      // try to process the merged result using kepler.gl processor
      const parsedData = await processFileData({
        content: {
          data: mergedResult,
          fileName: `${datasetName}`
        },
        fileCache: []
      });

      return {
        llmResult: {
          success: true,
          savedDatasetName: datasetName,
          details: `Successfully save dataset: ${datasetName} in kepler.gl`
        },
        additionalData: {
          parsedData
        }
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          details: `Can not save data to kepler.gl, ${error}`
        }
      };
    }
  },
  component: SaveDataToMapToolComponent
});

export function SaveDataToMapToolComponent({parsedData}: {parsedData: ProtoDataset[]}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      addDataToMap({
        datasets: parsedData,
        options: {autoCreateLayers: true, centerMap: true}
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
