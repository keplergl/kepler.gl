// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {layerVisConfigChange} from '@kepler.gl/actions';
import type {Layer} from '@kepler.gl/layers';
import type KeplerTable from '@kepler.gl/table';
import type {KeplerContext, RoomCommand} from './types';
import {buildZarrLayer, zarrOptions} from './surface-layer-options';

const scalar = z.union([z.number().finite(), z.boolean(), z.string()]);
const inputSchema = z.object({
  layerId: z.string().min(1),
  options: z.record(z.string(), scalar).optional(),
  zarr: zarrOptions.strict().optional(),
  wmsLayer: z
    .string()
    .min(1)
    .optional()
    .describe(
      'For WMS: a service layer name returned by map.get-layer-options or map.load-tileset.'
    )
});

/** Use the same settings and bounds as the layer controls, without allowing arbitrary config. */
function supportedOptions(layer: Layer) {
  return Object.fromEntries(
    Object.entries(layer.visConfigSettings).filter(
      ([key, setting]) =>
        ['number', 'boolean', 'input', 'select'].includes(setting.type) &&
        !['zarrVariable', 'zarrFrame'].includes(key) &&
        !Array.isArray(setting.defaultValue)
    )
  );
}

export function validateLayerOptions(
  layer: Layer,
  dataset: KeplerTable,
  input: unknown
): Record<string, number | boolean | string> {
  const options = z.record(z.string(), scalar).parse(input);
  const settings = supportedOptions(layer);
  for (const [key, value] of Object.entries(options)) {
    const setting = Object.prototype.hasOwnProperty.call(settings, key) ? settings[key] : undefined;
    if (!setting)
      throw new Error(`Unsupported option "${key}" for ${layer.type}. Use map.get-layer-options.`);
    if (setting.type === 'number') {
      if (typeof value !== 'number' || value < setting.range[0] || value > setting.range[1]) {
        throw new Error(`${key} must be a number in [${setting.range.join(', ')}].`);
      }
    } else if (setting.type === 'boolean') {
      if (typeof value !== 'boolean') throw new Error(`${key} must be a boolean.`);
    } else {
      if (typeof value !== 'string') throw new Error(`${key} must be a string.`);
      if (setting.type === 'select' && setting.options.length && !setting.options.includes(value)) {
        throw new Error(`${key} must be one of: ${setting.options.join(', ')}.`);
      }
    }
    if (
      key === 'pulseTimeField' &&
      value &&
      !dataset.fields.some(
        field => field.name === value && ['timestamp', 'date'].includes(field.type)
      )
    )
      throw new Error('pulseTimeField must name a timestamp or date field in this dataset.');
  }
  return options;
}

export function getLayerOptionsCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.get-layer-options';
  return {
    id,
    name: 'Get layer options',
    group: 'Map',
    description:
      'Inspect editable visual settings, current values, ranges and choices for a layer. Use map.set-layer-options to update them. Zarr variable/dimension/axis changes use its zarr parameter.',
    metadata: {readOnly: true, riskLevel: 'low'},
    inputSchema: z.object({layerId: z.string().min(1)}),
    execute: (_execution, input) => {
      try {
        const {layerId} = z.object({layerId: z.string().min(1)}).parse(input);
        const layer = ctx.getVisState().layers.find(l => l.id === layerId);
        if (!layer) throw new Error(`Layer "${layerId}" not found.`);
        const settings = Object.fromEntries(
          Object.entries(supportedOptions(layer)).map(([key, setting]) => [
            key,
            {
              type: setting.type,
              value: layer.config.visConfig[key],
              ...('range' in setting ? {range: setting.range} : {}),
              ...('options' in setting ? {options: setting.options} : {})
            }
          ])
        );
        return {
          success: true,
          commandId: id,
          data: {
            layerId,
            layerType: layer.type,
            settings,
            ...(layer.type === 'zarr'
              ? {
                  zarr: {
                    variable: layer.config.visConfig.zarrVariable,
                    dimensionIndexes: layer.config.visConfig.dimensionIndexes,
                    axis: layer.config.visConfig.zarrAxis,
                    frame: layer.config.visConfig.zarrFrame,
                    rescale: layer.config.visConfig.rescale,
                    variables: ctx
                      .getVisState()
                      .datasets[layer.config.dataId]?.metadata?.variables?.map(variable => ({
                        path: variable.path,
                        dimensions: variable.nonSpatialDims.map(dimension => ({
                          name: dimension.name,
                          size: dimension.size,
                          kind: dimension.kind
                        })),
                        dataRange: variable.dataRange
                      }))
                  }
                }
              : {}),
            ...(layer.type === 'wms'
              ? {wmsLayers: ctx.getVisState().datasets[layer.config.dataId]?.metadata?.layers}
              : {})
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: id,
          error: String(error instanceof Error ? error.message : error)
        };
      }
    }
  };
}

