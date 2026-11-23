// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {interactionConfigChange} from '@kepler.gl/actions';
import type {KeplerContext, RoomCommand} from './types';

const datasetSchema = z.object({dataId: z.string().min(1)}).strict();
const setSchema = datasetSchema.extend({
  fields: z
    .array(z.string().min(1))
    .describe(
      'Exact dataset field names in display order. [] clears this dataset’s tooltip fields.'
    )
});

function getTarget(ctx: KeplerContext, dataId: string) {
  const state = ctx.getVisState();
  const dataset = state.datasets[dataId];
  if (!dataset) throw new Error(`Dataset "${dataId}" not found.`);
  return {dataset, tooltip: state.interactionConfig.tooltip};
}

function describeFields(ctx: KeplerContext, dataId: string) {
  const {dataset, tooltip} = getTarget(ctx, dataId);
  return {
    dataId,
    enabled: tooltip.enabled,
    fields: tooltip.config.fieldsToShow[dataId] ?? [],
    availableFields: dataset.fields.map(({name, type}) => ({name, type}))
  };
}

export function getTooltipFieldsCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.get-tooltip-fields';
  return {
    id,
    name: 'Get tooltip fields',
    group: 'Map',
    description:
      'Read a dataset’s ordered tooltip fields and their formats, available fields and global tooltip enabled state.',
    metadata: {readOnly: true, idempotent: true, riskLevel: 'low'},
    inputSchema: datasetSchema,
    execute: (_execution, input) => {
      try {
        const {dataId} = datasetSchema.parse(input);
        return {success: true, commandId: id, data: describeFields(ctx, dataId)};
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

export function getSetTooltipFieldsCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.set-tooltip-fields';
  return {
    id,
    name: 'Set tooltip fields',
    group: 'Map',
    description:
      'Select and order tooltip fields for one dataset by exact field names; [] clears them. Preserves formats of retained fields, other datasets, tooltip enabled state and all unrelated interaction settings.',
    metadata: {readOnly: false, idempotent: true, riskLevel: 'low'},
    inputSchema: setSchema,
    execute: (_execution, input) => {
      try {
        const {dataId, fields} = setSchema.parse(input);
        const {dataset, tooltip} = getTarget(ctx, dataId);
        const seen = new Set<string>();
        const selected = fields.map(name => {
          if (!dataset.fields.some(field => field.name === name))
            throw new Error(`Field "${name}" not found in dataset "${dataId}".`);
          if (seen.has(name)) throw new Error(`Duplicate tooltip field "${name}".`);
          seen.add(name);
          return (
            tooltip.config.fieldsToShow[dataId]?.find(field => field.name === name) ?? {
              name,
              format: null
            }
          );
        });
        ctx.dispatch(
          interactionConfigChange({
            ...tooltip,
            config: {
              ...tooltip.config,
              fieldsToShow: {...tooltip.config.fieldsToShow, [dataId]: selected}
            }
          })
        );
        return {success: true, commandId: id, data: describeFields(ctx, dataId)};
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
