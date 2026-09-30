// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Feature, Polygon} from 'geojson';
import type {TypedArray} from '@loaders.gl/loader-utils';

import {withPublicTitilerCorsCacheKey} from '@kepler.gl/common-utils';

import {
  RasterIdentifyContext,
  getTilePixelSize,
  latToMercatorY,
  lngToMercatorX,
  mercatorPixelSizeForBbox
} from './raster-tile-identify';
import {getSingleCOGUrlParams, getTitilerBboxUrl} from './url';
import type {CompleteSTACObject} from './types';

const MAX_EXPORT_SIZE = 2048;

type TileLike = {
  index?: {x: number; y: number; z: number};
  bbox?: {west: number; south: number; east: number; north: number};
  data?: any;
};

function polygonBbox(polygon: Feature<Polygon>): [number, number, number, number] | null {
  const rings = polygon.geometry?.coordinates;
  if (!rings?.[0]?.length) {
    return null;
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let r = 0; r < rings.length; r++) {
    const ring = rings[r];
    for (let i = 0; i < ring.length; i++) {
      minX = Math.min(minX, ring[i][0]);
      minY = Math.min(minY, ring[i][1]);
      maxX = Math.max(maxX, ring[i][0]);
      maxY = Math.max(maxY, ring[i][1]);
    }
  }
  if (!Number.isFinite(minX)) {
    return null;
  }
  return [minX, minY, maxX, maxY];
}

/** Axis-aligned lon/lat rectangle covering the polygon. */
export function polygonToBboxRectangle(polygon: Feature<Polygon>): Feature<Polygon> | null {
  const bbox = polygonBbox(polygon);
  if (!bbox) {
    return null;
  }
  const [minLng, minLat, maxLng, maxLat] = bbox;
  return {
    type: 'Feature',
    properties: {...(polygon.properties || {}), shape: 'Rectangle'},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [minLng, minLat],
          [maxLng, minLat],
          [maxLng, maxLat],
          [minLng, maxLat],
          [minLng, minLat]
        ]
      ]
    }
  };
}

function scaleBandToByte(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (max <= min) {
    return Math.max(0, Math.min(255, Math.round(value)));
  }
  return Math.max(0, Math.min(255, Math.round(((value - min) / (max - min)) * 255)));
}

function getBandMinMax(data: TypedArray): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    if (!Number.isFinite(value)) {
      continue;
    }
    min = Math.min(min, value);
    max = Math.max(max, value);
  }
  return [min === Infinity ? 0 : min, max === -Infinity ? 1 : max];
}

function drawTileOntoCanvas(
  ctx: CanvasRenderingContext2D,
  tile: TileLike,
  canvasBounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
    z: number;
  }
): void {
  const index = tile.index;
  const size = getTilePixelSize(tile);
  if (!index || !size || index.z !== canvasBounds.z) {
    return;
  }

  const n = 2 ** index.z;
  const tileMinX = index.x / n;
  const tileMinY = index.y / n;
  const tileMaxX = (index.x + 1) / n;
  const tileMaxY = (index.y + 1) / n;

  const dx =
    ((tileMinX - canvasBounds.minX) / (canvasBounds.maxX - canvasBounds.minX)) * canvasBounds.width;
  const dy =
    ((tileMinY - canvasBounds.minY) / (canvasBounds.maxY - canvasBounds.minY)) *
    canvasBounds.height;
  const dw = ((tileMaxX - tileMinX) / (canvasBounds.maxX - canvasBounds.minX)) * canvasBounds.width;
  const dh =
    ((tileMaxY - tileMinY) / (canvasBounds.maxY - canvasBounds.minY)) * canvasBounds.height;

  const rgbaSource = tile.data?.images?.imageRgba?.data || tile.data?.image;
  if (rgbaSource && typeof document !== 'undefined') {
    try {
      ctx.drawImage(rgbaSource, dx, dy, dw, dh);
      return;
    } catch {
      // Fall through to ImageData path when the source is a raw buffer
    }
  }

  const bands = tile.data?.images?.imageBands;
  if (!Array.isArray(bands) || !bands.length) {
    return;
  }

  const imageData = new ImageData(size.width, size.height);
  const ranges = bands.map(band => (band?.data ? getBandMinMax(band.data) : [0, 1]));
  const channelCount = Math.min(3, bands.length);
  for (let i = 0; i < size.width * size.height; i++) {
    const dest = i * 4;
    for (let c = 0; c < channelCount; c++) {
      const value = bands[c]?.data?.[i];
      imageData.data[dest + c] = scaleBandToByte(value, ranges[c][0], ranges[c][1]);
    }
    if (channelCount === 1) {
      imageData.data[dest + 1] = imageData.data[dest];
      imageData.data[dest + 2] = imageData.data[dest];
    }
    const mask = tile.data?.images?.imageMask?.data?.[i];
    imageData.data[dest + 3] = mask !== undefined && mask < 1 ? 0 : 255;
  }

  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = size.width;
  tileCanvas.height = size.height;
  const tileCtx = tileCanvas.getContext('2d');
  if (!tileCtx) {
    return;
  }
  tileCtx.putImageData(imageData, 0, 0);
  ctx.drawImage(tileCanvas, dx, dy, dw, dh);
}

