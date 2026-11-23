// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {
  controlCameraTour,
  layerConfigChange,
  updateAnnotation,
  updateEffect
} from '@kepler.gl/actions';
import {getAnimatableEffectParameters, validateEffectAnimation} from '@kepler.gl/effects';
import type {Layer} from '@kepler.gl/layers';
import type {Annotation, Effect, EffectParameterAnimation} from '@kepler.gl/types';
import {
  DEFAULT_LAYER_ANIMATABLE_PROPS,
  getLayerPropertyTransitions,
  normalizeLayerPropertyTransitions
} from '@kepler.gl/utils';
import type {KeplerContext, RoomCommand, VisState} from './types';

const identifier = z.string().trim().min(1);
const targetSchema = z.object({type: z.enum(['layer', 'annotation', 'effect']), id: identifier});
const value = z.union([z.number().finite(), z.array(z.number().finite()).min(1)]);
const blockFields = z.object({
  startTimeMs: z.number().finite().min(0),
  endTimeMs: z.number().finite().min(0),
  startValue: value,
  endValue: value,
  easing: z.enum(['linear', 'easeInOut'])
});
const inputSchema = z
  .object({
    action: z.enum(['discover', 'get', 'add', 'update', 'remove']),
    target: targetSchema.optional().describe('Required except for discovery of all targets.'),
    property: identifier.optional().describe('Property name from discover; required for edits.'),
    block: blockFields
      .extend({id: identifier})
      .strict()
      .optional()
      .describe('Required for add: complete block with an ID unique within this property track.'),
    blockId: identifier.optional().describe('Required for update/remove; IDs remain stable.'),
    changes: blockFields
      .partial()
      .strict()
      .optional()
      .describe('Required for update: patch only the supplied timing, values or easing.')
  })
  .strict();

type Target = z.infer<typeof targetSchema>;
type ResolvedTarget =
  | {type: 'layer'; entity: Layer}
  | {type: 'annotation'; entity: Annotation}
  | {type: 'effect'; entity: Effect};

function resolveTarget(state: VisState, target: Target): ResolvedTarget {
  const entities =
    target.type === 'layer'
      ? state.layers
      : target.type === 'annotation'
      ? state.annotations
      : state.effects;
  const entity = entities?.find(item => item.id === target.id);
  if (!entity) throw new Error(`${target.type} "${target.id}" not found.`);
  return {type: target.type, entity};
}

function properties(target: ResolvedTarget) {
  return target.type === 'effect'
    ? getAnimatableEffectParameters(target.entity)
    : target.type === 'layer'
    ? target.entity.animatableProps ?? DEFAULT_LAYER_ANIMATABLE_PROPS
    : DEFAULT_LAYER_ANIMATABLE_PROPS;
}

function tracks(target: ResolvedTarget): Record<string, EffectParameterAnimation[]> {
  return (
    (target.type === 'effect'
      ? target.entity.animation
      : target.type === 'layer'
      ? target.entity.config.propertyTransitions
      : target.entity.propertyTransitions) ?? {}
  );
}

