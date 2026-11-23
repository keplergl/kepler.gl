// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {removeCustomMapStyle} from '@kepler.gl/actions';
import type {KeplerContext} from './types';

/** Remove the previous project's local basemaps before merging a saved project. */
export async function prepareProjectMapStyles(
  ctx: KeplerContext,
  signal?: AbortSignal
): Promise<void> {
  const mapStyle = ctx.getKeplerState?.()?.mapStyle;
  if (!mapStyle) return;

  const hostStyles = mapStyle.initialState?.mapStyles ?? {};
  for (const [id, style] of Object.entries(mapStyle.mapStyles)) {
    if (
      (style.custom !== 'LOCAL' && style.custom !== true) ||
      Object.prototype.hasOwnProperty.call(hostStyles, id)
    ) {
      continue;
    }
    signal?.throwIfAborted();
    await ctx.dispatch(removeCustomMapStyle({id}));
  }
}