export function isDownloadableImageBlob(blob: Blob | null | undefined): boolean {
  return Boolean(blob && blob.size > 0 && blob.type.startsWith('image/'));
}

function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/png');
  });
}

/**
 * Composite loaded raster tiles that intersect a polygon into a PNG blob.
 * Non-rectangular drawings use the lon/lat bounding box as a rectangle.
 */
export async function mosaicTilesToPng(
  tiles: Array<TileLike | null | undefined>,
  polygon: Feature<Polygon>,
  _context: RasterIdentifyContext
): Promise<Blob | null> {
  if (typeof document === 'undefined') {
    return null;
  }
  const bbox = polygonBbox(polygon);
  if (!bbox) {
    return null;
  }

  const liveTiles = tiles.filter(tile => tile?.data && tile.index) as TileLike[];
  if (!liveTiles.length) {
    return null;
  }
  const z = Math.max(...liveTiles.map(tile => tile.index?.z ?? 0));
  const zoomTiles = liveTiles.filter(tile => tile.index?.z === z);
  const sampleSize = getTilePixelSize(zoomTiles[0]);
  if (!sampleSize) {
    return null;
  }

  const n = 2 ** z;
  const minX = lngToMercatorX(bbox[0]);
  const maxX = lngToMercatorX(bbox[2]);
  const minY = latToMercatorY(bbox[3]);
  const maxY = latToMercatorY(bbox[1]);

  const worldW = Math.max(maxX - minX, 1e-9);
  const worldH = Math.max(maxY - minY, 1e-9);
  let width = Math.round(worldW * sampleSize.width * n);
  let height = Math.round(worldH * sampleSize.height * n);
  const scale = Math.min(1, MAX_EXPORT_SIZE / Math.max(width, height, 1));
  width = Math.max(1, Math.round(width * scale));
  height = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  const canvasBounds = {minX, minY, maxX, maxY, width, height, z};
  for (let i = 0; i < zoomTiles.length; i++) {
    drawTileOntoCanvas(ctx, zoomTiles[i], canvasBounds);
  }

  return canvasToPng(canvas);
}

export async function fetchTitilerBboxPng(options: {
  stac: CompleteSTACObject & {rasterTileServerUrls?: string[]};
  loadAssetId: string;
  loadBandIndexes: number[];
  bbox: [number, number, number, number];
  width?: number;
  height?: number;
}): Promise<Blob | null> {
  const {stac, loadAssetId, loadBandIndexes, bbox} = options;
  if (!stac.rasterTileServerUrls?.length || stac.type !== 'Feature') {
    return null;
  }

  const params = getSingleCOGUrlParams({
    stac: stac as any,
    loadAssetId,
    loadBandIndexes,
    mask: false
  });
  if (!params) {
    return null;
  }

  const size =
    options.width && options.height
      ? {width: options.width, height: options.height}
      : mercatorPixelSizeForBbox(bbox, 2048);

  const urlInfo = getTitilerBboxUrl({
    stac: stac as any,
    useSTACSearching: false,
    bbox,
    width: size.width,
    height: size.height,
    format: 'png'
  });
  const url = withPublicTitilerCorsCacheKey(`${urlInfo.url}?${params.toString()}`);
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  const blob = await response.blob();
  return isDownloadableImageBlob(blob) ? blob : null;
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.dispatchEvent(new MouseEvent('click', {bubbles: false, cancelable: true, view: window}));
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export {polygonBbox};
