// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {removeDataset, removeLayer, reorderLayer} from '@kepler.gl/actions';
import {
  getFlatLayerOrder,
  getLayerGroupFromLayerOrder,
  getNewLayerGroup
} from '@kepler.gl/reducers';
import type {LayerOrder} from '@kepler.gl/types';
import type {KeplerContext, RoomCommand} from './types';

function describeOrder(layerOrder: LayerOrder) {
  return {layerIds: getFlatLayerOrder(layerOrder), order: 'top-to-bottom', layerOrder};
}

export function getLayerOrderCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.get-layer-order';
  return {
    id,
    name: 'Get layer order',
    group: 'Map',
    description:
      'Read the map stacking order by stable layer ID, topmost first (drawn last). ' +
      'Includes hidden layers and the native layer-group hierarchy. ' +
      'Use map.get-dataset-context for layer labels and dataset IDs.',
    metadata: {readOnly: true, idempotent: true, riskLevel: 'low'},
    inputSchema: z.object({}),
    execute: () => ({
      success: true,
      commandId: id,
      data: describeOrder(ctx.getVisState().layerOrder)
    })
  };
}

const reorderSchema = z.object({
  layerIds: z
    .array(z.string().min(1))
    .describe('Every current layer ID exactly once, topmost first. Keep each group contiguous.')
});

// Sort within the existing hierarchy so a reorder cannot silently ungroup layers
// or change group visibility. Interleaving groups is rejected before dispatch.
function reorderGroups(order: LayerOrder, positions: Map<string, number>): LayerOrder {
  const position = (entry: LayerOrder[number]) =>
    positions.get(typeof entry === 'string' ? entry : getFlatLayerOrder(entry.layerOrder)[0]) ??
    Infinity;
  return order
    .map(entry =>
      typeof entry === 'string'
        ? entry
        : {...entry, layerOrder: reorderGroups(entry.layerOrder, positions)}
    )
    .sort((a, b) => position(a) - position(b));
}

export function getReorderLayersCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.reorder-layers';
  return {
    id,
    name: 'Reorder layers',
    group: 'Map',
    description:
      'Set the stacking order using every current layer ID exactly once, topmost first. ' +
      'Read map.get-layer-order first. Preserves group membership and settings; ' +
      'members of each group must remain contiguous. Invalid or stale lists change nothing.',
    metadata: {readOnly: false, idempotent: true, riskLevel: 'low'},
    inputSchema: reorderSchema,
    execute: (_execution, input) => {
      try {
        const {layerIds} = reorderSchema.parse(input);
        const state = ctx.getVisState();
        const positions = new Map(layerIds.map((layerId, index) => [layerId, index]));
        if (
          positions.size !== layerIds.length ||
          layerIds.length !== state.layers.length ||
          state.layers.some(layer => !positions.has(layer.id))
        ) {
          throw new Error('Provide every current layer ID exactly once. Read map.get-layer-order.');
        }
        const order = reorderGroups(state.layerOrder, positions);
        const orderedIds = getFlatLayerOrder(order);
        if (
          orderedIds.length !== layerIds.length ||
          orderedIds.some((layerId, index) => layerId !== layerIds[index])
        ) {
          throw new Error(
            'Keep the members of each layer group contiguous. Read map.get-layer-order.'
          );
        }
        ctx.dispatch(reorderLayer(order));
        return {success: true, commandId: id, data: describeOrder(order)};
      } catch (error) {
        return {success: false, commandId: id, error: String(error)};
      }
    }
  };
}

// Edit only the affected branches, keeping native order, group settings and layer state.
function editLayerOrder(
  order: LayerOrder,
  edit: (entry: LayerOrder[number]) => LayerOrder | undefined
): LayerOrder {
  const result = order.flatMap(entry => {
    const replacement = edit(entry);
    if (replacement) return replacement;
    if (typeof entry === 'string') return [entry];
    const layerOrder = editLayerOrder(entry.layerOrder, edit);
    return [layerOrder === entry.layerOrder ? entry : {...entry, layerOrder}];
  });
  return result.length === order.length && result.every((entry, i) => entry === order[i])
    ? order
    : result;
}

const groupIdSchema = z.string().min(1);
const createLayerGroupSchema = z.object({
  label: z.string().trim().min(1),
  layerIds: z.array(z.string().min(1)).min(1).describe('Existing layer IDs to group.')
});

export function getCreateLayerGroupCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.create-layer-group';
  return {
    id,
    name: 'Create layer group',
    group: 'Map',
    description:
      'Move existing layers into a new group at the top of the stack, preserving their relative order. Returns groupId. Use map.get-layer-order to find layer IDs.',
    metadata: {readOnly: false, riskLevel: 'low'},
    inputSchema: createLayerGroupSchema,
    execute: (_execution, input) => {
      try {
        const {label, layerIds} = createLayerGroupSchema.parse(input);
        const {layerOrder} = ctx.getVisState();
        const selected = new Set(layerIds);
        const current = getFlatLayerOrder(layerOrder);
        const ordered = current.filter(layerId => selected.has(layerId));
        if (selected.size !== layerIds.length || ordered.length !== selected.size) {
          throw new Error('Provide distinct current layer IDs. Read map.get-layer-order.');
        }
        const group = getNewLayerGroup({label, layerOrder: ordered});
        if (current.includes(group.id) || getLayerGroupFromLayerOrder(layerOrder, group.id)) {
          throw new Error('Could not allocate a unique group ID. Try again.');
        }
        ctx.dispatch(
          reorderLayer([
            group,
            ...editLayerOrder(layerOrder, entry =>
              typeof entry === 'string' && selected.has(entry) ? [] : undefined
            )
          ])
        );
        return {success: true, commandId: id, data: {groupId: group.id, layerIds: ordered}};
      } catch (error) {
        return {success: false, commandId: id, error: String(error)};
      }
    }
  };
}

