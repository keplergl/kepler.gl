// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// This file is used to call the LAYER_VISUAL_CHANNEL_CHANGE to update the layer style

import {
  CallbackFunctionProps,
  CustomFunctionContext,
  CustomFunctionOutputProps,
  ErrorCallbackResult
} from 'react-ai-assist';
import {ActionHandler, layerVisualChannelConfigChange} from '@kepler.gl/actions';
import {Layer, LayerBaseConfig} from '@kepler.gl/layers';

export function updateLayerColorFunctionDefinition(
  context: CustomFunctionContext<ActionHandler<typeof layerVisualChannelConfigChange> | Layer[]>
) {
  return {
    name: 'updateLayerColor',
    description: 'Update the color of a layer, e.g. fill color, stroke color.',
    properties: {
      layerId: {
        type: 'string',
        description:
          'The id of the layer to update. This value should be returned from previous function calling tool. Otherwise, use the latest layerId.'
      },
      numberOfColors: {
        type: 'number',
        description:
          'The number of colors to update. The value should be returned from previous function calling tool. Otherwise, use the number of colors in the latest layer.'
      },
      customColors: {
        type: 'array',
        items: {
          type: 'string'
        },
        description:
          'An array of hex color values. Please try to generate colors from user description like: van gogh starry night, water color etc.'
      }
    },
    required: ['layerId', 'numberOfColors', 'customColors'],
    callbackFunction: updateLayerColorCallback,
    callbackFunctionContext: context
  };
}

type UpdateLayerColorArgs = {
  layerId: string;
  numberOfColors: number;
  customColors: string[];
};

type UpdateLayerColorFunctionContext = {
  layers: Layer[];
  layerVisualChannelConfigChange: ActionHandler<typeof layerVisualChannelConfigChange>;
};

type OutputDataProps = {
  layerId: string;
};

type SuccessCallbackResult = {
  success: true;
  details: string;
};

type UpdateLayerColorCallbackOutput = CustomFunctionOutputProps<
  ErrorCallbackResult | SuccessCallbackResult,
  OutputDataProps
>;

function updateLayerColorCallback({
  functionName,
  functionArgs,
  functionContext
}: CallbackFunctionProps): UpdateLayerColorCallbackOutput {
  const {layerId, numberOfColors, customColors} = functionArgs as UpdateLayerColorArgs;
  const {layers, layerVisualChannelConfigChange} =
    functionContext as UpdateLayerColorFunctionContext;

  // get layer from visState by layerId
  const layer = layers.find(l => l.id === layerId);
  if (!layer) {
    return {
      type: 'layer',
      name: functionName,
      result: {
        success: false,
        details: `Layer with id ${layerId} not found`
      }
    };
  }

  // verify numberOfColors is equal to customColors.length
  if (numberOfColors !== customColors.length) {
    return {
      type: 'layer',
      name: functionName,
      result: {
        success: false,
        details: `customColors array must contain exactly ${numberOfColors} colors`
      }
    };
  }

  const channel = 'color';

  const newConfig = {
    // colorScale: 'custom'
  } as Partial<LayerBaseConfig>;

  const oldColorRange = layer.config.visConfig.colorRange;
  const newColorRange = {
    ...oldColorRange,
    colors: customColors,
    ...(oldColorRange.colorMap
      ? {
          colorMap: [...oldColorRange.colorMap.map((c, i) => [c[0], customColors[i]])]
        }
      : {})
  };

  const newVisConfig = {
    colorRange: newColorRange,
    strokeColorRange: newColorRange
  };

  layerVisualChannelConfigChange(layer, newConfig, channel, newVisConfig);

  return {
    type: 'updateLayer',
    name: functionName,
    result: {
      success: true,
      details: `Color updated successfully to ${customColors.join(', ')} for layer ${layerId}`
    }
  };
}
