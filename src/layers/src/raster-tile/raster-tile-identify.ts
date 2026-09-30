// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {booleanWithin} from '@turf/boolean-within';
import {point as turfPoint} from '@turf/helpers';
import type {Feature, FeatureCollection, Polygon} from 'geojson';
import type {TypedArray} from '@loaders.gl/loader-utils';

import {BandCombination} from './types';
import {PRESET_OPTIONS} from './config';

export type RasterIdentifyRow = {name: string; value: string};

export type RasterIdentifyContext = {
  isPMTiles: boolean;
  bandCombination: BandCombination | string;
  preset?: string;
  loadAssetIds?: string[];
  loadBandIndexes?: number[];
  renderBandIndexes?: number[] | null;
};

export type RasterBandStats = {
  count: number;
  min: number;
  max: number;
  mean: number;
  sum: number;
};

export type RasterZonalStats = {
  pixelCount: number;
  bands: Record<string, RasterBandStats>;
  derived?: RasterBandStats;
  derivedName?: string;
};

type TileIndex = {x: number; y: number; z: number};

type TileLike = {
  index?: TileIndex;
  bbox?: {west: number; south: number; east: number; north: number};
  data?: any;
};

const MAX_ZONAL_PIXELS = 2_000_000;

function derivedLabelFromContext(context: RasterIdentifyContext): string | undefined {
  return context.preset ? PRESET_OPTIONS[context.preset]?.label : undefined;
}

/**
 * Convert lng/lat to fractional pixel coordinates within an XYZ WebMercator tile.
 * u,v are in [0, 1] when the point is inside the tile.
 */
export function lngLatToTileUV(lng: number, lat: number, index: TileIndex): [number, number] {
  const n = 2 ** index.z;
  const x = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return [x - index.x, y - index.y];
}

