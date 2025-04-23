// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useDispatch} from 'react-redux';
import {LayerClasses} from '@kepler.gl/layers';
import KeplerTable, {Datasets} from '@kepler.gl/table';
import {findDefaultLayer} from '@kepler.gl/reducers';
import {addLayer as addLayerAction} from '@kepler.gl/actions';
import {interpolateColor} from './utils';
import {tool} from '@openassistant/core';
import {z} from 'zod';
import {useEffect} from 'react';

export const addLayer = tool<
  // parameters
  z.ZodObject<{
    datasetName: z.ZodString;
    fieldName: z.ZodString;
    layerType: z.ZodEnum<
      [
        'point',
        'arc',
        'line',
        'grid',
        'hexagon',
        'geojson',
        'cluster',
        'heatmap',
        'h3',
        'trip',
        's2'
      ]
    >;
    colorScale: z.ZodOptional<z.ZodEnum<['quantile', 'quantize', 'ordinal', 'custom']>>;
    customColorScale: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
  }>,
  // return type
  ExecuteAddLayerResult['llmResult'],
  // additional data
  ExecuteAddLayerResult['additionalData'],
  // context
  AddLayerFunctionContext
>({
  description: 'add a kepler.gl map layer',
  parameters: z.object({
    datasetName: z
      .string()
      .describe('The name of the dataset. Note: please do NOT use the datasetId.'),
    fieldName: z.string(),
    layerType: z.enum([
      'point',
      'arc',
      'line',
      'grid',
      'hexagon',
      'geojson',
      'cluster',
      'heatmap',
      'h3',
      'trip',
      's2'
    ]),
    colorScale: z.enum(['quantile', 'quantize', 'ordinal', 'custom']).optional(),
    customColorScale: z
      .array(z.number())
      .optional()
      .describe(
        'An array of numeric breakpoints used to define custom color intervals. Only applicable when colorScale is set to "custom"'
      )
  }),
  execute: executeAddLayer,
  component: AddLayerToolComponent
});

export type AddLayerTool = typeof addLayer;

type AddLayerArgs = {
  datasetName: string;
  layerType: string;
  fieldName: string;
  colorScale: string;
  customColorScale: Array<[number, string]>;
};

function isAddLayerArgs(args: any): args is AddLayerArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'datasetName' in args &&
    'fieldName' in args &&
    'layerType' in args
  );
}

type AddLayerFunctionContext = {
  getDatasets: () => Datasets;
};

function isAddLayerFunctionContext(context: any): context is AddLayerFunctionContext {
  return context && typeof context.getDatasets === 'function';
}

type ExecuteAddLayerResult = {
  llmResult: {
    success: boolean;
    layer?: string;
    details?: string;
    error?: string;
    instruction?: string;
  };
  additionalData?: {
    layer: object;
    datasetId: string;
  };
};

async function executeAddLayer(args, options): Promise<ExecuteAddLayerResult> {
  try {
    if (!isAddLayerArgs(args)) {
      throw new Error('Invalid addLayer arguments');
    }

    if (!isAddLayerFunctionContext(options.context)) {
      throw new Error('Invalid addLayer context');
    }

    const {datasetName, fieldName, layerType, colorScale = 'quantile', customColorScale} = args;

    const datasets = options.context.getDatasets();

    // check if dataset exists in kepler.gl
    const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
    if (!datasetId) {
      throw new Error(`Dataset ${datasetName} not found.`);
    }

    // check if field exists in the dataset
    const dataset = datasets[datasetId];
    const field = dataset.fields.find(f => f.name === fieldName);
    if (!field) {
      throw new Error(`Field ${fieldName} not found.`);
    }

    // check colorScale is valid
    if (!['quantile', 'quantize', 'ordinal', 'custom'].includes(colorScale)) {
      throw new Error(`Invalid color scale: ${colorScale}.`);
    }

    // check if customColorScale is available
    if (colorScale === 'custom' && !customColorScale) {
      throw new Error('Custom color scale or breaks is required when colorScale is "custom".');
    }

    // check if layerType is valid
    const layer = guessDefaultLayer(dataset, layerType);

    if (!layer) {
      throw new Error(`Invalid layer type: ${layerType}.`);
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
      llmResult: {
        success: true,
        layer: JSON.stringify(newLayer),
        details: `map layer with ${field.name} and ${colorScale} color scale will be added to the map.`
      },
      additionalData: {
        layer: newLayer,
        datasetId
      }
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        instruction:
          'Try to fix the error. If the error persists, pause the execution and ask the user to try with different prompt and context.'
      }
    };
  }
}

export function guessDefaultLayer(dataset: KeplerTable, layerType: string) {
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

export function AddLayerToolComponent({layer, datasetId}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addLayerAction(layer, datasetId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
