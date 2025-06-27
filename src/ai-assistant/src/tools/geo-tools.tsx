// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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
  buffer,
  BufferTool,
  centroid,
  CentroidTool,
  dissolve,
  DissolveTool,
  length,
  area,
  perimeter,
  grid,
  GridTool,
  standardizeVariable,
  StandardizeVariableTool,
  thiessenPolygons,
  ThiessenPolygonsTool,
  minimumSpanningTree,
  MinimumSpanningTreeTool,
  cartogram,
  CartogramTool,
  rate,
  RateTool
} from '@openassistant/geoda';
import {
  getUsStateGeojson,
  getUsCountyGeojson,
  getUsZipcodeGeojson,
  queryUSZipcodes,
  geocoding,
  routing,
  isochrone,
  IsochroneTool,
  RoutingTool,
  roads,
  GetUsStateGeojsonTool,
  GetUsCountyGeojsonTool,
  GetUsZipcodeGeojsonTool
} from '@openassistant/osm';
import {
  SpatialJoinComponent,
  DataTableComponent,
  DataTableComponentProps
} from '@openassistant/tables';
import {ToolCache} from '@openassistant/utils';
import {Datasets} from '@kepler.gl/table';
import {Layer} from '@kepler.gl/layers';
import {addDataToMap} from '@kepler.gl/actions';

import {LisaToolComponent} from './lisa-tool';
import {appendColumnsToDataset, getGeometriesFromDataset, getValuesFromDataset} from './utils';
import {AiAssistantState} from '../reducers';
import {State} from '../components/ai-assistant-manager';