export function tilePixelToLngLat(
  col: number,
  row: number,
  width: number,
  height: number,
  index: TileIndex
): [number, number] {
  const n = 2 ** index.z;
  const x = index.x + (col + 0.5) / width;
  const y = index.y + (row + 0.5) / height;
  const lng = (x / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  return [lng, (latRad * 180) / Math.PI];
}

/** WebMercator x in [0, 1] at zoom 0. */
export function lngToMercatorX(lng: number): number {
  return (lng + 180) / 360;
}

/** WebMercator y in [0, 1] at zoom 0 (0 = north). */
export function latToMercatorY(lat: number): number {
  const latRad = (lat * Math.PI) / 180;
  return (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2;
}

/**
 * Pixel size of a WGS84 bbox that matches its WebMercator aspect ratio.
 * A wide rectangle becomes a wide image instead of a square.
 */
export function mercatorPixelSizeForBbox(
  bbox: [number, number, number, number],
  maxSize: number
): {width: number; height: number} {
  const widthMerc = Math.max(lngToMercatorX(bbox[2]) - lngToMercatorX(bbox[0]), 1e-12);
  const heightMerc = Math.max(latToMercatorY(bbox[1]) - latToMercatorY(bbox[3]), 1e-12);
  const aspect = widthMerc / heightMerc;
  if (aspect >= 1) {
    return {
      width: Math.max(1, Math.round(maxSize)),
      height: Math.max(1, Math.round(maxSize / aspect))
    };
  }
  return {
    width: Math.max(1, Math.round(maxSize * aspect)),
    height: Math.max(1, Math.round(maxSize))
  };
}

export function formatRasterValue(value: number): string {
  if (!Number.isFinite(value)) {
    return 'n/a';
  }
  if (Number.isInteger(value)) {
    return String(value);
  }
  const abs = Math.abs(value);
  if (abs >= 100) {
    return value.toFixed(2);
  }
  if (abs >= 1) {
    return value.toFixed(4);
  }
  return value.toFixed(6);
}

export function getTilePixelSize(tile: TileLike | null | undefined): {
  width: number;
  height: number;
} | null {
  if (!tile?.data) {
    return null;
  }
  const bands = tile.data.images?.imageBands;
  if (Array.isArray(bands) && bands[0] && bands[0].width && bands[0].height) {
    return {width: bands[0].width, height: bands[0].height};
  }
  const rgbaSource = tile.data.images?.imageRgba?.data || tile.data.image;
  if (rgbaSource && rgbaSource.width && rgbaSource.height) {
    return {width: rgbaSource.width, height: rgbaSource.height};
  }
  return null;
}

export function findBestTileAtLngLat(
  tiles: Array<TileLike | null | undefined>,
  lng: number,
  lat: number
): TileLike | null {
  let best: TileLike | null = null;
  let bestZoom = -1;
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const index = tile?.index;
    if (!tile?.data || !index) {
      continue;
    }
    const [u, v] = lngLatToTileUV(lng, lat, index);
    if (u < 0 || v < 0 || u >= 1 || v >= 1) {
      continue;
    }
    if (index.z >= bestZoom) {
      best = tile;
      bestZoom = index.z;
    }
  }
  return best;
}

function sampleTypedBand(
  band: {data?: TypedArray; width?: number; height?: number},
  col: number,
  row: number
): number | null {
  const data = band?.data;
  const width = band?.width;
  const height = band?.height;
  if (!data || !width || !height || col < 0 || row < 0 || col >= width || row >= height) {
    return null;
  }
  const value = data[row * width + col];
  return Number.isFinite(value) ? value : null;
}

function sampleRgbaPixel(
  image: {data?: ArrayLike<number>; width?: number; height?: number} | null,
  col: number,
  row: number
): [number, number, number, number] | null {
  if (!image?.data || !image.width || !image.height) {
    return null;
  }
  if (col < 0 || row < 0 || col >= image.width || row >= image.height) {
    return null;
  }
  const idx = (row * image.width + col) * 4;
  const data = image.data;
  if (idx + 3 >= data.length) {
    return null;
  }
  return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
}

function isNodataMask(
  maskBand: {data?: TypedArray; width?: number; height?: number} | null,
  col: number,
  row: number
): boolean {
  if (!maskBand) {
    return false;
  }
  const value = sampleTypedBand(maskBand, col, row);
  return value === null || value < 1;
}

export function computeDerivedValue(
  values: number[],
  bandCombination: BandCombination | string,
  derivedLabel?: string
): {name: string; value: number} | null {
  const r = values[0];
  const g = values[1];
  const b = values[2];
  if (!Number.isFinite(r)) {
    return null;
  }

  switch (bandCombination) {
    case BandCombination.NormalizedDifference:
    case 'normalizedDifference': {
      if (!Number.isFinite(g) || r + g === 0) {
        return null;
      }
      return {name: derivedLabel || 'NDVI', value: (r - g) / (r + g)};
    }
    case BandCombination.EnhancedVegetationIndex:
    case 'enhancedVegetationIndex': {
      if (!Number.isFinite(g) || !Number.isFinite(b)) {
        return null;
      }
      const denominator = r + 6 * g - 7.5 * b + 1;
      if (denominator === 0) {
        return null;
      }
      return {name: derivedLabel || 'EVI', value: (2.5 * (r - g)) / denominator};
    }
    case BandCombination.SoilAdjustedVegetationIndex:
    case 'soilAdjustedVegetationIndex': {
      if (!Number.isFinite(g)) {
        return null;
      }
      const denominator = (r + g + 0.5) * 1.5;
      if (denominator === 0) {
        return null;
      }
      return {name: derivedLabel || 'SAVI', value: (r - g) / denominator};
    }
    case BandCombination.ModifiedSoilAdjustedVegetationIndex:
    case 'modifiedSoilAdjustedVegetationIndex': {
      if (!Number.isFinite(g)) {
        return null;
      }
      const toSqrt = (2 * r + 1) * (2 * r + 1) - 8 * (r - g);
      if (toSqrt < 0) {
        return null;
      }
      return {name: derivedLabel || 'MSAVI', value: (2 * r + 1 - Math.sqrt(toSqrt)) / 2};
    }
    default:
      return null;
  }
}

export type RasterSample = {
  lng: number;
  lat: number;
  tileIndex: TileIndex;
  col: number;
  row: number;
  bandValues: number[];
  bandLabels: string[];
  rgba?: [number, number, number, number];
  nodata: boolean;
};

export function sampleRasterTileAtLngLat(
  tiles: Array<TileLike | null | undefined>,
  lng: number,
  lat: number,
  context: RasterIdentifyContext
): RasterSample | null {
  const tile = findBestTileAtLngLat(tiles, lng, lat);
  const index = tile?.index;
  const size = getTilePixelSize(tile);
  if (!tile || !index || !size) {
    return null;
  }

  const [u, v] = lngLatToTileUV(lng, lat, index);
  const col = Math.min(size.width - 1, Math.max(0, Math.floor(u * size.width)));
  const row = Math.min(size.height - 1, Math.max(0, Math.floor(v * size.height)));

  const images = tile.data.images;
  const imageBands: Array<{data?: TypedArray; width?: number; height?: number}> | undefined =
    images?.imageBands;
  const maskBand = images?.imageMask || null;

  if (Array.isArray(imageBands) && imageBands.length > 0) {
    const order =
      Array.isArray(context.renderBandIndexes) && context.renderBandIndexes.length
        ? context.renderBandIndexes
        : imageBands.map((_, i) => i);
    const bandValues: number[] = [];
    const bandLabels: string[] = [];
    for (let i = 0; i < order.length; i++) {
      const bandIndex = order[i];
      const value = sampleTypedBand(imageBands[bandIndex], col, row);
      if (value === null) {
        continue;
      }
      bandValues.push(value);
      bandLabels.push(context.loadAssetIds?.[bandIndex] || `Band ${bandIndex + 1}`);
    }
    return {
      lng,
      lat,
      tileIndex: index,
      col,
      row,
      bandValues,
      bandLabels,
      nodata: isNodataMask(maskBand, col, row)
    };
  }

  const rgbaImage = images?.imageRgba?.data || tile.data.image;
  const rgba = sampleRgbaPixel(rgbaImage, col, row);
  if (!rgba) {
    return null;
  }
  return {
    lng,
    lat,
    tileIndex: index,
    col,
    row,
    bandValues: [rgba[0], rgba[1], rgba[2], rgba[3]],
    bandLabels: ['R', 'G', 'B', 'A'],
    rgba,
    nodata: rgba[3] === 0
  };
}

export function formatRasterIdentifyRows(
  sample: RasterSample,
  context: RasterIdentifyContext
): RasterIdentifyRow[] {
  const {z, x, y} = sample.tileIndex;
  const rows: RasterIdentifyRow[] = [
    {name: 'Longitude', value: sample.lng.toFixed(6)},
    {name: 'Latitude', value: sample.lat.toFixed(6)},
    {name: 'Tile', value: `${z}/${x}/${y}`},
    {name: 'Pixel', value: `${sample.col}, ${sample.row}`}
  ];

  if (sample.nodata) {
    rows.push({name: 'Value', value: 'NoData'});
    return rows;
  }

  if (context.isPMTiles && sample.rgba) {
    const [r, g, b, a] = sample.rgba;
    rows.push({name: 'RGBA', value: `${r}, ${g}, ${b}, ${a}`});
    return rows;
  }

  for (let i = 0; i < sample.bandValues.length; i++) {
    rows.push({
      name: sample.bandLabels[i] || `Band ${i + 1}`,
      value: formatRasterValue(sample.bandValues[i])
    });
  }

  const derived = computeDerivedValue(
    sample.bandValues,
    context.bandCombination,
    derivedLabelFromContext(context)
  );
  if (derived) {
    rows.push({name: derived.name, value: formatRasterValue(derived.value)});
  }

  return rows;
}

function emptyStats(): RasterBandStats {
  return {count: 0, min: Infinity, max: -Infinity, mean: 0, sum: 0};
}

function addStat(stats: RasterBandStats, value: number): void {
  if (!Number.isFinite(value)) {
    return;
  }
  stats.count += 1;
  stats.sum += value;
  stats.min = Math.min(stats.min, value);
  stats.max = Math.max(stats.max, value);
}

function finalizeStats(stats: RasterBandStats): RasterBandStats {
  return {
    count: stats.count,
    min: stats.count ? stats.min : NaN,
    max: stats.count ? stats.max : NaN,
    sum: stats.sum,
    mean: stats.count ? stats.sum / stats.count : NaN
  };
}

function polygonBbox(polygon: Feature<Polygon>): [number, number, number, number] | null {
  const coords = polygon.geometry?.coordinates;
  if (!coords?.[0]?.length) {
    return null;
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const ring = coords[0];
  for (let i = 0; i < ring.length; i++) {
    const [lng, lat] = ring[i];
    minX = Math.min(minX, lng);
    minY = Math.min(minY, lat);
    maxX = Math.max(maxX, lng);
    maxY = Math.max(maxY, lat);
  }
  return [minX, minY, maxX, maxY];
}

function tileIntersectsBbox(tile: TileLike, bbox: [number, number, number, number]): boolean {
  const tb = tile.bbox;
  if (!tb) {
    return true;
  }
  return !(tb.east < bbox[0] || tb.west > bbox[2] || tb.north < bbox[1] || tb.south > bbox[3]);
}

function isInsidePolygon(
  lng: number,
  lat: number,
  polygon: Feature<Polygon>,
  bbox: [number, number, number, number],
  isRectangle: boolean
): boolean {
  if (lng < bbox[0] || lat < bbox[1] || lng > bbox[2] || lat > bbox[3]) {
    return false;
  }
  if (isRectangle) {
    return true;
  }
  try {
    return booleanWithin(turfPoint([lng, lat]), polygon);
  } catch {
    return false;
  }
}

/**
 * Aggregate currently loaded tile pixels that fall inside a polygon.
 * Uses the highest-zoom tile at each location (tiles are scanned independently;
 * overlapping parent tiles are skipped when a child of higher zoom exists for that pixel
 * by only using tiles at the maximum zoom present in the intersecting set).
 */
export function computeRasterZonalStats(
  tiles: Array<TileLike | null | undefined>,
  polygon: Feature<Polygon>,
  context: RasterIdentifyContext
): RasterZonalStats {
  const bbox = polygonBbox(polygon);
  if (!bbox) {
    return {pixelCount: 0, bands: {}};
  }

  const isRectangle = polygon.properties?.shape === 'Rectangle';
  const liveTiles = tiles.filter((tile): tile is TileLike =>
    Boolean(tile?.data && tile.index && tileIntersectsBbox(tile, bbox))
  );
  if (!liveTiles.length) {
    return {pixelCount: 0, bands: {}};
  }

  const maxZoom = Math.max(...liveTiles.map(tile => tile.index?.z ?? 0));
  const scanTiles = liveTiles.filter(tile => tile.index?.z === maxZoom);

  const bandStats: Record<string, RasterBandStats> = {};
  const derivedAcc = emptyStats();
  let derivedName: string | undefined;
  let pixelCount = 0;
  let scanned = 0;

  for (let t = 0; t < scanTiles.length; t++) {
    const tile = scanTiles[t];
    const index = tile.index as TileIndex;
    const size = getTilePixelSize(tile);
    if (!size) {
      continue;
    }

    const sampleContext = context;
    for (let row = 0; row < size.height; row++) {
      for (let col = 0; col < size.width; col++) {
        if (scanned >= MAX_ZONAL_PIXELS) {
          break;
        }
        scanned += 1;
        const [lng, lat] = tilePixelToLngLat(col, row, size.width, size.height, index);
        if (!isInsidePolygon(lng, lat, polygon, bbox, isRectangle)) {
          continue;
        }

        const sample = sampleRasterTilePixel(tile, col, row, sampleContext);
        if (!sample || sample.nodata) {
          continue;
        }
        pixelCount += 1;
        for (let i = 0; i < sample.bandValues.length; i++) {
          const label = sample.bandLabels[i] || `Band ${i + 1}`;
          if (!bandStats[label]) {
            bandStats[label] = emptyStats();
          }
          addStat(bandStats[label], sample.bandValues[i]);
        }
        const derived = computeDerivedValue(
          sample.bandValues,
          context.bandCombination,
          derivedLabelFromContext(context)
        );
        if (derived) {
          derivedName = derived.name;
          addStat(derivedAcc, derived.value);
        }
      }
      if (scanned >= MAX_ZONAL_PIXELS) {
        break;
      }
    }
  }

  const bands: Record<string, RasterBandStats> = {};
  for (const [name, stats] of Object.entries(bandStats)) {
    bands[name] = finalizeStats(stats);
  }

  return {
    pixelCount,
    bands,
    ...(derivedAcc.count ? {derived: finalizeStats(derivedAcc), derivedName} : {})
  };
}

function sampleRasterTilePixel(
  tile: TileLike,
  col: number,
  row: number,
  context: RasterIdentifyContext
): RasterSample | null {
  const index = tile.index;
  if (!index) {
    return null;
  }
  const images = tile.data?.images;
  const imageBands = images?.imageBands;
  const maskBand = images?.imageMask || null;
  if (Array.isArray(imageBands) && imageBands.length > 0) {
    const order =
      Array.isArray(context.renderBandIndexes) && context.renderBandIndexes.length
        ? context.renderBandIndexes
        : imageBands.map((_, i) => i);
    const bandValues: number[] = [];
    const bandLabels: string[] = [];
    for (let i = 0; i < order.length; i++) {
      const bandIndex = order[i];
      const value = sampleTypedBand(imageBands[bandIndex], col, row);
      if (value === null) {
        continue;
      }
      bandValues.push(value);
      bandLabels.push(context.loadAssetIds?.[bandIndex] || `Band ${bandIndex + 1}`);
    }
    return {
      lng: 0,
      lat: 0,
      tileIndex: index,
      col,
      row,
      bandValues,
      bandLabels,
      nodata: isNodataMask(maskBand, col, row)
    };
  }

  const rgbaImage = images?.imageRgba?.data || tile.data?.image;
  const rgba = sampleRgbaPixel(rgbaImage, col, row);
  if (!rgba) {
    return null;
  }
  return {
    lng: 0,
    lat: 0,
    tileIndex: index,
    col,
    row,
    bandValues: [rgba[0], rgba[1], rgba[2], rgba[3]],
    bandLabels: ['R', 'G', 'B', 'A'],
    rgba,
    nodata: rgba[3] === 0
  };
}

export function zonalStatsToProperties(
  stats: RasterZonalStats,
  extra: Record<string, string | number | undefined> = {}
): Record<string, string | number> {
  const properties: Record<string, string | number> = {
    pixel_count: stats.pixelCount
  };
  for (const [key, value] of Object.entries(extra)) {
    if (value !== undefined) {
      properties[key] = value;
    }
  }
  for (const [name, band] of Object.entries(stats.bands)) {
    const slug = name.replace(/\s+/g, '_').toLowerCase();
    properties[`${slug}_count`] = band.count;
    properties[`${slug}_min`] = band.min;
    properties[`${slug}_max`] = band.max;
    properties[`${slug}_mean`] = band.mean;
  }
  if (stats.derived && stats.derivedName) {
    const slug = stats.derivedName.toLowerCase();
    properties[`${slug}_min`] = stats.derived.min;
    properties[`${slug}_max`] = stats.derived.max;
    properties[`${slug}_mean`] = stats.derived.mean;
  }
  return properties;
}

export function rasterZonalStatsToSidecar(
  stats: RasterZonalStats,
  extra: {layer?: string; preset?: string; geometry?: Polygon | null} = {}
): FeatureCollection<Polygon | null> {
  const properties = zonalStatsToProperties(stats, {
    layer: extra.layer,
    preset: extra.preset,
    shape: extra.geometry ? 'Rectangle' : undefined
  });
  if (stats.derived && stats.derivedName) {
    properties.derived = stats.derivedName;
  }
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties,
        geometry: extra.geometry ?? null
      }
    ]
  };
}

export function parseTitilerPointResponse(payload: any): RasterIdentifyRow[] | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const values = payload.values || payload.value;
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }
  const names: string[] = Array.isArray(payload.band_names)
    ? payload.band_names
    : values.map((_, i) => `Band ${i + 1}`);
  const rows: RasterIdentifyRow[] = [];
  if (Array.isArray(payload.coordinates) && payload.coordinates.length >= 2) {
    rows.push({name: 'Longitude', value: Number(payload.coordinates[0]).toFixed(6)});
    rows.push({name: 'Latitude', value: Number(payload.coordinates[1]).toFixed(6)});
  }
  for (let i = 0; i < values.length; i++) {
    const value = Number(values[i]);
    rows.push({name: names[i] || `Band ${i + 1}`, value: formatRasterValue(value)});
  }
  return rows;
}
