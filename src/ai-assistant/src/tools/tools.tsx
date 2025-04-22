import {SpatialJoinGeometries} from '@openassistant/geoda';
import {SelectedKeplerGlActions} from '../components/ai-assistant-manager';
import {MapStyle} from '@kepler.gl/reducers';
import {VisState} from '@kepler.gl/schemas';
import {basemapFunctionDefinition} from './basemap-functions';
import {loadUrlFunctionDefinition} from './loadurl-function';
import {addLayerFunctionDefinition} from './layer-creation-function';
import {updateLayerColorFunctionDefinition} from './layer-style-function';
import {histogramFunctionDefinition, scatterplotFunctionDefinition} from '@openassistant/echarts';
import {dataClassifyFunctionDefinition, spatialCountFunctionDefinition} from '@openassistant/geoda';
import {
  getGeometriesFromDataset,
  getScatterplotValuesFromDataset,
  getValuesFromDataset,
  highlightRows,
  saveAsDataset
} from './utils';

export function setupLLMFunctions({
  visState,
  keplerGlActions,
  mapStyle
}: {
  visState: VisState;
  keplerGlActions: SelectedKeplerGlActions;
  mapStyle: MapStyle;
}) {
  // get values from dataset, used by LLM functions
  const getValuesCallback = async (datasetName: string, variableName: string): Promise<number[]> =>
    getValuesFromDataset(visState.datasets, datasetName, variableName);

  // highlight rows, used by LLM functions and plots (scatterplot, histogram)
  const highlightRowsCallback = (datasetName: string, selectedRowIndices: number[]) =>
    highlightRows(
      visState.datasets,
      visState.layers,
      datasetName,
      selectedRowIndices,
      keplerGlActions.layerSetIsValid
    );

  // define LLM functions
  return [
    basemapFunctionDefinition({mapStyleChange: keplerGlActions.mapStyleChange, mapStyle}),
    loadUrlFunctionDefinition({
      addDataToMap: keplerGlActions.addDataToMap,
      loaders: visState.loaders,
      loadOptions: visState.loadOptions
    }),
    addLayerFunctionDefinition({
      addLayer: keplerGlActions.addLayer,
      datasets: visState.datasets
    }),
    updateLayerColorFunctionDefinition({
      layerVisualChannelConfigChange: keplerGlActions.layerVisualChannelConfigChange,
      layers: visState.layers
    }),
    histogramFunctionDefinition({
      getValues: getValuesCallback,
      onSelected: highlightRowsCallback
    }),
    scatterplotFunctionDefinition({
      getValues: async (datasetName: string, xVar: string, yVar: string) =>
        getScatterplotValuesFromDataset(visState.datasets, datasetName, xVar, yVar),
      onSelected: highlightRowsCallback
    }),
    dataClassifyFunctionDefinition({
      getValues: getValuesCallback
    }),
    spatialCountFunctionDefinition({
      getValues: getValuesCallback,
      getGeometries: (datasetName: string): SpatialJoinGeometries =>
        getGeometriesFromDataset(
          visState.datasets,
          visState.layers,
          visState.layerData,
          datasetName
        ),
      saveAsDataset: (datasetName: string, data: Record<string, number[]>) =>
        saveAsDataset(visState.datasets, datasetName, data, keplerGlActions.addDataToMap)
    })
  ];
}
