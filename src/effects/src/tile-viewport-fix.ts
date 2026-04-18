// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * In interleaved (MapboxOverlay) mode during video export, deck.gl creates
 * two viewports per frame: 'MapView' and 'mapbox'. loaders.gl's Tileset3D
 * creates separate Tile3D trees per viewport, then merges selected tiles by
 * ID — the last viewport overwrites. Tile3D.updateVisibility sets viewportIds
 * to only the traversing viewport's ID (overwrite, not append) and guards
 * against re-entry within the same frame. The result: some tiles end up with
 * viewportIds=['MapView'] only. Tile3DLayer.filterSubLayer then rejects them
 * when a render pass uses viewport 'mapbox'.
 *
 * Fix: before any render pass that needs all tiles (shadow, fog, etc.),
 * ensure every tile sub-layer's tile has the pass viewport ID in its
 * viewportIds array.
 */
export function patchTileViewportIds(opts: {
  viewports?: {id: string}[];
  layers?: any[];
}): void {
  const viewportId = opts.viewports?.[0]?.id;
  if (!viewportId || !opts.layers) return;

  for (const layer of opts.layers) {
    const tile = (layer as any).props?.tile;
    if (tile?.viewportIds && tile.selected && !tile.viewportIds.includes(viewportId)) {
      tile.viewportIds.push(viewportId);
    }
  }
}
