// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {layerConfigChange} from '@kepler.gl/actions';
import {DEFAULT_TEXT_LABEL, LAYER_TEXT_CONFIGS} from '@kepler.gl/constants';
import {
  AGGREGATION_COUNT_LAYER_TYPES,
  COLUMN_MODE_GEOJSON,
  createPointCountLabelField
} from '@kepler.gl/layers';
import type {KeplerContext, RoomCommand} from './types';

const layerSchema = z.object({layerId: z.string().min(1)}).strict();
const channel = z.number().int().min(0).max(255);
const rgb = z.tuple([channel, channel, channel]);
const rgba = z.tuple([channel, channel, channel, channel]);
const bounded = (range: number[]) => z.number().min(range[0]).max(range[1]);
const labelSchema = z
  .object({
    field: z.string().min(1),
    size: bounded(LAYER_TEXT_CONFIGS.fontSize.range).optional(),
    weight: bounded(LAYER_TEXT_CONFIGS.fontWeight.range).optional(),
    color: rgb.optional(),
    anchor: z.enum(['start', 'middle', 'end']).optional(),
    alignment: z.enum(['top', 'center', 'bottom']).optional(),
    offset: z.tuple([z.number().finite(), z.number().finite()]).optional(),
    outlineWidth: bounded(LAYER_TEXT_CONFIGS.outlineWidth.range).optional(),
    outlineColor: rgba.optional(),
    background: z.boolean().optional(),
    backgroundColor: rgba.nullable().optional(),
    collisionEnabled: z.boolean().optional()
  })
  .strict();
const setSchema = layerSchema.extend({
  labels: z
    .array(labelSchema)
    .describe(
      'Replace the ordered label list; [] clears it. Omitted styles preserve a matching field’s current styles, or use native defaults.'
    )
});

function getTarget(ctx: KeplerContext, layerId: string) {
  const {layers, datasets} = ctx.getVisState();
  const layer = layers.find(item => item.id === layerId);
  if (!layer) throw new Error(`Layer "${layerId}" not found.`);
  const dataset = datasets[layer.config.dataId];
  if (!dataset) throw new Error('Layer dataset not found.');
  const aggregation = AGGREGATION_COUNT_LAYER_TYPES.has(layer.type);
  const supported =
    aggregation ||
    ['point', 'icon', 'hexagonId', 'trip'].includes(layer.type) ||
    (layer.type === 'geojson' && layer.config.columnMode === COLUMN_MODE_GEOJSON);
  const fields = aggregation ? [createPointCountLabelField()] : dataset.fields;
  return {layer, fields, supported, aggregation};
}

function describeLabels(ctx: KeplerContext, layerId: string) {
  const {layer, fields, supported, aggregation} = getTarget(ctx, layerId);
  return {
    layerId,
    dataId: layer.config.dataId,
    supported,
    offsetSupported: aggregation,
    availableFields: supported ? fields.map(({name, type}) => ({name, type})) : [],
    labels: layer.config.textLabel
      .filter(label => label.field)
      .map(label => ({...label, field: label.field!.name}))
  };
}

export function getLayerLabelsCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.get-layer-labels';
  return {
    id,
    name: 'Get layer labels',
    group: 'Map',
    description:
      'Read field-bound layer labels, native styles, available fields and offset support. Use map.set-layer-labels to update them.',
    metadata: {readOnly: true, idempotent: true, riskLevel: 'low'},
    inputSchema: layerSchema,
    execute: (_execution, input) => {
      try {
        const {layerId} = layerSchema.parse(input);
        return {success: true, commandId: id, data: describeLabels(ctx, layerId)};
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

export function getSetLayerLabelsCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.set-layer-labels';
  return {
    id,
    name: 'Set layer labels',
    group: 'Map',
    description:
      'Bind labels to exact dataset field names on point, icon, GeoJSON (GeoJSON column mode), H3 or trip layers. Replace the ordered list; [] clears it. Cluster/grid/hexagon support only the synthetic pointCount field. Explicit nonzero pixel offsets work only on those aggregation layers; other layers position labels using anchor/alignment. Preserves unrelated layer settings.',
    metadata: {readOnly: false, idempotent: true, riskLevel: 'low'},
    inputSchema: setSchema,
    execute: (_execution, input) => {
      try {
        const {layerId, labels} = setSchema.parse(input);
        const {layer, fields, supported, aggregation} = getTarget(ctx, layerId);
        if (!supported)
          throw new Error(
            `Layer "${layerId}" does not support native field labels in its current type/column mode.`
          );
        const seen = new Set<string>();
        const defaults =
          layer.getDefaultLayerConfig({dataId: layer.config.dataId}).textLabel?.[0] ??
          DEFAULT_TEXT_LABEL;
        const textLabel = labels.map(label => {
          const field = fields.find(item => item.name === label.field);
          if (!field)
            throw new Error(
              `Label field "${label.field}" not found. Use map.get-layer-labels for available fields.`
            );
          if (seen.has(field.name)) throw new Error(`Duplicate label field "${field.name}".`);
          seen.add(field.name);
          if (!aggregation && label.offset?.some(value => value !== 0)) {
            throw new Error(
              'This layer positions labels using anchor/alignment; explicit pixel offsets are unsupported.'
            );
          }
          return {
            ...defaults,
            ...layer.config.textLabel.find(current => current.field?.name === field.name),
            ...label,
            field
          };
        });
        ctx.dispatch(
          layerConfigChange(layer, {
            textLabel: textLabel.length ? textLabel : [{...defaults, field: null}]
          })
        );
        return {success: true, commandId: id, data: describeLabels(ctx, layerId)};
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
