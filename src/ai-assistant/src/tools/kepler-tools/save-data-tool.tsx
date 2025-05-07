import {tool} from '@openassistant/utils';
import {getCachedData, generateId, removeCachedData} from '@openassistant/osm';
import {z} from 'zod';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {processFileData} from '@kepler.gl/processors';
import {addDataToMap} from '@kepler.gl/actions';
import {FeatureCollection} from 'geojson';

export const saveDataToMap = tool({
  description:
    'Save data generated from other tools e.g. buffer, zipcode, county, state, isochrone, etc. to kepler.gl. Please avoid using blank space or special characters in the saveDatasetName.',
  parameters: z.object({
    datasetNames: z.array(z.string()),
    saveDatasetName: z.string()
  }),
  execute: async (args: {datasetNames: string[]; saveDatasetName?: string | null}) => {
    try {
      const {datasetNames, saveDatasetName} = args;
      const loadedDatasetNames: string[] = [];
      const result: FeatureCollection[] = [];

      for (const datasetName of datasetNames) {
        const geoms = getCachedData(datasetName);
        if (geoms) {
          // TODO: the geoms could be BinaryGeometry here
          result.push(geoms as FeatureCollection);
          loadedDatasetNames.push(datasetName);
          // remove the dataset from the cache
          removeCachedData(datasetName);
        }
      }

      if (result.length === 0) {
        throw new Error(`Can not save dataset, No datasets found from ${datasetNames.join(', ')}`);
      }

      // create a unique id for the combined datasets
      const datasetId = saveDatasetName ? `${saveDatasetName}_${generateId()}` : generateId();

      return {
        llmResult: {
          success: true,
          savedDatasetName: datasetId,
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

  return null;
}
