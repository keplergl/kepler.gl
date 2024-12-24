// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ActionHandler, addLayer} from '@kepler.gl/actions';
import {LayerClasses} from '@kepler.gl/layers';
import KeplerTable, {Datasets} from '@kepler.gl/table';
import {
  CallbackFunctionProps,
  CustomFunctionCall,
  CustomFunctionContext,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
  RegisterFunctionCallingProps
} from 'react-ai-assist';
import {checkDatasetNotExists, checkFieldNotExists, interpolateColor} from './utils';
import {findDefaultLayer} from '@kepler.gl/reducers';
import React, {useEffect} from 'react';

export function addLayerFunctionDefinition(
  context: CustomFunctionContext<ActionHandler<typeof addLayer> | Datasets>
): RegisterFunctionCallingProps {
  return {
    name: 'addLayer',
    description: 'Add a new map layer by specifying the dataset and field.',
    properties: {
      datasetName: {
        type: 'string',
        description:
          'The name of the dataset. If not provided, use the datasetName of the first dataset. Please do not use datastId.'
      },
      layerType: {
        type: 'string',
        description:
          'The type of the layer. Valid values are "point" (point layer), "arc" (arc layer), "line" (line layer), "grid" (grid layer), "hexagon" (hexagon layer), "geojson" (geojson layer), "cluster" (cluster layer), "heatmap" (heatmap layer), "h3" (h3 layer), "trip" (trip layer) and "s2" (s2 layer). If not provided, the function will try to find the best layer type based on the dataset.'
      },
      fieldName: {
        type: 'string',
        description:
          'The name of the field of the dataset. If not provided, show all field names from the dataset and ask user to specify one.'
      },
      colorScale: {
        type: 'string',
        description:
          'The color scale of the layer. The possible values are "quantile", "quantize", "ordinal" or "custom". If not provided, use "quantile". '
      },
      customColorScale: {
        type: 'array',
        items: {
          type: 'number'
        },
        description:
          'An array of numeric breakpoints used to define custom color intervals. Only applicable when colorScale is set to "custom".'
      }
    },
    required: ['datasetName', 'fieldName', 'colorScale'],
    callbackFunction: addLayerCallback,
    callbackFunctionContext: context,
    callbackMessage: addLayerMessageCallback
  };
}

type AddLayerCallbackArgs = {
  datasetName: string;
  layerType: string;
  fieldName: string;
  colorScale: string;
  customColorScale: number[];
};

type AddLayerFunctionContext = {
  datasets: Datasets;
  addLayer: ActionHandler<typeof addLayer>;
};

type AddLayerCallbackResult = {
  success: boolean;
  layerId: string;
  datasetId: string;
  layerLabel: string;
  layerType: string | null;
  numberOfColors: number;
  details?: string;
};

type OutputResultProps = AddLayerCallbackResult | ErrorCallbackResult;

type OutputDataProps = {
  newLayer: object;
  datasetId: string;
  addLayer: ActionHandler<typeof addLayer>;
};

type AddLayerCallbackOutput = CustomFunctionOutputProps<OutputResultProps, OutputDataProps>;

function addLayerCallback({
  functionName,
  functionArgs,
  functionContext
}: CallbackFunctionProps): AddLayerCallbackOutput {
  const {
    datasetName,
    fieldName,
    layerType,
    colorScale = 'quantile',
    customColorScale
  } = functionArgs as AddLayerCallbackArgs;
  const {datasets, addLayer} = functionContext as AddLayerFunctionContext;

  // check if dataset exists
  const datasetError = checkDatasetNotExists(datasets, datasetName, functionName);
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (datasetError || !datasetId) {
    return datasetError as AddLayerCallbackOutput;
  }

  // check if field exists in the dataset
  const dataset = datasets[datasetId];
  const fieldError = checkFieldNotExists(dataset, fieldName, functionName);
  const field = dataset.fields.find(f => f.name === fieldName);
  if (fieldError || !field) {
    return fieldError as AddLayerCallbackOutput;
  }

  // check colorScale is valid
  if (!['quantile', 'quantize', 'ordinal', 'custom'].includes(colorScale)) {
    return {
      type: 'layer',
      name: functionName,
      result: {
        success: false,
        details: `Invalid color scale: ${colorScale}. The valid values are "quantile", "quantize", "ordinal" or "custom"`
      }
    };
  }

  // check if customColorScale is available
  if (colorScale === 'custom' && !customColorScale) {
    return {
      type: 'layer',
      name: functionName,
      result: {
        success: false,
        details: 'Custom color scale or breaks is required when colorScale is "custom"'
      }
    };
  }

  // check if layerType is valid
  const layer = guessDefaultLayer(dataset, layerType);

  if (!layer) {
    return {
      type: 'layer',
      name: functionName,
      result: {success: false, details: `Invalid layer type: ${layerType}`}
    };
  }

  const colorField = {
    name: field.name,
    type: field.type
  };

  // create custom colorRange if needed
  let customColorRange = layer.config.visConfig.colorRange;
  if (colorScale === 'custom') {
    const newColors = interpolateColor(customColorRange.colors, customColorScale.length + 1);
    customColorRange = {
      ...customColorRange,
      colors: newColors,
      colorMap: newColors.map((color, index) => [customColorScale[index] || null, color])
    };
  }

  // construct new layer config for addLayer() action
  const newLayer = {
    id: layer.id,
    type: layer.type,
    config: {
      ...layer.config,
      dataId: datasetId,
      label: `${field.name}-${colorScale}`,
      columns: Object.keys(layer.config.columns).reduce((acc, key) => {
        acc[key] = layer.config.columns[key].value;
        return acc;
      }, {}),
      colorScale,
      colorField,
      strokeColorScale: colorScale,
      strokeColorField: colorField,
      visConfig: {
        ...layer.config.visConfig,
        colorRange: customColorRange,
        strokeColorRange: customColorRange,
        ...(customColorScale
          ? {colorDomain: customColorScale, strokeColorDomain: customColorScale}
          : {})
      }
    }
  };

  return {
    type: 'layer',
    name: functionName,
    result: {
      success: true,
      layerId: newLayer.id,
      datasetId,
      layerLabel: newLayer.config.label,
      layerType: newLayer.type,
      numberOfColors: customColorRange.colors.length,
      details: `New map layer with ${field.name} and ${colorScale} color scale added successfully.`
    },
    data: {newLayer, datasetId, addLayer}
  };
}

function guessDefaultLayer(dataset: KeplerTable, layerType: string) {
  // special case for hexagon layer, which could be implemented as findDefaultLayerProps() in hexagon-layer.tsx
  if (layerType === 'hexagon') {
    if (dataset.fieldPairs && dataset.fieldPairs.length > 0) {
      const props = dataset.fieldPairs.map(fieldPair => ({
        isVisible: true,
        label: 'Hexbin',
        columns: fieldPair.pair
      }));
      const layer = new LayerClasses.hexagon(props[0]);
      return layer;
    }
  }
  const defaultLayers = findDefaultLayer(dataset, LayerClasses);
  const layer = defaultLayers.find(l => l.type === layerType);
  return layer || defaultLayers.length > 0 ? defaultLayers[0] : null;
}

function AddLayerMessage({output}: CustomFunctionCall) {
  const outputData = output.data as OutputDataProps;

  useEffect(() => {
    outputData?.addLayer?.(outputData.newLayer, outputData.datasetId);
  }, [outputData]);

  return null;
}

function addLayerMessageCallback(props: CustomFunctionCall) {
  return <AddLayerMessage {...props} />;
}
