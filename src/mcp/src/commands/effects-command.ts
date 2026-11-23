// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {addEffect, updateEffect} from '@kepler.gl/actions';
import {
  EFFECT_DESCRIPTIONS,
  LIGHT_AND_SHADOW_EFFECT,
  DISTANCE_FOG_TYPE,
  SURFACE_FOG_TYPE
} from '@kepler.gl/constants';
import type {Effect} from '@kepler.gl/types';
import type {KeplerContext, RoomCommand} from './types';

const number = z.number().finite();
const inputSchema = z
  .object({
    id: z.string().trim().min(1).describe('Existing effect ID, or a new stable ID to create.'),
    type: z.string().min(1).optional().describe('Required to create; use map.get-effects types.'),
    isEnabled: z.boolean().optional().describe('Defaults to true on creation; false disables.'),
    parameters: z
      .record(z.string(), z.union([number, z.boolean(), z.array(number)]))
      .optional()
      .describe('Patch using parameter names and types from map.get-effects.')
  })
  .strict();

function summarize(effect: Effect) {
  return {
    id: effect.id,
    type: effect.type,
    isEnabled: effect.isEnabled,
    parameters: {...effect.parameters}
  };
}

export function getEffectsCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.get-effects';
  return {
    id,
    name: 'Get map effects',
    group: 'Map',
    description:
      'List supported native effects and parameter types, bounds and defaults, plus current ' +
      'effect IDs, enabled states, values and rendering order. Surface Fog uses height in meters, ' +
      'fogColor as RGB 0–255, and pattern=true for reflective water. Fog and shadows do not render in globe mode.',
    metadata: {readOnly: true, idempotent: true, riskLevel: 'low'},
    inputSchema: z.object({}).strict(),
    execute: () => {
      const state = ctx.getVisState();
      return {
        success: true,
        commandId: id,
        data: {
          supported: EFFECT_DESCRIPTIONS.map(({type, name, parameters}) => ({
            type,
            name,
            parameters: parameters.map(parameter => ({
              ...parameter,
              type: parameter.type ?? 'number'
            }))
          })),
          effects: (state.effects ?? []).map(summarize),
          effectOrder: state.effectOrder ?? []
        }
      };
    }
  };
}

export function getSetEffectCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.set-effect';
  return {
    id,
    name: 'Set map effect',
    group: 'Map',
    description:
      'Create or patch a native effect by stable ID. Discover types and parameters with map.get-effects. ' +
      'Omitted settings and animation tracks are preserved; isEnabled=false disables without deleting. ' +
      'Uses native defaults and numeric clamping; wrong-length vectors reset to native defaults. ' +
      'Only one Light & Shadow and one fog effect (Surface or Distance) may exist, including disabled effects. ' +
      'An existing effect cannot change type. Verify with map.get-effects and map.render-preview.',
    metadata: {readOnly: false, idempotent: true, riskLevel: 'low'},
    inputSchema,
    execute: (_execution, input) => {
      try {
        const args = inputSchema.parse(input);
        const effects: Effect[] = ctx.getVisState().effects ?? [];
        const existing = effects.find(effect => effect.id === args.id);
        if (!existing && !args.type) throw new Error('type is required to create an effect.');
        if (existing && args.type && args.type !== existing.type)
          throw new Error('An existing effect cannot change type.');
        const type = existing?.type ?? args.type!;
        const description = EFFECT_DESCRIPTIONS.find(effect => effect.type === type);
        if (!description)
          throw new Error(`Unsupported effect type "${type}". Use map.get-effects.`);

        for (const [name, value] of Object.entries(args.parameters ?? {})) {
          const parameter = description.parameters.find(item => item.name === name);
          if (!parameter) throw new Error(`Unsupported parameter "${name}" for ${type}.`);
          const schema =
            parameter.type === 'checkbox'
              ? z.boolean()
              : parameter.type === 'color' || parameter.type === 'array'
              ? z.array(number)
              : number;
          if (!schema.safeParse(value).success)
            throw new Error(`Invalid value for "${name}". Use its type from map.get-effects.`);
        }

        const {id: effectId, type: _type, ...props} = args;
        if (existing) {
          ctx.dispatch(updateEffect(effectId, props));
        } else {
          const fogTypes = [SURFACE_FOG_TYPE, DISTANCE_FOG_TYPE];
          if (
            effects.some(effect =>
              fogTypes.includes(type)
                ? fogTypes.includes(effect.type)
                : type === LIGHT_AND_SHADOW_EFFECT.type && effect.type === type
            )
          ) {
            throw new Error(
              'Only one Light & Shadow and one fog effect may exist. Update its existing ID.'
            );
          }
          ctx.dispatch(addEffect({id: effectId, type, ...props}));
        }
        const effect = ctx.getVisState().effects?.find(item => item.id === effectId);
        if (!effect) throw new Error('The host did not apply the effect.');
        return {success: true, commandId: id, data: summarize(effect)};
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
