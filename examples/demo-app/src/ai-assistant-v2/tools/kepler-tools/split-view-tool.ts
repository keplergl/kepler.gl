import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {toggleSplitMap, toggleLayerForMap} from '@kepler.gl/actions';
import {KeplerContext} from '../../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const splitViewCommandId = 'map.split-view' as const;

export function getSplitViewTool(ctx: KeplerContext): RoomCommand {
  return {
    id: splitViewCommandId,
    name: 'Toggle split map view',
    group: 'Map',
    description: `Enable or disable the dual-map (split view) comparison mode.

When enabled, the map splits into two panels for side-by-side comparison. Pass layerIdsForMap0 / layerIdsForMap1 to assign which layers show ONLY in the left / right panel; without these, all layers show on both panels (no comparison).

When disabled, the map returns to a single panel.

Use the SAME colorBy / colorType for the layers being compared, so the comparison is fair.`,
    inputSchema: z.object({
      action: z
        .enum(['enable', 'disable'])
        .describe('"enable" activates dual map mode; "disable" returns to a single map.'),
      layerIdsForMap0: z
        .array(z.string())
        .optional()
        .describe(
          'Layer IDs to show ONLY in the LEFT panel. Layers not listed are hidden from the left panel.'
        ),
      layerIdsForMap1: z
        .array(z.string())
        .optional()
        .describe(
          'Layer IDs to show ONLY in the RIGHT panel. Layers not listed are hidden from the right panel.'
        )
    }) as any,
    execute: async (_execCtx, input) => {
      const {action, layerIdsForMap0, layerIdsForMap1} = (input ?? {}) as {
        action: 'enable' | 'disable';
        layerIdsForMap0?: string[];
        layerIdsForMap1?: string[];
      };
      try {
        const visState = ctx.getVisState();
        const isSplit = visState.splitMaps && visState.splitMaps.length > 1;

        if (action === 'disable') {
          if (isSplit) {
            ctx.dispatch(toggleSplitMap(0));
          }
          return {
            success: true,
            commandId: splitViewCommandId,
            data: {details: 'Split map view disabled. Returned to single map view.'}
          };
        }

        // enable
        if (!isSplit) {
          ctx.dispatch(toggleSplitMap(0));
        }

        const hasLayerAssignment =
          (layerIdsForMap0 && layerIdsForMap0.length > 0) ||
          (layerIdsForMap1 && layerIdsForMap1.length > 0);

        if (hasLayerAssignment) {
          await sleep(200);
          const updatedVis = ctx.getVisState();
          const splitMaps = updatedVis.splitMaps;

          if (splitMaps && splitMaps.length > 1) {
            const allLayers = updatedVis.layers || [];
            const allLayerIds = allLayers.map((l: any) => l.id);

            if (layerIdsForMap0 && layerIdsForMap0.length > 0) {
              const map0Layers = splitMaps[0]?.layers || {};
              const desiredSet0 = new Set(layerIdsForMap0);
              for (const layerId of allLayerIds) {
                const isVisible = map0Layers[layerId];
                const shouldBeVisible = desiredSet0.has(layerId);
                if (isVisible !== shouldBeVisible) {
                  ctx.dispatch(toggleLayerForMap(0, layerId));
                }
              }
            }

            if (layerIdsForMap1 && layerIdsForMap1.length > 0) {
              const freshSplitMaps = ctx.getVisState().splitMaps;
              const map1Layers = freshSplitMaps?.[1]?.layers || {};
              const desiredSet1 = new Set(layerIdsForMap1);
              for (const layerId of allLayerIds) {
                const isVisible = map1Layers[layerId];
                const shouldBeVisible = desiredSet1.has(layerId);
                if (isVisible !== shouldBeVisible) {
                  ctx.dispatch(toggleLayerForMap(1, layerId));
                }
              }
            }
          }
        }

        const finalVis = ctx.getVisState();
        const layers = finalVis.layers || [];

        return {
          success: true,
          commandId: splitViewCommandId,
          data: {
            details: `Split map view enabled. ${layers.length} layer(s) available.${
              hasLayerAssignment
                ? ` Left panel: ${(layerIdsForMap0 || []).length} layer(s), Right panel: ${(layerIdsForMap1 || []).length} layer(s).`
                : ' All layers visible on both panels. Provide layerIdsForMap0/layerIdsForMap1 to assign layers to each panel.'
            }`
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: splitViewCommandId,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: {
            instruction:
              'Check that a map is loaded and layers exist. If the error persists, ask the user to try with different parameters.'
          }
        };
      }
    }
  };
}