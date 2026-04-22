// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool} from 'ai';
import {z} from 'zod';
import {layerVisualChannelConfigChange} from '@kepler.gl/actions';
import {KeplerContext} from '../../types';

export function getUpdateLayerColorTool(ctx: KeplerContext) {
  return tool({
    description: 'Update the color palette of an existing layer.',
    inputSchema: z.object({
      layerId: z.string(),
      numberOfColors: z.number(),
      customColors: z
        .array(z.string())
        .describe(
          'An array of hex color values. Try to generate colors from user description like: van gogh starry night, water color etc.'
        )
    }),
    execute: async ({layerId, numberOfColors, customColors}) => {
      try {
        const visState = ctx.getVisState();
        const layers = visState.layers;
        const layer = layers.find(l => l.id === layerId);
        if (!layer) {
          throw new Error(`Layer with id ${layerId} not found`);
        }

        if (numberOfColors !== customColors.length) {
          throw new Error(`customColors array must contain exactly ${numberOfColors} colors`);
        }

        const channel = 'color';
        const newConfig = {};

        const oldColorRange = layer.config.visConfig.colorRange;
        const newColorRange = {
          ...oldColorRange,
          colors: customColors,
          ...(oldColorRange.colorMap
            ? {
                colorMap: [...oldColorRange.colorMap.map((c: any, i: number) => [c[0], customColors[i]])]
              }
            : {})
        };

        const newVisConfig = {
          colorRange: newColorRange,
          strokeColorRange: newColorRange
        };

        ctx.dispatch(layerVisualChannelConfigChange(layer, newConfig, channel, newVisConfig));

        return {
          success: true,
          details: `Color updated to ${customColors.join(', ')} for layer ${layerId}`
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          instruction:
            'Try to fix the error. If the error persists, ask the user to try with different parameters.'
        };
      }
    }
  });
}