export function getSetLayerOptionsCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.set-layer-options';
  return {
    id,
    name: 'Set layer options',
    group: 'Map',
    description:
      'Patch visual settings using keys from map.get-layer-options. Supports point glow/pulse/ripple, heatmap surfaces, flow-field density/trails/timing, and model settings. Event pulses also require an enabled time filter on pulseTimeField. Use zarr for validated variable, dimension, axis, frame and rescale changes.',
    metadata: {readOnly: false, riskLevel: 'low', idempotent: true},
    inputSchema,
    execute: (_execution, input) => {
      try {
        const args = inputSchema.parse(input);
        const {layers, datasets} = ctx.getVisState();
        const layer = layers.find(l => l.id === args.layerId);
        if (!layer) throw new Error(`Layer "${args.layerId}" not found.`);
        const dataset = datasets[layer.config.dataId];
        if (!dataset) throw new Error('Layer dataset not found.');
        let options: Record<string, unknown> = validateLayerOptions(
          layer,
          dataset,
          args.options ?? {}
        );
        if (args.zarr) {
          if (layer.type !== 'zarr') throw new Error('zarr options require a Zarr layer.');
          const previous = layer.config.visConfig;
          const variableChanged =
            args.zarr.variable !== undefined && args.zarr.variable !== previous.zarrVariable;
          const validated = buildZarrLayer(dataset, {
            variable: previous.zarrVariable ?? undefined,
            ...(!variableChanged
              ? {
                  dimensionIndexes: previous.dimensionIndexes,
                  axis: previous.zarrAxis?.kind ? previous.zarrAxis : undefined,
                  ...(!args.zarr.axis && !args.zarr.dimensionIndexes && previous.zarrFrame > 0
                    ? {frame: previous.zarrFrame}
                    : {}),
                  rescale: previous.rescale
                }
              : {}),
            ...args.zarr
          }).config.visConfig;
          const keys = ['zarrVariable', 'dimensionIndexes', 'zarrAxis', 'zarrFrame', 'rescale'];
          options = {
            ...options,
            ...Object.fromEntries(keys.map(key => [key, validated[key]])),
            ...(args.zarr.opacity !== undefined ? {opacity: args.zarr.opacity} : {})
          };
        }
        if (args.wmsLayer) {
          if (layer.type !== 'wms') throw new Error('wmsLayer requires a WMS layer.');
          const serviceLayer = dataset.metadata?.layers?.find(item => item.name === args.wmsLayer);
          if (!serviceLayer) throw new Error(`WMS service layer "${args.wmsLayer}" not found.`);
          options.wmsLayer = serviceLayer;
        }
        if (!Object.keys(options).length)
          throw new Error('Provide options or zarr settings to update.');
        ctx.dispatch(layerVisConfigChange(layer, options));
        return {success: true, commandId: id, data: {layerId: layer.id, options}};
      } catch (error) {
        return {
          success: false,
          commandId: id,
          error: String(error instanceof Error ? error.message : error)
        };
      }
    }
  };
}
