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
  getGeoDaCachedData
} from '@openassistant/geoda';
import {
  getUsStateGeojson,
  getUsCountyGeojson,
  getUsZipcodeGeojson,
  queryUSZipcodes,
  geocoding,
  routing,
  isochrone,
  getCachedData
} from '@openassistant/osm';
import {Datasets} from '@kepler.gl/table';
import {Layer} from '@kepler.gl/layers';
import {Dispatch} from 'redux';

import {LisaToolComponent} from './lisa-tool';
import {getGeometriesFromDataset, getValuesFromDataset} from './utils';
import {AiAssistantState} from '../reducers';

export function getGeoTools(
  aiAssistant: AiAssistantState,
  datasets: Datasets,
  layers: Layer[],
  layerData: any[],
  dispatch: Dispatch
) {
  // context for geo tools
  const getValues = async (datasetName: string, variableName: string) => {
    const values = getValuesFromDataset(datasets, layers, datasetName, variableName);
    return values;
  };

  const getGeometries = async (datasetName: string) => {
    let geoms = getGeometriesFromDataset(datasets, layers, layerData, datasetName);
    if (geoms.length === 0) {
      // get the geoms from the cache
      let geojson = getCachedData(datasetName);
      if (geojson) {
        geoms = geojson.features;
      } else {
        geojson = getGeoDaCachedData(datasetName);
        if (geojson) {
          geoms = geojson.features;
        }
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
    }
  };

  const routingTool = {
    ...routing,
    context: {
      ...routing.context,
      getMapboxToken
    }
  };

  const isochroneTool = {
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
    getUsStateGeojson,
    getUsCountyGeojson,
    getUsZipcodeGeojson,
    queryUSZipcodes,
    geocoding,
    routing: routingTool,
    isochrone: isochroneTool
  };
}
