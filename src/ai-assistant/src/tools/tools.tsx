import {VisState} from '@kepler.gl/schemas';
import {basemap} from './basemap-tool';
import {addLayer, AddLayerTool} from './layer-creation-tool';
import {updateLayerColor} from './layer-style-tool';
import {loadData, LoadDataTool} from './loaddata-tool';
import {
  boxplot,
  BoxplotTool,
  bubbleChart,
  BubbleChartTool,
  histogram,
  HistogramTool,
  pcp,
  PCPTool,
  scatterplot,
  ScatterplotTool
} from '@openassistant/echarts';
import {getValuesFromDataset, highlightRows} from './utils';
import {Datasets} from '@kepler.gl/table';
import {theme as keplerTheme, textColorLT} from '@kepler.gl/styles';
import {Layer} from '@kepler.gl/layers';
import {layerSetIsValid} from '@kepler.gl/actions';
import {Dispatch} from 'redux';

export function setupLLMTools({visState, dispatch}: {visState: VisState; dispatch: Dispatch}) {
  // context for tools
  const getDatasets = () => {
    return visState.datasets;
  };

  const getLayers = () => {
    return visState.layers;
  };

  const getLoaders = () => {
    return {
      loaders: visState.loaders,
      loadOptions: visState.loadOptions
    };
  };

  // tool: addLayer
  const addLayerTool: AddLayerTool = {
    ...addLayer,
    context: {
      getDatasets
    }
  };

  // tool: updateLayerColor
  const updateLayerColorTool = {
    ...updateLayerColor,
    context: {
      getLayers
    }
  };

  // tool: loadData
  const loadDataTool: LoadDataTool = {
    ...loadData,
    context: {
      getLoaders
    }
  };

  return {
    basemap,
    addLayer: addLayerTool,
    updateLayerColor: updateLayerColorTool,
    loadData: loadDataTool,
    ...getEchartsTools(visState.datasets, visState.layers, dispatch)
  };
}

function getEchartsTools(datasets: Datasets, layers: Layer[], dispatch: Dispatch) {
  // context for tools
  const getValues = async (datasetName: string, variableName: string) => {
    const values = getValuesFromDataset(datasets, datasetName, variableName);
    return values;
  };

  const onSelected = (datasetName: string, selectedIndices: number[]) => {
    const triggerLayerReRender = (layer: Layer, isValid: boolean) => {
      dispatch(layerSetIsValid(layer, isValid));
    };
    highlightRows(datasets, layers, datasetName, selectedIndices, triggerLayerReRender);
  };

  const theme = keplerTheme.textColor === textColorLT ? 'light' : 'dark';

  // Create the boxplot tool with the getValues implementation
  const boxplotTool: BoxplotTool = {
    ...boxplot,
    context: {
      ...boxplot.context,
      getValues,
      onSelected,
      config: {
        ...boxplot.context?.config,
        theme
      }
    }
  };

  // Create the bubble chart tool with the getValues implementation
  const bubbleChartTool: BubbleChartTool = {
    ...bubbleChart,
    context: {
      ...bubbleChart.context,
      getValues,
      onSelected,
      config: {
        ...bubbleChart.context?.config,
        theme
      }
    }
  };

  const histogramTool: HistogramTool = {
    ...histogram,
    context: {
      ...histogram.context,
      getValues,
      onSelected,
      config: {
        ...histogram.context?.config,
        theme
      }
    }
  };

  const pcpTool: PCPTool = {
    ...pcp,
    context: {
      ...pcp.context,
      getValues,
      onSelected,
      config: {
        ...pcp.context?.config,
        theme
      }
    }
  };

  const scatterplotTool: ScatterplotTool = {
    ...scatterplot,
    context: {
      ...scatterplot.context,
      getValues,
      onSelected,
      config: {
        ...scatterplot.context?.config,
        theme
      }
    }
  };

  return {
    boxplotTool,
    bubbleChartTool,
    histogramTool,
    pcpTool,
    scatterplotTool
  };
}