export function getGeoTools(
  aiAssistant: AiAssistantState,
  datasets: Datasets,
  layers: Layer[],
  layerData: any[]
) {
  // tool cache
  const toolCache = ToolCache.getInstance();

  // context for geo tools
  const getValues = async (datasetName: string, variableName: string) => {
    const values = getValuesFromDataset(datasets, layers, datasetName, variableName);
    return values as number[];
  };

  const getGeometries = async (datasetName: string) => {
    let geoms = getGeometriesFromDataset(datasets, layers, layerData, datasetName);

    if (geoms.length === 0) {
      // even though the tool dataset should be saved by 'saveDataToMapTool',
      // we still try to get the dataset from tool cache, e.g. route, isochrone etc.
      const dataset = toolCache.getDataset(datasetName);
      // check if dataset is a GeoJSON object
      if (dataset && dataset.type === 'geojson') {
        geoms = dataset.content.features;
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

  // onToolCompleted
  const onToolCompleted = (toolName: string, result: unknown) => {
    toolCache.addDataset(toolName, result);
  };

  // geo tools
  const classifyTool: DataClassifyTool = {
    ...dataClassify,
    context: {getValues}
  };

  const weightsTool: SpatialWeightsTool = {
    ...spatialWeights,
    context: {getGeometries}
  };

  const globalMoranTool: GlobalMoranTool = {
    ...globalMoran,
    context: {getValues}
  };

  const regressionTool: SpatialRegressionTool = {
    ...spatialRegression,
    context: {getValues}
  };

  const lisaTool: LisaTool = {
    ...lisa,
    context: {getValues},
    component: LisaToolComponent
  };

  const spatialJoinTool: SpatialJoinTool = {
    ...spatialJoin,
    context: {getValues, getGeometries},
    onToolCompleted,
    component: SpatialJoinComponent
  };

  const spatialFilterTool = {
    ...spatialFilter,
    context: {getValues, getGeometries},
    onToolCompleted,
    component: SpatialJoinComponent
  };

  const routingTool: RoutingTool = {
    ...routing,
    context: {getMapboxToken},
    onToolCompleted
  };

  const isochroneTool: IsochroneTool = {
    ...isochrone,
    context: {getMapboxToken},
    onToolCompleted
  };

  const bufferTool: BufferTool = {
    ...buffer,
    context: {getGeometries},
    onToolCompleted
  };

  const centroidTool: CentroidTool = {
    ...centroid,
    context: {getGeometries},
    onToolCompleted
  };

  const dissolveTool: DissolveTool = {
    ...dissolve,
    context: {
      getGeometries,
      getValues
    },
    onToolCompleted
  };

  const roadsTool = {
    ...roads,
    context: {getGeometries},
    onToolCompleted
  };

  const lengthTool = {
    ...length,
    context: {getGeometries}
  };

  const areaTool = {
    ...area,
    context: {getGeometries}
  };

  const perimeterTool = {
    ...perimeter,
    context: {getGeometries}
  };

  const thiessenPolygonsTool: ThiessenPolygonsTool = {
    ...thiessenPolygons,
    context: {getGeometries},
    onToolCompleted
  };

  const minimumSpanningTreeTool: MinimumSpanningTreeTool = {
    ...minimumSpanningTree,
    context: {getGeometries},
    onToolCompleted
  };

  const cartogramTool: CartogramTool = {
    ...cartogram,
    context: {getGeometries, getValues},
    onToolCompleted
  };

  const gridTool: GridTool = {
    ...grid,
    context: {getGeometries},
    onToolCompleted
  };

  const getUsStateTool: GetUsStateGeojsonTool = {
    ...getUsStateGeojson,
    onToolCompleted
  };

  const getUsCountyTool: GetUsCountyGeojsonTool = {
    ...getUsCountyGeojson,
    onToolCompleted
  };

  const getUsZipcodeTool: GetUsZipcodeGeojsonTool = {
    ...getUsZipcodeGeojson,
    onToolCompleted
  };

  const standardizeVariableTool: StandardizeVariableTool = {
    ...standardizeVariable,
    context: {getValues},
    component: CustomDataTableComponent
  };

  const rateTool: RateTool = {
    ...rate,
    context: {getValues},
    component: CustomDataTableComponent
  };

  return {
    classifyTool,
    weightsTool,
    globalMoranTool,
    regressionTool,
    lisaTool,
    spatialJoinTool,
    spatialFilterTool,
    gridTool,
    bufferTool,
    centroidTool,
    dissolveTool,
    lengthTool,
    areaTool,
    perimeterTool,
    getUsStateTool,
    getUsCountyTool,
    getUsZipcodeTool,
    queryUSZipcodes,
    geocoding,
    routing: routingTool,
    isochrone: isochroneTool,
    roads: roadsTool,
    standardizeVariable: standardizeVariableTool,
    thiessenPolygons: thiessenPolygonsTool,
    minimumSpanningTree: minimumSpanningTreeTool,
    cartogram: cartogramTool,
    rate: rateTool
  };
}

/**
 * Customize the DataTableComponent for StandardizeVariableTool and RateTool
 */
function CustomDataTableComponent(props: DataTableComponentProps) {
  const dispatch = useDispatch();
  const datasets = useSelector((state: State) => state.demo.keplerGl.map.visState.datasets);
  const layers = useSelector((state: State) => state.demo.keplerGl.map.visState.layers);
  const {originalDatasetName, datasetName, saveData} = props;

  // get data by datasetName
  const dataset = props[datasetName] as {
    type: string;
    content: Record<string, number[]>;
  };

  const data = dataset?.content;

  useEffect(() => {
    async function saveStandardizedData() {
      // convert column-wise data to a row-wise Record<string, number>[]
      const dataRecord: Record<string, number>[] = [];
      const columnNames = Object.keys(data);
      const numberOfRows = data[columnNames[0]].length;
      for (let i = 0; i < numberOfRows; i++) {
        const row: Record<string, number> = {};
        for (const key of columnNames) {
          row[key] = data[key][i];
        }
        dataRecord.push(row);
      }

      const processedData = await appendColumnsToDataset(
        datasets,
        layers,
        originalDatasetName,
        dataRecord,
        datasetName
      );
      dispatch(
        addDataToMap({datasets: processedData, options: {autoCreateLayers: true, centerMap: false}})
      );
    }
    if (saveData) {
      saveStandardizedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <DataTableComponent {...props} />;
}
