// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PMTilesTileSource} from '@loaders.gl/pmtiles';
import {tileIdToZxy, zxyToTileId} from 'pmtiles';
import {getCenterAndZoomFromBounds} from '@kepler.gl/utils';

const MAX_TILES = 256;
const SEARCH_ZOOM_DEPTH = 4;
type TileIndex = {x: number; y: number; z: number};
type IndexBudget = {directories: number; bytes: number; tiles: number};
type BoundsCoverage = {bounds: number[][]; minZoom: number | null};
type BoundsSearch = {key: string; id: number; minZoom: number | null; data: Promise<number[][]>};
const searches = new WeakMap<PMTilesTileSource, BoundsSearch>();
const minimumZooms = new WeakMap<PMTilesTileSource, Promise<number | null>>();
let nextSearchId = 0;

/** Match the tile zoom selected when the metadata extent fits the map. */
export function getBoundsTileZoom(bounds: number[] | undefined, width: number, height: number) {
  if (
    !bounds ||
    bounds.length !== 4 ||
    !bounds.every(Number.isFinite) ||
    Math.abs(bounds[0]) > 180 ||
    Math.abs(bounds[2]) > 180 ||
    Math.abs(bounds[1]) > 90 ||
    Math.abs(bounds[3]) > 90 ||
    bounds[1] >= bounds[3] ||
    bounds[0] === bounds[2] ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }
  const span = bounds[2] - bounds[0] + (bounds[2] < bounds[0] ? 360 : 0);
  const south = Math.max(-85.0511287798066, bounds[1]);
  const north = Math.min(85.0511287798066, bounds[3]);
  if (south >= north) return null;
  // Longitude translation preserves zoom and lets the fit utility handle wrapped extents.
  const fitted = getCenterAndZoomFromBounds([-span / 2, south, span / 2, north], {width, height});
  return fitted && Number.isFinite(fitted.zoom) ? Math.max(0, Math.round(fitted.zoom)) : null;
}

/** Read only the first index branch; tile IDs are ordered by zoom, then Hilbert position. */
export function getPMTilesMinZoom(source: PMTilesTileSource): Promise<number | null> {
  const cached = minimumZooms.get(source);
  if (cached) return cached;
  const result = readMinZoom(source).catch(() => null);
  minimumZooms.set(source, result);
  return result;
}

async function readMinZoom(
  source: PMTilesTileSource,
  budget: IndexBudget = {directories: 4, bytes: 256 * 1024, tiles: 0}
): Promise<number | null> {
  const archive = source.pmtiles;
  if (!archive) return null;
  const header = await archive.getHeader();
  if (header.specVersion !== 3) return null;
  let offset = header.rootDirectoryOffset;
  let length = header.rootDirectoryLength;
  for (let depth = 0; depth <= 3; depth++) {
    if (budget.directories-- <= 0 || length > budget.bytes) return null;
    budget.bytes -= length;
    const entries = await archive.cache.getDirectory(archive.source, offset, length, header);
    const first = entries[0];
    if (!first) return null;
    if (first.runLength > 0) return tileIdToZxy(first.tileId)[0];
    offset = header.leafDirectoryOffset + first.offset;
    length = first.length;
  }
  return null;
}

/** Cache a bounded index-only coverage search for this source revision. */
export function getPMTilesBounds(
  source: PMTilesTileSource,
  bounds: number[],
  minZoom: number,
  maxZoom: number
): BoundsSearch {
  const key = JSON.stringify([bounds, minZoom, maxZoom]);
  const cached = searches.get(source);
  if (cached?.key === key) return cached;
  const search: BoundsSearch = {
    key,
    id: nextSearchId++,
    minZoom: null,
    // An optional helper must not break normal tile rendering on a failed request.
    data: searchBounds(source, bounds, minZoom, maxZoom)
      .then(result => {
        search.minZoom = result.minZoom;
        return result.bounds;
      })
      .catch(() => [])
  };
  searches.set(source, search);
  return search;
}

