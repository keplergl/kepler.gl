// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const noop = (): void => {
  /* no tiles patched */
};

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
 * viewportIds array. Returns a cleanup function that removes the added IDs
 * so they don't accumulate across frames.
 */
export function patchTileViewportIds(opts: {
  viewports?: {id: string}[];
  layers?: any[];
}): () => void {
  const viewportId = opts.viewports?.[0]?.id;
  if (!viewportId || !opts.layers) return noop;

  const patched: any[] = [];
  for (const layer of opts.layers) {
    const tile = (layer as any).props?.tile;
    if (tile?.viewportIds && tile.selected && !tile.viewportIds.includes(viewportId)) {
      tile.viewportIds.push(viewportId);
      patched.push(tile);
    }
  }

  return () => {
    for (const tile of patched) {
      const idx = tile.viewportIds.indexOf(viewportId);
      if (idx !== -1) {
        tile.viewportIds.splice(idx, 1);
      }
    }
  };
}

/**
 * Reset WebGL depthRange to [0, 1].
 *
 * Maplibre/Mapbox basemap rendering compresses the depth range (e.g. [0, 0.979])
 * and doesn't restore it. When deck.gl layers subsequently render to the offscreen
 * FBO, their depth values inherit that compressed range, causing the fog shader's
 * depth reconstruction (depth * 2 − 1) to produce incorrect z values.
 */
export function resetDepthRange(model: {device: any} | null): void {
  if (!model) return;
  const gl = (model.device as any).gl as WebGL2RenderingContext | undefined;
  if (gl) {
    gl.depthRange(0, 1);
  }
}
