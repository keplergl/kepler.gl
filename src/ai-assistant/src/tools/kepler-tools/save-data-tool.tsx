import {tool} from '@openassistant/core';
import {getCachedData, generateId, removeCachedData} from '@openassistant/osm';
import {z} from 'zod';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {processFileData} from '@kepler.gl/processors';
import {addDataToMap} from '@kepler.gl/actions';
import {FeatureCollection} from 'geojson';

export const saveDataToMap = tool({
  description:
    'Save data generated from other tools e.g. buffer, zipcode, county, state, isochrone, etc. to kepler.gl',
  parameters: z.object({
    datasetNames: z.array(z.string()),
    saveDatasetName: z
      .string()
      .optional()
      .describe(
        'The name of the dataset to save. Please avoid using blank space or special characters.'
      )
  }),
  execute: async (args: {datasetNames: string[]; saveDatasetName?: string}) => {
    try {
      const {datasetNames, saveDatasetName} = args;
      const loadedDatasetNames: string[] = [];
      const result: FeatureCollection[] = [];

      for (const datasetName of datasetNames) {
        const geoms: FeatureCollection = getCachedData(datasetName);
        if (geoms) {
          result.push(geoms);
          loadedDatasetNames.push(datasetName);
          // remove the dataset from the cache
          removeCachedData(datasetName);
        }
      }

      if (result.length === 0) {
        throw new Error(`Can not save dataset, No datasets found from ${datasetNames.join(', ')}`);
      }

      // create a unique id for the combined datasets
      const datasetId = `${saveDatasetName}_${generateId()}` || generateId();

      return {
        llmResult: {
          success: true,
          details: `Successfully save dataset: ${datasetId} in kepler.gl`
        },
        additionalData: {
          result,
          loadedDatasetNames,
          datasetId
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

export function SaveDataToMapToolComponent({
  result,
  datasetId
}: {
  result: FeatureCollection[];
  datasetId: string;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function addDatasetsToMap() {
      // combine the datasets (FeatureCollection[]) into one FeatureCollection
      const combinedGeojson = result.reduce(
        (acc, geom) => {
          return {
            ...acc,
            features: [...acc.features, ...geom.features]
          };
        },
        {type: 'FeatureCollection', features: []}
      );

      // add the geojson to kepler.gl
      const parsedData = await processFileData({
        content: {
          data: combinedGeojson,
          fileName: `${datasetId}`
        },
        fileCache: []
      });

      // update the id of parsedData
      // parsedData[0].info.id = datasetId;

      dispatch(
        addDataToMap({datasets: parsedData, options: {autoCreateLayers: true, centerMap: false}})
      );
    }
    addDatasetsToMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>UsZipcodeToolComponent</div>;
}
