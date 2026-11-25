// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {BrushEndpoint} from '@kepler.gl/types';

export function getEndpointBrushingTarget(endpoint: unknown): BrushEndpoint {
  return endpoint === 'source' || endpoint === 'target' ? endpoint : 'source_target';
}
