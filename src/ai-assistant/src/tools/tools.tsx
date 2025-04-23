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
import {getValuesFromDataset} from './utils';
import {Datasets} from '@kepler.gl/table';
import {theme as keplerTheme, textColorLT} from '@kepler.gl/styles';

export function setupLLMTools({visState}: {visState: VisState}) {
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
    ...getEchartsTools(visState.datasets)
  };
}

function getEchartsTools(datasets: Datasets) {
  // context for tools
  const getValues = async (datasetName: string, variableName: string) => {
    const values = getValuesFromDataset(datasets, datasetName, variableName);
    return values;
  };
  const theme = keplerTheme.textColor === textColorLT ? 'light' : 'dark';

  // Create the boxplot tool with the getValues implementation
  const boxplotTool: BoxplotTool = {
    ...boxplot,
    context: {
      ...boxplot.context,
      getValues: getValues,
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
      getValues: getValues,
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
      getValues: getValues,
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
      getValues: getValues
    }
  };

  const scatterplotTool: ScatterplotTool = {
    ...scatterplot,
    context: {
      ...scatterplot.context,
      getValues: getValues
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