async function searchBounds(
  source: PMTilesTileSource,
  bounds: number[],
  minZoom: number,
  maxZoom: number
): Promise<BoundsCoverage> {
  if (
    !Number.isInteger(minZoom) ||
    !Number.isInteger(maxZoom) ||
    minZoom < 0 ||
    maxZoom < minZoom ||
    maxZoom > 26
  ) {
    return {bounds: [], minZoom: null};
  }
  let remaining = MAX_TILES;
  const indexBudget: IndexBudget = {directories: 16, bytes: 256 * 1024, tiles: 4096};
  const firstStoredZoom = await (minimumZooms.get(source) ?? readMinZoom(source, indexBudget));
  if (firstStoredZoom === null) return {bounds: [], minZoom: null};
  const startZoom = Math.max(minZoom, firstStoredZoom);
  let coverage: TileIndex[] = [];
  for (let z = startZoom; z <= Math.min(startZoom + SEARCH_ZOOM_DEPTH, maxZoom); z++) {
    const tiles = await tilesFromIndex(source, bounds, z, remaining, indexBudget);
    // Keep the last complete level when a denser level exceeds the search budget.
    if (!tiles) break;
    remaining -= tiles.length;
    // A missing parent tile does not rule out stored tiles at deeper zooms.
    // Presence in the index is sufficient: never fetch or decode tile contents.
    if (tiles.length) coverage = tiles;
  }
  return {
    minZoom: firstStoredZoom,
    bounds: coverage
      .sort((a, b) => a.x - b.x || a.y - b.y)
      .flatMap(index => clipTileBounds(tileBounds(index), bounds))
  };
}

/** Find stored tiles without probing every possible position in a sparse archive. */
async function tilesFromIndex(
  source: PMTilesTileSource,
  bounds: number[],
  z: number,
  limit: number,
  budget: IndexBudget
): Promise<TileIndex[] | null> {
  const archive = source.pmtiles;
  if (!archive || limit <= 0) return null;
  try {
    const header = await archive.getHeader();
    if (header.specVersion !== 3) return null;
    const firstId = zxyToTileId(z, 0, 0);
    const endId = firstId + 4 ** z;
    const tiles = new Map<number, TileIndex>();
    const visit = async (
      offset: number,
      length: number,
      depth: number,
      directoryEnd: number
    ): Promise<boolean> => {
      if (depth > 3 || budget.directories <= 0 || length > budget.bytes) return false;
      budget.directories--;
      budget.bytes -= length;
      const entries = await archive.cache.getDirectory(archive.source, offset, length, header);
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (entry.tileId >= endId) break;
        const entryEnd = entry.runLength
          ? entry.tileId + entry.runLength
          : entries[i + 1]?.tileId ?? directoryEnd;
        if (entryEnd <= firstId) continue;
        if (entry.runLength === 0) {
          if (
            !(await visit(
              header.leafDirectoryOffset + entry.offset,
              entry.length,
              depth + 1,
              entryEnd
            ))
          ) {
            return false;
          }
        } else {
          for (let id = Math.max(firstId, entry.tileId); id < Math.min(endId, entryEnd); id++) {
            if (budget.tiles-- <= 0) return false;
            const [zoom, x, y] = tileIdToZxy(id);
            const index = {x, y, z: zoom};
            if (clipTileBounds(tileBounds(index), bounds).length) tiles.set(id, index);
            if (tiles.size > limit) return false;
          }
        }
      }
      return true;
    };
    return (await visit(header.rootDirectoryOffset, header.rootDirectoryLength, 0, endId))
      ? [...tiles.values()]
      : null;
  } catch {
    // Directory errors must preserve stored coverage from coarser levels.
    return null;
  }
}

function clipTileBounds(tile: number[], bounds: number[]): number[][] {
  const [west, south, east, north] = bounds;
  const minY = Math.max(tile[1], south);
  const maxY = Math.min(tile[3], north);
  if (minY >= maxY) return [];
  // Split a wrapped extent before intersecting it with ordinary XYZ tile bounds.
  const intervals =
    west > east
      ? [
          [west, 180],
          [-180, east]
        ]
      : [[west, east]];
  return intervals.flatMap(([left, right]) => {
    const minX = Math.max(tile[0], left);
    const maxX = Math.min(tile[2], right);
    return minX < maxX ? [[minX, minY, maxX, maxY]] : [];
  });
}

function tileBounds({x, y, z}: TileIndex): number[] {
  const size = 2 ** z;
  const latitude = (row: number) =>
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * row) / size))) * 180) / Math.PI;
  return [(x / size) * 360 - 180, latitude(y + 1), ((x + 1) / size) * 360 - 180, latitude(y)];
}
