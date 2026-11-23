// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import type {KeplerContext, RoomCommand} from './types';

const inputSchema = z.object({
  width: z.number().int().min(1).max(8192).describe('Output width in pixels.'),
  height: z.number().int().min(1).max(8192).describe('Output height in pixels.'),
  dataTime: z
    .number()
    .finite()
    .optional()
    .describe(
      'Data timeline timestamp in milliseconds since the Unix epoch; omit to keep current time.'
    ),
  cameraTimeMs: z
    .number()
    .finite()
    .min(0)
    .optional()
    .describe('Elapsed camera-tour time in milliseconds; omit to keep the current camera.')
});

export function getRenderPreviewCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.render-preview';
  return {
    id,
    name: 'Render export preview frame',
    group: 'Map',
    description:
      'Render a PNG frame through the native video-export renderer at exact output dimensions ' +
      'and optional data timestamp and camera-tour position. Includes visible layers, effects ' +
      'and labels, waits for the frame to be ready, and preserves the live viewport and playhead. ' +
      'Dimensions must be integers from 1 to 8192, with at most 33,554,432 total pixels. ' +
      'Requires a host that supports native frame previews.',
    metadata: {readOnly: true, riskLevel: 'low'},
    inputSchema,
    execute: async (execution, input) => {
      try {
        const options = inputSchema.parse(input);
        if (options.width * options.height > 33_554_432) {
          throw new Error('Preview dimensions must not exceed 33,554,432 total pixels.');
        }
        if (execution.signal?.aborted) throw new Error('Preview rendering was cancelled.');
        if (!ctx.renderPreviewFrame) {
          throw new Error(
            'This host does not support native preview rendering. Open a host with renderPreviewFrame support.'
          );
        }
        const image = await ctx.renderPreviewFrame(options, execution.signal);
        if (execution.signal?.aborted) throw new Error('Preview rendering was cancelled.');
        if (
          image.mimeType !== 'image/png' ||
          typeof image.data !== 'string' ||
          !image.data.length ||
          image.width !== options.width ||
          image.height !== options.height
        ) {
          throw new Error('The preview renderer did not return a PNG at the requested dimensions.');
        }
        // Leave headroom beneath the bridge's WebSocket message limit, including JSON metadata.
        if (image.data.length > 64 * 1024 * 1024) {
          throw new Error(
            'The preview PNG is too large to transfer. Reduce the output dimensions and try again.'
          );
        }
        return {success: true, commandId: id, data: {...image, ...options}};
      } catch (error) {
        return {
          success: false,
          commandId: id,
          error: `Cannot render preview frame: ${
            error instanceof Error ? error.message : String(error)
          }`
        };
      }
    }
  };
}
