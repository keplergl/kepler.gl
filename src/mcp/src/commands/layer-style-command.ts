import type {RoomCommand} from './types';
import {z} from 'zod';
import {layerVisualChannelConfigChange} from '@kepler.gl/actions';
import type {KeplerContext} from './types';

export const updateLayerColorCommandId = 'map.update-layer-color' as const;

export function getUpdateLayerColorCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: updateLayerColorCommandId,
    name: 'Update layer color',
    group: 'Map',
    description: 'Update the color palette of an existing layer.',
    metadata: {readOnly: false, riskLevel: 'low', idempotent: true},
    inputSchema: z.object({
      layerId: z.string(),
      numberOfColors: z.number(),
      customColors: z
        .array(z.string())
        .describe(
          'An array of hex color values. Try to generate colors from user description like: van gogh starry night, water color etc.'
        )
    }) as any,
    execute: async (_execCtx, input) => {
      const {layerId, numberOfColors, customColors} = (input ?? {}) as {
        layerId: string;
        numberOfColors: number;
        customColors: string[];
      };
      try {
        // Runtime guards: the bridge/webMCP call execute without zod parsing,
        // so missing/wrong-typed inputs must fail with actionable errors
        // instead of a TypeError (e.g. reading `.length` of undefined).
        if (typeof layerId !== 'string' || layerId.length === 0) {
          throw new Error('layerId is required and must be a string.');
        }
        if (typeof numberOfColors !== 'number' || !Number.isFinite(numberOfColors)) {
          throw new Error('numberOfColors is required and must be a number.');
        }
        if (!Array.isArray(customColors) || customColors.some(c => typeof c !== 'string')) {
          throw new Error('customColors is required and must be an array of hex color strings.');
        }

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
        if (oldColorRange.colorMap && customColors.length !== oldColorRange.colorMap.length) {
          throw new Error(
            `Layer ${layerId} has ${oldColorRange.colorMap.length} classes (custom colorMap); provide exactly ${oldColorRange.colorMap.length} colors, got ${customColors.length}.`
          );
        }
        const newColorRange = {
          ...oldColorRange,
          colors: customColors,
          ...(oldColorRange.colorMap
            ? {
                colorMap: [
                  ...oldColorRange.colorMap.map((c: any, i: number) => [c[0], customColors[i]])
                ]
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
          commandId: updateLayerColorCommandId,
          data: {details: `Color updated to ${customColors.join(', ')} for layer ${layerId}`}
        };
      } catch (error) {
        return {
          success: false,
          commandId: updateLayerColorCommandId,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: {
            instruction:
              'Try to fix the error. If the error persists, ask the user to try with different parameters.'
          }
        };
      }
    }
  };
}
