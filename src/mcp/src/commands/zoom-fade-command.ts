// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {interactionConfigChange} from '@kepler.gl/actions';
import {getZoomOpacityAnnotationTargetId} from '@kepler.gl/reducers';
import type {KeplerContext, RoomCommand} from './types';

const zoom = z.number().min(0).max(24);
const inputSchema = z.object({
  enabled: z.boolean(),
  controllers: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        layerIds: z.array(z.string()).default([]),
        annotationIds: z.array(z.string()).default([]),
        stops: z.object({appear: zoom, full: zoom, fade: zoom, gone: zoom})
      })
    )
    .optional()
    .describe('Replaces the controller list. Omit to only toggle; [] clears it.')
});

export function getZoomFadeCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.set-zoom-fade';
  return {
    id,
    name: 'Set fade on zoom',
    group: 'Map',
    description:
      'Enable/disable zoom fades or replace their controllers. Each layer/annotation can belong ' +
      'to only one controller. Stops must satisfy 0 <= appear <= full <= fade <= gone <= 24. ' +
      'Preserves other interactions and each layer’s own opacity.',
    metadata: {readOnly: false, idempotent: true, riskLevel: 'low'},
    inputSchema,
    execute: (_execution, input) => {
      try {
        const args = inputSchema.parse(input);
        const state = ctx.getVisState();
        const previous = state.interactionConfig?.zoomOpacity;
        const ids = new Set<string>();
        const targets = new Set<string>();
        const controllers =
          args.controllers?.map(controller => {
            const {appear, full, fade, gone} = controller.stops;
            if (appear > full || full > fade || fade > gone) {
              throw new Error('Zoom stops must satisfy appear <= full <= fade <= gone.');
            }
            if (ids.has(controller.id))
              throw new Error(`Duplicate controller id: ${controller.id}.`);
            ids.add(controller.id);
            for (const layerId of controller.layerIds) {
              if (!state.layers.some(layer => layer.id === layerId))
                throw new Error(`Layer "${layerId}" not found.`);
            }
            for (const annotationId of controller.annotationIds) {
              if (!state.annotations?.some(annotation => annotation.id === annotationId))
                throw new Error(`Annotation "${annotationId}" not found.`);
            }
            const layerIds = [
              ...controller.layerIds,
              ...controller.annotationIds.map(getZoomOpacityAnnotationTargetId)
            ];
            for (const target of layerIds) {
              if (targets.has(target))
                throw new Error(`Target "${target}" belongs to more than one controller.`);
              targets.add(target);
            }
            return {id: controller.id, layerIds, stops: controller.stops};
          }) ??
          previous?.config?.controllers ??
          [];
        const interaction = {
          ...previous,
          id: 'zoomOpacity' as const,
          enabled: args.enabled,
          config: {...previous?.config, controllers}
        };
        ctx.dispatch(interactionConfigChange(interaction));
        return {success: true, commandId: id, data: interaction};
      } catch (error) {
        return {
          success: false,
          commandId: id,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  };
}
