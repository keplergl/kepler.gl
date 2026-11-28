// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LngLat} from 'maplibre-gl';

type TerrainMap = {
  getTerrain?: () => {source: string; exaggeration?: number} | null;
  isSourceLoaded?: (id: string) => boolean;
  queryTerrainElevation?: (
    coordinate: [number, number],
    options: {exaggerated: false}
  ) => number | null;
  transform?: {tileZoom: number};
  terrain?: {
    exaggeration?: number;
    _getOverscaledTileIDFromLngLatZoom?: (
      coordinate: LngLat,
      zoom: number
    ) => {
      tileID: unknown;
      mercatorX: number;
      mercatorY: number;
    };
    sourceCache?: {
      getSourceTile?: (tileID: unknown, searchParents: boolean) => {dem?: unknown} | undefined;
    };
    getDEMElevation?: (tileID: unknown, x: number, y: number, extent: number) => number;
  };
};

/** Read a loaded DEM, without accepting the renderer's synthetic zero for missing tiles. */
export function sampleAnnotationTerrain(
  map: unknown,
  coordinate: [number, number],
  library: 'maplibre' | 'mapbox'
): {value: number; displayZ: number; sourceId: string} | null {
  const terrainMap = map as TerrainMap | null;
  if (!coordinate.every(Number.isFinite) || Math.abs(coordinate[1]) > 85.051129) return null;
  try {
    const options = terrainMap?.getTerrain?.();
    if (!options?.source || !terrainMap?.isSourceLoaded?.(options.source)) return null;
    let value: number | null | undefined;
    let exaggeration = options.exaggeration ?? 1;
    if (library === 'maplibre') {
      // MapLibre 4's public query returns a camera-relative offset. Its DEM
      // reader provides an absolute, unexaggerated sample, but returns zero
      // for an absent tile. Guard the covering tile before calling it. These
      // capability checks fail closed if a host changes the terrain internals.
      const terrain = terrainMap.terrain;
      const zoom = terrainMap.transform?.tileZoom;
      if (!terrain || zoom === undefined || !terrain.getDEMElevation) return null;
      const tile = terrain._getOverscaledTileIDFromLngLatZoom?.(new LngLat(...coordinate), zoom);
      if (!tile || !terrain.sourceCache?.getSourceTile?.(tile.tileID, true)?.dem) return null;
      value = terrain.getDEMElevation(
        tile.tileID,
        tile.mercatorX % 8192,
        tile.mercatorY % 8192,
        8192
      );
      exaggeration = terrain.exaggeration ?? exaggeration;
    } else {
      value = terrainMap.queryTerrainElevation?.(coordinate, {exaggerated: false});
    }
    if (
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      !Number.isFinite(exaggeration) ||
      exaggeration < 0
    )
      return null;
    const displayZ = value * exaggeration;
    return Number.isFinite(displayZ) ? {value, displayZ, sourceId: options.source} : null;
  } catch {
    return null;
  }
}
