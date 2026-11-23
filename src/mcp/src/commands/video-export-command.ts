// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import type {KeplerContext, RoomCommand} from './types';
import {asInputSchema} from './command-wrappers';

const commandId = 'map.export-video';
const dimensions = {
  width: z.number().int().positive(),
  height: z.number().int().positive()
};
const settingsSchema = z.object({
  ...dimensions,
  durationMs: z.number().positive(),
  frameRate: z.literal(30),
  format: z.enum(['webm', 'webm-native']),
  cameraAnimation: z.boolean().optional(),
  dataAnimation: z.boolean().optional()
});
// MCP tools require an object at the schema root. The action schema below
// enforces the conditional fields when a host invokes execute directly.
const inputSchema = z.object({
  action: z.enum(['capabilities', 'start', 'status', 'cancel', 'read']),
  width: dimensions.width.optional(),
  height: dimensions.height.optional(),
  settings: settingsSchema.optional(),
  jobId: z.string().min(1).optional(),
  offset: z.number().int().nonnegative().optional()
});
const actionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('capabilities'),
    width: dimensions.width.optional(),
    height: dimensions.height.optional()
  }),
  z.object({
    action: z.literal('start'),
    settings: settingsSchema
  }),
  z.object({action: z.literal('status'), jobId: z.string().min(1)}),
  z.object({action: z.literal('cancel'), jobId: z.string().min(1)}),
  z.object({
    action: z.literal('read'),
    jobId: z.string().min(1),
    offset: z.number().int().nonnegative().optional()
  })
]);

export function getVideoExportCommand(ctx: KeplerContext): RoomCommand {
  return {
    id: commandId,
    name: 'Export map video',
    group: 'Map',
    description: `Render a video with the connected map's native renderer, without opening a dialog. First use action "capabilities" (optionally width and height) to discover supported formats, dimensions and frame rates. Use "start" with settings {width,height,durationMs,frameRate,format,cameraAnimation?,dataAnimation?}; it returns a jobId immediately. Animation flags default to true and use the project's authored camera tour and data animation. Poll "status" with jobId for progress and terminal status; use "cancel" to stop. A successful job returns an artifact. The MCP bridge exposes the finished video as a downloadable resource; browser hosts can use its blob URL. "read" transfers bounded base64 chunks from an artifact, advancing offset to nextOffset until totalBytes. Jobs and artifacts expire when the map closes or the bounded retention limit is reached.`,
    metadata: {readOnly: false, idempotent: false, riskLevel: 'low'},
    inputSchema: asInputSchema(inputSchema),
    execute: async (context, input) => {
      try {
        const parsed = actionSchema.safeParse(input);
        if (!parsed.success) {
          throw new Error(
            `Invalid video export input: ${parsed.error.issues
              .map(issue => `${issue.path.join('.')}: ${issue.message}`)
              .join('; ')}`
          );
        }
        const args = parsed.data;
        const service = ctx.videoExport;
        if (!service) {
          if (args.action === 'capabilities') {
            return {
              success: true,
              commandId,
              data: {
                available: false,
                formats: [],
                dimensions: [],
                frameRates: [],
                reason:
                  'The connected host has not registered a native video renderer. Update or reconnect the map application.'
              }
            };
          }
          throw new Error(
            'The connected host has not registered a native video renderer. Update or reconnect the map application.'
          );
        }
        let data;
        switch (args.action) {
          case 'capabilities':
            if ((args.width === undefined) !== (args.height === undefined)) {
              throw new Error('Provide both width and height when probing video capabilities.');
            }
            data = await service.getCapabilities(
              args.width === undefined ? undefined : {width: args.width, height: args.height!}
            );
            break;
          case 'start':
            if (context.signal?.aborted) {
              throw new Error('Video export start was cancelled. Start a new export when ready.');
            }
            data = await service.start(args.settings);
            // A transport can abort while the renderer's capabilities/modules
            // are loading. Do not leave an export running without delivering
            // its job ID. After this call returns, the job owns its lifetime.
            if (context.signal?.aborted) {
              service.cancel(data.jobId);
              throw new Error('Video export start was cancelled. Start a new export when ready.');
            }
            break;
          case 'status':
            data = service.status(args.jobId);
            break;
          case 'cancel':
            data = service.cancel(args.jobId);
            break;
          case 'read':
            data = await service.read(args.jobId, args.offset);
            break;
        }
        return {success: true, commandId, data};
      } catch (error) {
        return {
          success: false,
          commandId,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  };
}
