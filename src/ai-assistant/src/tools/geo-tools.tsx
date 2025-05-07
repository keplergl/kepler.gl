import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {
  dataClassify,
  DataClassifyTool,
  spatialWeights,
  SpatialWeightsTool,
  globalMoran,
  GlobalMoranTool,
  spatialRegression,
  SpatialRegressionTool,
  lisa,
  LisaTool,
  spatialJoin,
  SpatialJoinTool,
  spatialFilter,
  SpatialJoinToolComponent,
  buffer,
  centroid,
  dissolve,
  length,
  area,
  perimeter
} from '@openassistant/geoda';
import {
  getUsStateGeojson,
  getUsCountyGeojson,
  getUsZipcodeGeojson,
  queryUSZipcodes,
  geocoding,
  routing,
  isochrone,
  getCachedData,
  IsochroneTool,
  RoutingTool
} from '@openassistant/osm';
import {Datasets} from '@kepler.gl/table';
import {Layer} from '@kepler.gl/layers';
import {processFileData} from '@kepler.gl/processors';
import {addDataToMap} from '@kepler.gl/actions';

import {LisaToolComponent} from './lisa-tool';
import {getGeometriesFromDataset, getValuesFromDataset} from './utils';
import {AiAssistantState} from '../reducers';

export function getGeoTools(
  aiAssistant: AiAssistantState,
  datasets: Datasets,
  layers: Layer[],
  layerData: any[]
) {
  // context for geo tools
  const getValues = async (datasetName: string, variableName: string) => {
    const values = getValuesFromDataset(datasets, layers, datasetName, variableName);
    return values as number[];
  };

  const getGeometries = async (datasetName: string) => {
    let geoms = getGeometriesFromDataset(datasets, layers, layerData, datasetName);
    if (geoms.length === 0) {
      // get the geoms from the cache
      const geojson = getCachedData(datasetName);
      if (geojson && 'features' in geojson) {
        geoms = geojson.features;
      }
    }
    return geoms;
  };

  const getMapboxToken = () => {
    if (aiAssistant.config.mapboxToken) {
      return aiAssistant.config.mapboxToken;
    }
    throw new Error('Mapbox token is not provided');
  };

  // geo tools
  const classifyTool: DataClassifyTool = {
    ...dataClassify,
    context: {
      ...dataClassify.context,
      getValues
    }
  };

  const weightsTool: SpatialWeightsTool = {
    ...spatialWeights,
    context: {
      ...spatialWeights.context,
      getGeometries
    }
  };

  const globalMoranTool: GlobalMoranTool = {
    ...globalMoran,
    context: {
      ...globalMoran.context,
      getValues
    }
  };

  const regressionTool: SpatialRegressionTool = {
    ...spatialRegression,
    context: {
      ...spatialRegression.context,
      getValues
    }
  };

  const lisaTool: LisaTool = {
    ...lisa,
    context: {
      ...lisa.context,
      getValues
    },
    component: LisaToolComponent
  };

  const spatialJoinTool: SpatialJoinTool = {
    ...spatialJoin,
    context: {
      ...spatialJoin.context,
      getValues,
      getGeometries
    },
    component: CustomSpatialJoinToolComponent
  };

  const spatialFilterTool = {
    ...spatialFilter,
    context: {
      ...spatialFilter.context,
      getValues,
      getGeometries
    },
    component: CustomSpatialJoinToolComponent
  };

  const routingTool: RoutingTool = {
    ...routing,
    context: {
      ...routing.context,
      getMapboxToken
    }
  };

  const isochroneTool: IsochroneTool = {
    ...isochrone,
    context: {
      ...isochrone.context,
      getMapboxToken
    }
  };

  return {
    classifyTool,
    weightsTool,
    globalMoranTool,
    regressionTool,
    lisaTool,
    spatialJoinTool,
    spatialFilterTool,
    buffer,
    centroid,
    dissolve,
    length,
    area,
    perimeter,
    getUsStateGeojson,
    getUsCountyGeojson,
    getUsZipcodeGeojson,
    queryUSZipcodes,
    geocoding,
    routing: routingTool,
    isochrone: isochroneTool
  };
}

/**
 * Use SpatialJoinToolComponent to add the join result to kepler.gl
 */
function CustomSpatialJoinToolComponent(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function addJoinedDatasetToMap() {
      if (props.joinedDatasetId && props.joinedDataset) {
        // add the joined dataset to kepler.gl
        const parsedData = await processFileData({
          content: {
            data: props.joinedDataset,
            fileName: props.joinedDatasetId
          },
          fileCache: []
        });

        dispatch(
          addDataToMap({datasets: parsedData, options: {autoCreateLayers: true, centerMap: false}})
        );
      }
    }
    addJoinedDatasetToMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <SpatialJoinToolComponent {...props} />;
}
