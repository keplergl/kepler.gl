// Copyright 2022 Foursquare Labs, Inc. All Rights Reserved.

import {z} from 'zod';

import {AnimationConfigSchema} from './animation';
import {EffectSchema} from './effect';
import {FilterSchema} from './filter';
import {LayerSchema} from './layers';
import {InteractionConfigSchema} from './interaction-config';

export const VisStateSchema = z.object({
  effects: z.array(EffectSchema).optional().describe('Effects to apply to the map layers'),
  filters: z.array(FilterSchema).optional().describe('Filters to apply to the data'),
  layers: z.array(LayerSchema).default([]).describe('Layers to display in the map'),
  interactionConfig: z.unknown(),
  layerBlending: z.unknown(),
  overlayBlending: z.unknown().optional(),
  splitMaps: z.unknown(),
  animationConfig: AnimationConfigSchema.optional().describe('Configuration for animating the map'),
  editor: z.unknown().optional(),
  datasets: z.unknown(),
  layerOrder: z.unknown()
});

export type VisStateSchema = z.infer<typeof VisStateSchema>;