export function getPropertyTransitionsCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.property-transitions';
  return {
    id,
    name: 'Manage timed property transitions',
    group: 'Map',
    description:
      'Discover eligible layer, annotation and effect properties; get saved tracks; add, update or remove a block by stable ID. ' +
      'Times are nonnegative elapsed milliseconds, independent of dataset time. Easing is linear or easeInOut. ' +
      'Blocks on the same property cannot overlap; adjacent blocks and instantaneous cuts are allowed. ' +
      'Use discovered value types/ranges (effect values clamp to native bounds). Edits pause playback and preserve unrelated tracks and camera stops. ' +
      'These are native Animation editor tracks shared by preview, saved projects and video export.',
    metadata: {readOnly: false, riskLevel: 'low'},
    inputSchema,
    execute: (_execution, input) => {
      try {
        const args = inputSchema.parse(input);
        const state = ctx.getVisState();
        if (args.action === 'discover') {
          const targets: Target[] = args.target
            ? [args.target]
            : [
                ...state.layers.map(layer => ({type: 'layer' as const, id: layer.id})),
                ...(state.annotations ?? []).map(annotation => ({
                  type: 'annotation' as const,
                  id: annotation.id
                })),
                ...(state.effects ?? []).map(effect => ({type: 'effect' as const, id: effect.id}))
              ];
          return {
            success: true,
            commandId: id,
            data: {
              targets: targets.map(target => {
                const resolved = resolveTarget(state, target);
                return {
                  target,
                  label:
                    resolved.type === 'layer'
                      ? resolved.entity.config.label
                      : resolved.type === 'annotation'
                      ? resolved.entity.label
                      : resolved.entity.type,
                  properties: properties(resolved)
                };
              })
            }
          };
        }
        if (!args.target) throw new Error('target is required for this action.');
        const resolved = resolveTarget(state, args.target);
        const previous = tracks(resolved);
        const name = args.property;
        if (name && ['__proto__', 'constructor', 'prototype'].includes(name))
          throw new Error('Unsafe property name.');
        const current =
          name && Object.prototype.hasOwnProperty.call(previous, name) ? previous[name] : [];
        if (args.action === 'get') {
          return {
            success: true,
            commandId: id,
            data: {target: args.target, tracks: name ? {[name]: current} : previous}
          };
        }
        if (!name) throw new Error('property is required to edit a track.');
        if (!properties(resolved).some(property => property.name === name)) {
          throw new Error(
            `Unsupported property "${name}". Use action discover for eligible properties.`
          );
        }
        let proposed: EffectParameterAnimation[];
        if (args.action === 'add') {
          if (!args.block) throw new Error('block is required to add a transition.');
          if (current.some(block => block.id === args.block!.id))
            throw new Error(`Block "${args.block.id}" already exists on this property.`);
          proposed = [...current, args.block];
        } else {
          if (!args.blockId)
            throw new Error('blockId is required to update or remove a transition.');
          if (!current.some(block => block.id === args.blockId))
            throw new Error(`Block "${args.blockId}" not found on this property.`);
          if (args.action === 'update') {
            if (!args.changes || !Object.keys(args.changes).length)
              throw new Error('changes must contain at least one block field.');
            proposed = current.map(block =>
              block.id === args.blockId ? {...block, ...args.changes} : block
            );
          } else {
            proposed = current.filter(block => block.id !== args.blockId);
          }
        }
        let action;
        let next: Record<string, EffectParameterAnimation[]>;
        if (resolved.type === 'effect') {
          const validated =
            validateEffectAnimation(
              {[name]: proposed},
              resolved.entity.getParameterDescriptions()
            )?.[name] ?? [];
          if (validated.length !== proposed.length)
            throw new Error(
              'Invalid track: check values, timing, easing, IDs and overlapping blocks.'
            );
          next = {...previous};
          if (validated.length) next[name] = validated;
          else delete next[name];
          action = updateEffect(resolved.entity.id, {animation: next});
        } else {
          const descriptor = (
            resolved.type === 'layer'
              ? resolved.entity.animatableProps ?? DEFAULT_LAYER_ANIMATABLE_PROPS
              : DEFAULT_LAYER_ANIMATABLE_PROPS
          ).find(property => property.name === name)!;
          const validated = getLayerPropertyTransitions(
            {propertyTransitions: normalizeLayerPropertyTransitions({[name]: proposed})},
            name,
            descriptor
          );
          if (validated.length !== proposed.length)
            throw new Error(
              'Invalid track: check values, timing, easing, IDs and overlapping blocks.'
            );
          const propertyTransitions = {
            ...(resolved.type === 'layer'
              ? resolved.entity.config.propertyTransitions
              : resolved.entity.propertyTransitions),
            [name]: validated
          };
          next = propertyTransitions;
          action =
            resolved.type === 'layer'
              ? layerConfigChange(resolved.entity, {propertyTransitions})
              : updateAnnotation(resolved.entity.id, {propertyTransitions});
        }
        // Validate everything before dispatching, including the pause request.
        ctx.dispatch(controlCameraTour({action: 'pause'}));
        ctx.dispatch(action);
        return {success: true, commandId: id, data: {target: args.target, tracks: next}};
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
