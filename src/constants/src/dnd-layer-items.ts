// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Modifiers} from '@dnd-kit/core';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';

export const DND_MODIFIERS: Modifiers = [restrictToVerticalAxis];
export const DND_EMPTY_MODIFIERS: Modifiers = [];
export const SORTABLE_SIDE_PANEL_TYPE = 'root';
export const DROPPABLE_MAP_CONTAINER_TYPE = 'map';
export const SORTABLE_LAYER_TYPE = 'layer';

export const SORTABLE_EFFECT_PANEL_TYPE = 'root';
export const SORTABLE_EFFECT_TYPE = 'effect';
