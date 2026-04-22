// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool} from 'ai';
import {z} from 'zod';
import {addDataToMap} from '@kepler.gl/actions';
import {processFileData} from '@kepler.gl/processors';
import {FeatureCollection} from 'geojson';
import {KeplerContext} from '../../types';

/**
 * In-memory tool result cache to replace @openassistant/utils ToolCache.
 * Stores intermediate tool results (GeoJSON, column data, row objects)
 * so subsequent tools can reference them by name.
 */
const toolResultCache = new Map<
  string,
  {type: string; content: any}
>();

export function getToolResultCache() {
  return toolResultCache;
}

export function getSaveDataTool(ctx: KeplerContext) {
  return tool({
    description:
      'Save tool results to kepler.gl. Works with buffer, zipcode, county, state, isochrone, thiessenPolygons, mst, cartogram, etc.',
    inputSchema: z.object({
      datasetNames: z.array(z.string()).describe('The names of the datasets created by tools.')
    }),
    execute: async ({datasetNames}) => {
      try {
        const loadedDatasetNames: string[] = [];
        const result: unknown[] = [];
        let datasetType: string | undefined;

        for (const datasetName of datasetNames) {
          const dataset = toolResultCache.get(datasetName);
          if (dataset && dataset.type === 'geojson') {
            datasetType = 'geojson';
          } else if (dataset && dataset.type === 'columnData') {
            datasetType = 'columnData';
          } else if (dataset && dataset.type === 'rowObjects') {
            datasetType = 'rowObjects';
          } else {
            throw new Error(
              `Cannot save tool cache dataset ${datasetName}, the dataset type is not supported`
            );
          }
          result.push(dataset.content);
          loadedDatasetNames.push(datasetName);
        }

        if (result.length === 0) {
          throw new Error(`No datasets found from ${datasetNames.join(', ')}`);
        }

        let mergedResult: any;

        if (datasetType === 'geojson') {
          mergedResult = (result as FeatureCollection[]).reduce(
            (acc, geom) => ({
              ...acc,
              features: [...acc.features, ...geom.features]
            }),
            {type: 'FeatureCollection', features: []} as FeatureCollection
          );
        } else if (datasetType === 'columnData') {
          const mergedColumnData = (result as Record<string, unknown>[]).reduce(
            (acc, row) => ({...acc, ...row}),
            {}
          ) as Record<string, unknown[]>;
          const columnNames = Object.keys(mergedColumnData);
          const numberOfRows = mergedColumnData[columnNames[0]].length;
          mergedResult = [];
          for (let i = 0; i < numberOfRows; i++) {
            const rowObject: Record<string, unknown> = {};
            for (const columnName of columnNames) {
              rowObject[columnName] = mergedColumnData[columnName][i];
            }
            mergedResult.push(rowObject);
          }
        } else if (datasetType === 'rowObjects') {
          mergedResult = (result as unknown[][]).reduce((acc, row) => [...acc, ...row], []);
        }

        const datasetName =
          datasetNames.length > 1
            ? `${datasetNames.join('_')}_${Date.now()}`
            : datasetNames[0];

        const parsedData = await processFileData({
          content: {data: mergedResult, fileName: datasetName},
          fileCache: []
        });

        ctx.dispatch(
          addDataToMap({
            datasets: parsedData,
            options: {autoCreateLayers: true, centerMap: true}
          })
        );

        return {
          success: true,
          savedDatasetName: datasetName,
          details: `Successfully saved dataset: ${datasetName} in kepler.gl`
        };
      } catch (error) {
        return {
          success: false,
          error: `Cannot save data to kepler.gl: ${error}`
        };
      }
    }
  });
}
