// Copyright 2022 Foursquare Labs, Inc. All Rights Reserved.

import {z} from 'zod';

import {AnimationConfigSchema} from './vis-state/animation';
import {EffectSchema} from './vis-state/effect';
import {FilterSchema} from './vis-state/filter';
import {LayerSchema} from './layers';
import {InteractionConfigSchema} from './vis-state/interaction-config';
import {EditorSchema} from './vis-state/editor';

export const VisStateSchema = z.object({
  effects: z.array(EffectSchema).optional().describe('Effects to apply to the map layers'),
  filters: z.array(FilterSchema).optional().describe('Filters to apply to the data'),
  layers: z.array(LayerSchema).default([]).describe('Layers to display in the map'),
  interactionConfig: InteractionConfigSchema.optional().describe(
    'Interaction configuration for the map, setting tooltips, geocoder, etc.'
  ),
  layerBlending: z
    .enum(['additive', 'normal', 'subtractive'])
    .default('normal')
    .optional()
    .describe('How layers are blended together on top of the map'),
  overlayBlending: z
    .enum(['normal', 'screen', 'darken'])
    .default('normal')
    .optional()
    .describe('How map overlayers are blended with the map'),
  splitMaps: z.unknown(),
  animationConfig: AnimationConfigSchema.optional().describe('Configuration for animating the map'),
  editor: EditorSchema.optional(),
  datasets: z.unknown(),
  layerOrder: z.unknown()
});

export type VisStateSchema = z.infer<typeof VisStateSchema>;