const moveLayerToGroupSchema = z.object({
  layerId: z.string().min(1),
  groupId: groupIdSchema.nullable().describe('Destination group ID, or null for the top level.')
});

export function getMoveLayerToGroupCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.move-layer-to-group';
  return {
    id,
    name: 'Move layer to group',
    group: 'Map',
    description:
      'Move a layer to the top of an existing group, or out to the top level with groupId:null. A layer already in the destination stays in place. Use map.get-layer-order to find IDs.',
    metadata: {readOnly: false, idempotent: true, riskLevel: 'low'},
    inputSchema: moveLayerToGroupSchema,
    execute: (_execution, input) => {
      try {
        const {layerId, groupId} = moveLayerToGroupSchema.parse(input);
        const {layerOrder} = ctx.getVisState();
        if (!getFlatLayerOrder(layerOrder).includes(layerId)) {
          throw new Error(`Layer "${layerId}" not found.`);
        }
        const group =
          groupId === null ? undefined : getLayerGroupFromLayerOrder(layerOrder, groupId);
        if (groupId !== null && !group) throw new Error(`Group "${groupId}" not found.`);
        if (!(group?.layerOrder ?? layerOrder).includes(layerId)) {
          const withoutLayer = editLayerOrder(layerOrder, entry =>
            entry === layerId ? [] : undefined
          );
          const order = group
            ? editLayerOrder(withoutLayer, entry =>
                typeof entry !== 'string' && entry.id === group.id
                  ? [{...entry, layerOrder: [layerId, ...entry.layerOrder]}]
                  : undefined
              )
            : [layerId, ...withoutLayer];
          ctx.dispatch(reorderLayer(order));
        }
        return {success: true, commandId: id, data: {layerId, groupId}};
      } catch (error) {
        return {success: false, commandId: id, error: String(error)};
      }
    }
  };
}

const ungroupLayersSchema = z.object({groupId: groupIdSchema});

export function getUngroupLayersCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.ungroup-layers';
  return {
    id,
    name: 'Ungroup layers',
    group: 'Map',
    description:
      'Dissolve a group without deleting any layer. Its entries move to its former position in their existing order. Use map.get-layer-order to find the group ID.',
    metadata: {readOnly: false, riskLevel: 'low'},
    inputSchema: ungroupLayersSchema,
    execute: (_execution, input) => {
      try {
        const {groupId} = ungroupLayersSchema.parse(input);
        const {layerOrder} = ctx.getVisState();
        const group = getLayerGroupFromLayerOrder(layerOrder, groupId);
        if (!group) throw new Error(`Group "${groupId}" not found.`);
        const order = editLayerOrder(layerOrder, entry =>
          entry === group ? group.layerOrder : undefined
        );
        ctx.dispatch(reorderLayer(order));
        return {
          success: true,
          commandId: id,
          data: {groupId, layerIds: getFlatLayerOrder(group.layerOrder)}
        };
      } catch (error) {
        return {success: false, commandId: id, error: String(error)};
      }
    }
  };
}

const removeLayerSchema = z.object({layerId: z.string().min(1)});

export function getRemoveLayerCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.remove-layer';
  return {
    id,
    name: 'Remove layer',
    group: 'Map',
    description:
      'Remove one layer by stable ID using native cleanup, keeping its dataset and other layers.',
    metadata: {readOnly: false, riskLevel: 'medium'},
    inputSchema: removeLayerSchema,
    execute: (_execution, input) => {
      try {
        const {layerId} = removeLayerSchema.parse(input);
        const layer = ctx.getVisState().layers.find(candidate => candidate.id === layerId);
        if (!layer) throw new Error(`Layer "${layerId}" not found.`);
        ctx.dispatch(removeLayer(layerId));
        return {success: true, commandId: id, data: {layerId, dataId: layer.config.dataId}};
      } catch (error) {
        return {success: false, commandId: id, error: String(error)};
      }
    }
  };
}

const removeDatasetSchema = z.object({
  dataId: z.string().min(1),
  dryRun: z
    .boolean()
    .default(false)
    .describe('Return affected layer IDs without removing anything.')
});

export function getRemoveDatasetCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.remove-dataset';
  return {
    id,
    name: 'Remove dataset',
    group: 'Map',
    description:
      'Remove a dataset by ID and all its layers, using native filter, tooltip and chart cleanup. ' +
      'Returns affected layer IDs; use dryRun:true to inspect them without changing the map. ' +
      'Derived dataset snapshots are retained, matching native removal.',
    metadata: {readOnly: false, riskLevel: 'medium'},
    inputSchema: removeDatasetSchema,
    execute: (_execution, input) => {
      try {
        const {dataId, dryRun} = removeDatasetSchema.parse(input);
        const state = ctx.getVisState();
        if (!Object.prototype.hasOwnProperty.call(state.datasets, dataId)) {
          throw new Error(`Dataset "${dataId}" not found.`);
        }
        const affectedLayerIds = state.layers
          .filter(layer => layer.config.dataId === dataId)
          .map(layer => layer.id);
        if (!dryRun) ctx.dispatch(removeDataset(dataId));
        return {success: true, commandId: id, data: {dataId, affectedLayerIds, dryRun}};
      } catch (error) {
        return {success: false, commandId: id, error: String(error)};
      }
    }
  };
}
